# AE-101 Implementation Plan — Walkable Thangka Room

> Companion to `AE-101-walkable-thangka-room.md`. Status: plan approved-pending; no code yet.
> **Requested change vs ticket:** entry point is the hero **"View artifact"** button on `/`, not only the isolated `/room` route. See §1 for how both are satisfied.

---

## 0. What changed since the ticket was written (2026-06-09 3D overhaul)

The ticket says "reuse the hero renderer config (… PCF soft shadows, `failIfMajorPerformanceCaveat`, …)". Three of those hero facts are now stale:

1. **`failIfMajorPerformanceCaveat` was removed from the hero** — it black-screened every software-GL browser (verified via headless SwiftShader). The room must NOT reintroduce it. The ticket's no-WebGL fallback (§5) is implemented by graceful detection instead.
2. **The hero no longer has a shadow pipeline** (an eyeball alone had nothing to receive shadows). The _room_ genuinely needs shadows (spot key light → wall/floor), so the room rig re-enables them locally on its own Canvas — `PCFShadowMap` (PCFSoft is deprecated in three r184), 1024–2048 spot shadow map, `shadow-bias -0.0005`.
3. **Asset pipeline exists now**: `scripts/rebuild-eye-glb.cjs` (meshopt + vertex-color fixes). Any room GLB (frame moulding, future plinth) goes through it. Texture compression for the thangka quad gets a sibling script (§4).

Also reusable from that work: the local **Lightformer `<Environment>`** pattern (no network HDR) for subtle reflections on the frame/floor, and headless-chromium SwiftShader as the low-end perf/compat test rig.

---

## 1. Entry point: "View artifact" → the room (and the ticket's isolation)

The ticket isolates the room at `/room` (noindex) explicitly so the `/` hypothesis test is undisturbed. Wiring it to the hero CTA changes that calculus — **this is a deliberate product decision by the reporter, recorded here.** The analytics events (§7) become the guardrail instead: `room_*` events let us see whether the room helps or hurts inquiry click-through.

Build the room as one self-contained client component with two mounts:

- **`<ThangkaRoomExperience onClose={…} />`** — full-screen overlay (same pattern as the existing `PanoramaRoom` modal in `ThangkaExperience.tsx`: `fixed inset-0 z-[1000]`, body-scroll lock, Esc/close button). `z-[1000]` matters: it must cover the persistent eye-logo canvas at `z-30`.
- **`app/room/page.tsx`** — thin page mounting the same component, `robots: { index: false }`, kept for isolated evaluation/QA per the ticket.

Hero wiring (`components/hero/HeroRoot.tsx`): "View artifact" becomes a `<button>` that lazy-loads the room:

```tsx
const ThangkaRoomExperience = dynamic(() => import('../3d/room/ThangkaRoomExperience'), {
  ssr: false,
})
// state: const [roomOpen, setRoomOpen] = useState(false)
// CTA: onClick={() => setRoomOpen(true)}  (was href="#artifact")
```

`next/dynamic` + click-gating keeps the room chunk **out of the `/` initial bundle** (ticket NFR: no `/` regression — verify with `next build` output before/after). The secondary "Inquire" CTA keeps its anchor behavior; consider keeping a small "or scroll to details" link so the page content is still discoverable.

Open product question (doesn't block build): does the `#artifact` section's `ThangkaExperience` click-to-open-360 also switch to the room, replacing `PanoramaRoom`? Recommendation: yes in a follow-up, once the room wins; don't double the scope of this story.

---

## 2. Component tree (as ticket, plus the overlay wrapper)

```
components/3d/room/
  ThangkaRoomExperience.tsx  # overlay shell: WebGL preflight, Suspense, RoomOverlay DOM, analytics lifecycle
  RoomCanvas.tsx             # <Canvas shadows dpr=[1,1.5]> + renderer config + GLContextEvents (copy hero pattern incl. webglcontextrestored)
  RoomShell.tsx              # 6m × 8m × 3.5m box: floor/ceiling/4 walls from primitives, brand-dark materials
  ThangkaWall.tsx            # framed quad: thangka texture (sRGB, anisotropy 8, mips), simple frame moulding boxes
  GalleryLights.tsx          # ambient 0.12–0.2 + warm SpotLight key on the painting (castShadow) + cool fill + floor bounce
  FirstPersonRig.tsx         # WASD/pointer-lock (desktop), touch scheme (mobile), AABB clamp, reduced-motion path
  InspectHotspot.tsx         # proximity (<1.5m) detection in useFrame → store.inspecting
RoomOverlay.tsx              # 2D DOM: "Click to enter", artifact label, Inquire CTA, exit control
components/state/useRoomStore.ts
```

Per-frame data (player position/yaw) lives in **refs inside FirstPersonRig**, never in the store. The store holds only discrete state: `entered`, `inspecting`, `controlScheme`, `webglFailed`.

## 3. Navigation (subtask 1 spike — recommendation to validate first)

- **Desktop**: drei `PointerLockControls` + drei `KeyboardControls` for WASD/arrows. Explicit "Click to enter" gesture; handle `pointerlockchange`/`pointerlockerror` (Safari quirks); Esc exits to overlay UI. Movement: damped velocity (`maath/easing`, already a dep), max ~1.4 m/s walk speed, eye height 1.6m.
- **Mobile**: **tap-to-walk-to-hotspot** for v1 — tap a floor point / the painting → camera eases along a straight path (room is convex, no pathfinding needed). Dual-zone virtual joysticks are the fallback if the spike shows tap-to-walk feels dead; joysticks are higher nausea + build cost.
- **Collision**: clamp the proposed position each frame to the room AABB inset by a 0.35m player radius. No physics dep.
- **Reduced-motion / keyboard-AT path**: a persistent "View painting" button that teleports (reduced-motion) or eases (otherwise) the camera to the ideal inspect transform. This same transform is the inspect target, so it's one code path.

## 4. Thangka asset

- v1 texture: existing `public/artifacts/thangka-centerpiece.jpg` (1.7MB) through `TextureLoader` + Suspense — swappable prop.
- Follow-up in the same PR if time allows: KTX2/Basis via a `scripts/build-textures.cjs` (toktx or `@gltf-transform` ktx2); drei `useKTX2` wires the transcoder. The decision the ticket defers ("which thangka + artisan metadata") still needs the reporter.
- Painting physical size ~0.9m × 1.4m at 1.5m eye-center height on the 8m focal wall.

## 5. WebGL preflight + fallback (ticket §11, adjusted)

In `ThangkaRoomExperience`, before mounting `RoomCanvas`:

```ts
const ok = !!document
  .createElement('canvas')
  .getContext('webgl2', { powerPreference: 'high-performance' })
```

plus an error boundary around `<Canvas>` (R3F throws synchronously on context-creation failure — exactly what the hero bug demonstrated). On failure → static `next/image` thangka + label + Inquire CTA inside the same overlay. **No `failIfMajorPerformanceCaveat` anywhere** — SwiftShader users get the real room (it renders; verified the hero does on SwiftShader), only genuinely broken contexts get the fallback.

## 6. Lighting (subtask 3)

Per ticket §Lighting, with today's amendments: room Canvas opts into `shadows` locally; only the painting key spot casts (one shadow map total); walls `#141210`-range warm dark so the thangka is the brightest surface from the inspect position (acceptance criterion — eyeball it via screenshot luminance). Add the hero's Lightformer `<Environment frames={1} resolution={256}>` for frame/floor speculars.

## 7. Analytics + inquiry CTA (subtask 6)

`track()` from `@vercel/analytics`: `room_entered` (pointer lock / first move), `room_inspect_reached` (first proximity trigger), `room_inquire_click`, and `room_exited` with `{ seconds }`. The CTA scrolls/links to the existing `#inquire` form after closing the overlay (no new backend). Because the room is now reachable from the hero, also fire `room_opened` on overlay mount so funnel drop-off between open → enter is visible.

## 8. Sequencing (3 PRs)

| PR    | Contents                                                                                                                                     | Gate                                                                                                                        |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **A** | Spike artifacts + `RoomCanvas` + `RoomShell` + `GalleryLights` + `ThangkaWall` + `/room` page (noindex). Static camera at inspect transform. | Visual sign-off on look/lighting; SwiftShader + real-GPU screenshots; `/` bundle unchanged                                  |
| **B** | `FirstPersonRig` + `InspectHotspot` + `RoomOverlay` + `useRoomStore` + reduced-motion path + WebGL fallback                                  | Acceptance scenarios 1, 3, 4, 5, 7; agent reviews: `r3f-3d-auditor`, `a11y-reviewer`, `zustand-auditor`, `hydration-sleuth` |
| **C** | Hero "View artifact" wiring (overlay mount) + analytics + leak test (3× enter/exit) + perf numbers in PR                                     | Scenarios 2, 6, 8 (8 amended: `/` initial bundle unchanged, room chunk lazy); lint + build                                  |

Estimate matches the ticket's 8 points; PR A ≈ 3, B ≈ 4, C ≈ 1.

## 9. Risks beyond the ticket's table

- **Two live WebGL contexts** while the room is open (88×55 logo canvas + room). Cost is negligible, but if it bothers profiling, hide the logo overlay (`CanvasOverlay`) while the room is open — it's beneath `z-[1000]` anyway.
- **Hero CTA change touches the hypothesis page** — the one thing the ticket tried to avoid. Mitigation: the change is a single lazy mount; rollback is reverting one button handler. Decide the comparison metric (ticket's open question) _before_ PR C ships.
- **iOS Safari pointer lock** is unavailable → desktop-Safari-on-touch and iPads take the mobile scheme; detect via `'onpointerlockchange' in document` rather than UA sniffing.
