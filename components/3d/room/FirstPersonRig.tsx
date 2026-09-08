'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { requestPointerLockSafely } from './requestPointerLock'
import * as THREE from 'three'
import { useRoomStore } from '../../state/useRoomStore'
import {
  BOUNDS,
  EYE_HEIGHT,
  FLOOR_MESH_NAME,
  INSPECT_LOOKAT,
  INSPECT_POSITION,
  PAINTING_GROUP_NAME,
  PAINTING_MESH_NAME,
  SPAWN_POSITION,
} from './constants'

const WALK_SPEED = 1.6 // m/s
const KEY_TURN_SPEED = 1.7 // rad/s (keyboard-only look)
const TOUCH_LOOK_SPEED = 0.0024 // rad per CSS px of drag
// Mouse-look sensitivity. Three's default (1.0) is jarring for a slow
// gallery walk — a calm fraction of it reads as deliberate, not twitchy.
const POINTER_LOOK_SPEED = 0.4
const PITCH_LIMIT = 1.15
const TAP_SLOP_PX = 8

const MOVE_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyQ',
  'KeyE',
])

// First-person navigation. Control scheme (decided in the AE-101 spike,
// recorded here):
//   - Desktop: pointer-lock mouse-look (engaged via the overlay's "Click to
//     enter" button) + WASD/arrow movement.
//   - Keyboard-only / unlocked: WASD + up/down arrows move; left/right
//     arrows and Q/E rotate, so no pointer is ever required.
//   - Touch: drag to look, tap to walk (raycast to the floor; tapping the
//     painting walks to the inspect position). Dual-zone joysticks were
//     rejected — higher motion-sickness risk and build cost for v1.
// All per-frame state lives in refs; the store only sees discrete events.
export default function FirstPersonRig() {
  const { camera, gl, scene } = useThree()

  const setEntered = useRoomStore((s) => s.setEntered)
  const setLocked = useRoomStore((s) => s.setLocked)
  const viewPaintingRequest = useRoomStore((s) => s.viewPaintingRequest)

  const keysRef = useRef<Set<string>>(new Set())
  const velocityRef = useRef(new THREE.Vector3())
  // Scratch vector reused every frame — never allocate in useFrame.
  const desiredRef = useRef(new THREE.Vector3())
  const walkTargetRef = useRef<THREE.Vector3 | null>(null)
  const easeRef = useRef<{ pos: THREE.Vector3; quat: THREE.Quaternion } | null>(null)
  const handledViewRequestRef = useRef(0)

  // This component only mounts inside the ssr:false canvas, but guard the
  // browser globals anyway so the safety is intrinsic, not structural.
  const isCoarsePointer = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    [],
  )
  const supportsPointerLock = useMemo(
    () => typeof document !== 'undefined' && 'onpointerlockchange' in document && !isCoarsePointer,
    [isCoarsePointer],
  )
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Spawn: south end, facing the painting. YXZ keeps yaw/pitch independent
  // (FPS convention, same order PointerLockControls uses).
  useEffect(() => {
    camera.rotation.order = 'YXZ'
    camera.position.set(...SPAWN_POSITION)
    camera.lookAt(0, EYE_HEIGHT, -1)
  }, [camera])

  // Subscribe synchronously so the browser request stays inside the button's
  // user gesture. Handle both promise rejection and older error-event APIs.
  useEffect(() => {
    const el = gl.domElement
    let active = true
    const fallback = () => {
      if (!active) return
      useRoomStore.getState().setPointerLockFailed(true)
      setLocked(false)
      setEntered(true)
    }
    const changed = () => {
      const locked = document.pointerLockElement === el
      setLocked(locked)
      if (locked) setEntered(true)
    }
    const look = (event: MouseEvent) => {
      if (document.pointerLockElement !== el) return
      camera.rotation.y -= event.movementX * 0.002 * POINTER_LOOK_SPEED
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - event.movementY * 0.002 * POINTER_LOOK_SPEED,
        -PITCH_LIMIT,
        PITCH_LIMIT,
      )
    }
    const unsubscribe = useRoomStore.subscribe(
      (s) => s.lockRequest,
      () => {
        if (!supportsPointerLock || useRoomStore.getState().pointerLockFailed) {
          fallback()
          return
        }
        void requestPointerLockSafely(el, fallback)
      },
    )
    document.addEventListener('pointerlockchange', changed)
    document.addEventListener('pointerlockerror', fallback)
    document.addEventListener('mousemove', look)
    return () => {
      active = false
      unsubscribe()
      document.removeEventListener('pointerlockchange', changed)
      document.removeEventListener('pointerlockerror', fallback)
      document.removeEventListener('mousemove', look)
      if (document.pointerLockElement === el) document.exitPointerLock()
      setLocked(false)
    }
  }, [camera, gl, setEntered, setLocked, supportsPointerLock])

  // Keyboard movement.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!MOVE_KEYS.has(e.code)) return
      // The room owns these keys while mounted (arrows would scroll the page).
      e.preventDefault()
      keysRef.current.add(e.code)
      walkTargetRef.current = null
      easeRef.current = null
      setEntered(true)
    }
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.code)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [setEntered])

  // Touch / unlocked-mouse: drag to look, tap to walk.
  useEffect(() => {
    const el = gl.domElement
    const raycaster = new THREE.Raycaster()
    let start: { x: number; y: number } | null = null
    let dragging = false
    let last = { x: 0, y: 0 }

    const onPointerDown = (e: PointerEvent) => {
      if (document.pointerLockElement) return
      start = { x: e.clientX, y: e.clientY }
      last = { x: e.clientX, y: e.clientY }
      dragging = false
      el.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (document.pointerLockElement || !start) return
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      last = { x: e.clientX, y: e.clientY }
      if (!dragging && Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_SLOP_PX) {
        dragging = true
        easeRef.current = null
        setEntered(true)
      }
      if (dragging) {
        camera.rotation.y -= dx * TOUCH_LOOK_SPEED
        camera.rotation.x = THREE.MathUtils.clamp(
          camera.rotation.x - dy * TOUCH_LOOK_SPEED,
          -PITCH_LIMIT,
          PITCH_LIMIT,
        )
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      if (document.pointerLockElement || !start) return
      const wasTap = !dragging
      start = null
      if (!wasTap) return

      // Tap: walk to the tapped floor point; tapping the painting walks to
      // the inspect position.
      const rect = el.getBoundingClientRect()
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      )
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      for (const hit of hits) {
        const name = hit.object.name
        let target: THREE.Vector3 | null = null
        if (name === PAINTING_MESH_NAME || hit.object.parent?.name === PAINTING_GROUP_NAME) {
          target = new THREE.Vector3(...INSPECT_POSITION)
        } else if (name === FLOOR_MESH_NAME) {
          target = hit.point.clone()
        }
        if (target) {
          target.y = EYE_HEIGHT
          target.x = THREE.MathUtils.clamp(target.x, BOUNDS.minX, BOUNDS.maxX)
          target.z = THREE.MathUtils.clamp(target.z, BOUNDS.minZ, BOUNDS.maxZ)
          walkTargetRef.current = target
          easeRef.current = null
          setEntered(true)
          break
        }
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    }
  }, [camera, gl, scene, setEntered])

  useFrame((_state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const keys = keysRef.current

    // "View painting" request → ease (or jump, reduced motion) to the
    // inspect transform.
    if (viewPaintingRequest > handledViewRequestRef.current) {
      handledViewRequestRef.current = viewPaintingRequest
      const pos = new THREE.Vector3(...INSPECT_POSITION)
      const quat = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(pos, new THREE.Vector3(...INSPECT_LOOKAT), camera.up),
      )
      if (prefersReducedMotion) {
        camera.position.copy(pos)
        camera.quaternion.copy(quat)
      } else {
        easeRef.current = { pos, quat }
      }
      walkTargetRef.current = null
    }

    const ease = easeRef.current
    if (ease) {
      const k = 1 - Math.exp(-delta / 0.3)
      camera.position.lerp(ease.pos, k)
      camera.quaternion.slerp(ease.quat, k)
      if (camera.position.distanceTo(ease.pos) < 0.02) {
        camera.position.copy(ease.pos)
        camera.quaternion.copy(ease.quat)
        easeRef.current = null
      }
      return
    }

    // Keyboard look (left/right arrows + Q/E rotate when not pointer-locked,
    // so keyboard-only users can turn).
    if (!document.pointerLockElement) {
      let turn = 0
      if (keys.has('ArrowLeft') || keys.has('KeyQ')) turn += 1
      if (keys.has('ArrowRight') || keys.has('KeyE')) turn -= 1
      if (turn !== 0) camera.rotation.y += turn * KEY_TURN_SPEED * delta
    }

    // Movement vector in camera-yaw space, projected onto the floor.
    let fwd = 0
    let strafe = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) fwd += 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) fwd -= 1
    if (keys.has('KeyA')) strafe -= 1
    if (keys.has('KeyD')) strafe += 1
    // When locked, arrows strafe like A/D (standard FPS expectation).
    if (document.pointerLockElement) {
      if (keys.has('ArrowLeft')) strafe -= 1
      if (keys.has('ArrowRight')) strafe += 1
    }

    const desired = desiredRef.current.set(0, 0, 0)
    if (fwd !== 0 || strafe !== 0) {
      const yaw = camera.rotation.y
      desired
        .set(
          Math.sin(-yaw) * fwd + Math.cos(yaw) * strafe,
          0,
          -Math.cos(yaw) * fwd + Math.sin(yaw) * strafe,
        )
        .normalize()
        .multiplyScalar(WALK_SPEED)
      walkTargetRef.current = null
    } else if (walkTargetRef.current) {
      const to = walkTargetRef.current.clone().sub(camera.position)
      to.y = 0
      const dist = to.length()
      if (dist < 0.06) {
        walkTargetRef.current = null
      } else {
        desired.copy(to.normalize().multiplyScalar(Math.min(WALK_SPEED, dist * 3)))
      }
    }

    // Damped velocity, AABB clamp, fixed eye height.
    const k = 1 - Math.exp(-delta / 0.12)
    velocityRef.current.lerp(desired, k)
    if (velocityRef.current.lengthSq() > 1e-6) {
      camera.position.addScaledVector(velocityRef.current, delta)
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, BOUNDS.minX, BOUNDS.maxX)
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, BOUNDS.minZ, BOUNDS.maxZ)
      camera.position.y = EYE_HEIGHT
    }
  })

  return null
}
