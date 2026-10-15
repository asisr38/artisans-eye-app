import test from 'node:test'
import assert from 'node:assert/strict'
import { journeyFrame } from '../components/gallery/journey.ts'
import { BOUNDS, ROOM_HEIGHT } from '../components/3d/room/constants.ts'

test('camera path stays inside the gallery and approaches the work without reversing', () => {
  let previousZ = Infinity
  for (let i = 0; i <= 200; i++) {
    const frame = journeyFrame(i / 100)
    const [x, y, z] = frame.position
    assert.ok(x >= BOUNDS.minX && x <= BOUNDS.maxX)
    assert.ok(y > 0 && y < ROOM_HEIGHT)
    assert.ok(z >= BOUNDS.minZ && z <= BOUNDS.maxZ)
    assert.ok(z <= previousZ)
    assert.ok(frame.target[2] < z)
    assert.ok(frame.fov >= 50 && frame.fov <= 60)
    previousZ = z
  }
})

test('camera clamps out-of-range and invalid progress', () => {
  assert.deepEqual(journeyFrame(-1), journeyFrame(0))
  assert.deepEqual(journeyFrame(20), journeyFrame(2))
  assert.deepEqual(journeyFrame(NaN), journeyFrame(0))
  assert.deepEqual(journeyFrame(Infinity), journeyFrame(0))
})

test('reduced motion selects stationary chapter views without interpolation', () => {
  for (const progress of [0, 0.2, 0.49, 0.5, 0.9, 1.2, 1.49, 1.5, 1.8, 2]) {
    assert.deepEqual(journeyFrame(progress, true), journeyFrame(Math.round(progress)))
  }
})
