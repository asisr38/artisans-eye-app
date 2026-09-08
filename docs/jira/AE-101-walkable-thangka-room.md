# AE-101 — Walkable single-artifact "Thangka Room" (3D gallery space)

| Field            | Value                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Type**         | Story                                                                                                                                     |
| **Epic**         | 3D Artifact Presentation                                                                                                                  |
| **Priority**     | Medium                                                                                                                                    |
| **Status**       | `In review` — implemented 2026-06-09 (see `AE-101-implementation-plan.md`); pending real-device mobile QA + Vercel Analytics verification |
| **Labels**       | `3d`, `r3f`, `thangka`, `experimental`, `needs-spike`                                                                                     |
| **Components**   | `components/3d`, `app`                                                                                                                    |
| **Story Points** | 8 (see breakdown)                                                                                                                         |
| **Reporter**     | Ashish                                                                                                                                    |
| **Owner**        | TBD                                                                                                                                       |

---

## ⚠️ Scope guardrail (read first)

`CLAUDE.md` is explicit: **the MVP is one page, one artifact, no catalog.** The hypothesis under test is _per-artifact_ ("Will a Western buyer send a qualified inquiry for a **single**, beautifully presented piece?").

This story is deliberately scoped to a **single-artifact** walkable room — one thangka on one wall — **not** a multi-piece museum hall. A multi-artifact museum = a multi-artifact catalog rendered in WebGL, which is the single largest documented scope risk for this repo and is **out of scope** until the inquiry hypothesis validates.

If this story starts growing toward "more pieces / more rooms / a hall," **stop and re-open the scope decision** with the owner before writing code. Do not let AE-101 become a catalog by accretion.

This story also does **not** ship to the live MVP page by default. It lands behind an isolated, non-indexed route (`/room`) so it can be evaluated without disturbing the hypothesis test on `/`.

---

## Summary

Build a **walkable, properly-lit 3D room** that presents **one thangka painting** mounted on a gallery wall. The visitor enters the room, can move and look around with first-person controls (desktop pointer-lock + mobile touch), and can walk up to the painting to inspect it under focused gallery lighting. This is a spatial alternative to the static hero presentation — same "single artifact, gorgeously presented" goal, expressed as a room instead of a framed canvas.

Thangka-first per `CLAUDE.md` ("thangka first; sculpture second"). The room/lighting/navigation engine should be artifact-agnostic enough that a sculpture-on-a-plinth variant (future story) reuses it, but **this story only delivers the thangka wall treatment.**

---

## User story

> **As a** prospective Western buyer browsing on desktop or mobile,
> **I want** to step into a calm, well-lit gallery room and walk up to a single thangka,
> **so that** I experience the piece the way I would in a real gallery — at scale, in space, with controlled light — and feel confident enough to send a purchase inquiry.

---

## Background / context

- The current `/` hero (`components/3d/HeroCanvas.tsx`) renders the brand "eye" GLB with an ACES-Filmic, soft-shadow, key/fill/rim lighting rig and a starfield backdrop. **Reuse that lighting philosophy and renderer config** — it already encodes the brand's premium dark look.
- Scene state lives in `components/state/useSceneStore.ts` (Zustand + `subscribeWithSelector`). It currently holds `cameraTargetPosition`, `eyeScale`, and `introPhase`. The room needs its own slice(s); **do not overload the eye/hero state.**
- 3D is client-only throughout this repo (`dynamic(..., { ssr: false })`, `mounted` gating, `suppressHydrationWarning`). The room must follow the same hydration-safe patterns.
- Brand palette (`THEME.md`): bg `#0D0D10`, accent `#FFAB1E` / `#FFB74D` / `#FF8F00`, text `#E4E4E8`. Gallery surfaces should stay in this restrained dark range — **no bright white "museum" walls**; use deep warm-neutral walls so the thangka's pigments and gold read as the brightest thing in the room.

---

## In scope

1. A new isolated route `app/room/page.tsx` rendering the room client-side only.
2. A `RoomCanvas` (`components/3d/room/RoomCanvas.tsx`) `<Canvas>` reusing the hero renderer config (ACES Filmic, PCF soft shadows, `dpr={[1, 1.5]}`, high-performance, `failIfMajorPerformanceCaveat`, `webglcontextlost` guard).
3. **Room geometry**: a simple enclosed box room (floor, ceiling, 4 walls) with correct scale (~6m × 8m × 3.5m). Built from primitives — no external room GLB required for v1.
4. **One thangka** mounted on the focal wall: a textured quad/frame. v1 may use a placeholder high-res thangka image from `public/artifacts/`; the asset is swappable.
5. **Gallery lighting rig**: soft ambient base + a focused spot/rect-area light washing the thangka, warm key + cool fill consistent with the hero, gentle bounce so the room isn't pitch black. Painting must be the luminance focal point.
6. **First-person navigation**:
   - Desktop: WASD/arrow movement + pointer-lock mouse-look (drei `PointerLockControls` or equivalent), with a visible "Click to enter" prompt.
   - Mobile/touch: dual-zone touch (left = move, right = look) **or** tap-to-walk-to-hotspot fallback. Pick one in the spike; document the choice.
   - Movement is constrained to the room (wall collision via simple AABB clamp — no physics engine).
7. **Inspect affordance**: walking within ~1.5m of the thangka triggers a subtle focus state (camera ease toward an ideal viewing transform and/or an overlay revealing the artifact title + "Inquire" CTA). Reuse the existing inquiry CTA pattern — do **not** build a new inquiry backend.
8. **Reduced-motion + accessibility fallback**: respect `prefers-reduced-motion`; provide a non-pointer-lock way to view the painting (e.g. a "View painting" button that eases the camera to the inspect transform) so keyboard/AT users and reduced-motion users aren't locked out. Coordinate with the `a11y-reviewer` agent.
9. **Performance budget** (see NFRs) enforced and measured.
10. **Cleanup correctness**: geometries/materials/textures disposed on unmount; all event listeners (pointer lock, resize, keydown, deviceorientation if used) removed. No mutation of shared Three.js materials (clone-modify-assign pattern, per `CLAUDE.md`).
11. **No-WebGL fallback**: if the context fails to initialize (unsupported browser, major-performance-caveat failure, context loss without recovery), render a static high-res thangka image with the artifact label and the same Inquire CTA — the visitor is never dead-ended.
12. **Analytics for evaluation**: instrument the room with `@vercel/analytics` `track()` events — `room_entered`, `room_inspect_reached`, `room_inquire_click`, plus time-in-room on exit. These are the comparison basis against the `/` hero's engagement/inquiry metrics; without them the "evaluate separately" plan has no data.

## Out of scope (explicit — do not build)

- ❌ More than one artifact / any second piece in the room.
- ❌ Multiple rooms, doorways, corridors, a "hall."
- ❌ Sculpture/turntable presentation (separate future story; engine should _allow_ it, this story doesn't _ship_ it).
- ❌ Cart, checkout, accounts, or any new inquiry backend (reuse existing CTA only).
- ❌ Replacing the `/` MVP hero. AE-101 lives at `/room`, `noindex`, not linked from the hypothesis page.
- ❌ Physics engine, baked GI/lightmaps pipeline, multiplayer, audio tour. (Note them as _future_ if desired; don't build.)
- ❌ Web3 / provenance / NFT of any kind.

---

## Technical design

### Routing

- `app/room/page.tsx` — server shell, `export const metadata = { robots: { index: false, follow: false } }`.
- Dynamically import `RoomCanvas` with `{ ssr: false }`; gate on a `mounted` flag; `suppressHydrationWarning` on the wrapping `<section>`.

### Component tree (`components/3d/room/`)

```
RoomCanvas.tsx        # <Canvas> + renderer config + GLContextEvents (reuse hero pattern)
  RoomShell.tsx       # floor/ceiling/walls primitives, materials (clone-modify-assign)
  ThangkaWall.tsx     # framed thangka quad + texture, anisotropy, color space sRGB
  GalleryLights.tsx   # ambient + spot/rectArea key + cool fill + bounce
  FirstPersonRig.tsx  # movement + look controls + AABB wall clamp + reduced-motion fallback
  InspectHotspot.tsx  # proximity detection -> focus ease + CTA overlay trigger
RoomOverlay.tsx       # 2D DOM: enter prompt, artifact label, Inquire CTA, exit/back
```

### State (`components/state/useRoomStore.ts` — new, separate from `useSceneStore`)

- `entered: boolean` (pointer-lock engaged / experience started)
- `playerPosition`, `playerRotation` (or kept in a ref if churn is high — measure first)
- `inspecting: boolean` + `focusTarget` transform
- Use `subscribeWithSelector`; use `useShallow` for any multi-field selector (per `zustand-auditor` guidance). Keep per-frame data (position each frame) **out of React state** — drive it via refs/`useFrame` to avoid re-render storms.

### Lighting approach

- Base `ambientLight` ~0.12–0.2 (lower than hero — a room reads darker than a void).
- Painting key: `SpotLight` (or `RectAreaLight` for a softer wash) aimed at the thangka, warm (`#ffd9b0`-ish), `penumbra` high, `castShadow`, 2048 shadow map, `shadow-bias ~ -0.0005` (mirror hero values).
- Cool fill `pointLight`/`directionalLight` low intensity to keep shadow sides from going black.
- Subtle floor bounce so footing is visible.
- Tone mapping: `ACESFilmicToneMapping`, exposure ~1.1–1.2.
- **Goal metric:** the thangka is the brightest surface in frame from the inspect position.

### Navigation & collision

- Movement vector from input → clamped to room AABB inset by player radius. No external physics dep.
- Pointer lock on desktop with explicit user gesture ("Click to enter"); restore cursor + state on `Esc`/pointerlockchange.
- Mobile control scheme decided in the spike subtask; documented in the PR.

### Performance / NFRs

- Target **60fps desktop**, **≥30fps** mid-tier mobile, at `dpr` cap 1.5.
- ≤ ~80k triangles total for v1 (room is primitives; budget is mostly the framed thangka + any frame moulding).
- Thangka texture: compressed (KTX2/Basis preferred — aligns with the Draco+KTX2 pipeline already planned for the sculpture story), mip-mapped, `anisotropy` set, sRGB color space; lazy/Suspense-loaded with a graceful fallback.
- No memory growth across enter→inspect→exit→re-enter cycles (verify disposal).
- Bundle: room code split out of the `/` route entirely (route-level code splitting; no regression to MVP page weight).

---

## Acceptance criteria (Gherkin)

```gherkin
Scenario: Visitor enters the room on desktop
  Given the visitor navigates to /room on a desktop browser
  And the 3D context initializes without a WebGL major-performance-caveat failure
  When the visitor clicks the "Click to enter" prompt
  Then pointer lock engages and they can move with WASD/arrows and look with the mouse
  And they cannot walk through any wall, the floor, or the ceiling

Scenario: The thangka is the focal point under gallery light
  Given the visitor is inside the room
  When they look toward the focal wall
  Then a single thangka is mounted and lit such that it is the brightest surface in view
  And room walls remain in the restrained dark brand palette (no blown-out white)

Scenario: Walking up to inspect reveals the inquiry CTA
  Given the visitor moves within ~1.5m of the thangka
  Then the camera eases toward an ideal viewing transform (or a focus state engages)
  And an overlay reveals the artifact title and an "Inquire to purchase" CTA
  And activating the CTA uses the existing inquiry flow (no new backend)

Scenario: Reduced-motion / keyboard fallback
  Given the visitor has prefers-reduced-motion enabled OR cannot use pointer lock
  When they choose "View painting"
  Then the camera transitions (respecting reduced-motion) to the inspect view
  And the artifact label and Inquire CTA are reachable without pointer lock

Scenario: Mobile touch navigation
  Given the visitor opens /room on a touch device
  Then they can move and look using the documented touch scheme
  And the experience holds >= 30fps on a mid-tier device

Scenario: No leaks across re-entry
  Given the visitor enters, inspects, and leaves the room three times
  Then GPU/JS memory does not grow unbounded
  And all listeners (pointerlock, keydown, resize) are removed on unmount

Scenario: WebGL unavailable
  Given the visitor's browser cannot initialize a WebGL context (or fails the performance caveat)
  When they navigate to /room
  Then a static thangka image renders with the artifact label and Inquire CTA
  And no blank canvas or unhandled error is shown

Scenario: Isolation from the MVP
  Given the live MVP page at /
  Then it is unchanged, /room is noindex, and the / route bundle size does not regress
```

---

## Subtasks

1. **[Spike] Navigation + mobile control scheme** (1pt) — prototype pointer-lock vs touch dual-zone vs tap-to-walk; pick one; record decision. Confirm drei controls vs hand-rolled.
2. **RoomShell geometry + materials** (1pt) — box room, correct scale, brand-palette materials, clone-modify-assign.
3. **GalleryLights rig** (1pt) — port hero lighting philosophy; tune so thangka is the luminance focal point; shadows tuned.
4. **ThangkaWall** (1pt) — framed quad, texture pipeline (sRGB, anisotropy, mips, Suspense fallback), swappable asset.
5. **FirstPersonRig** (2pt) — movement, look, AABB wall clamp, pointer-lock lifecycle, reduced-motion fallback path.
6. **InspectHotspot + RoomOverlay + CTA wiring + analytics** (1pt) — proximity focus, label, reuse existing Inquire CTA; `track()` events (`room_entered`, `room_inspect_reached`, `room_inquire_click`, time-in-room) and the static no-WebGL fallback.
7. **`useRoomStore` + hydration-safe `/room` route** (0.5pt) — separate Zustand slice, `ssr:false` dynamic import, `mounted` gate, `noindex`.
8. **Perf + a11y + disposal pass** (0.5pt) — measure fps/budget, run `a11y-reviewer` + `r3f-3d-auditor`, verify no leaks.

---

## Definition of Done

- [ ] All acceptance scenarios pass on desktop Chrome + one mobile browser.
- [ ] `r3f-3d-auditor` review clean (no shared-material mutation, disposal correct, listeners cleaned, context-loss handled).
- [ ] `a11y-reviewer` review clean (keyboard/AT path, reduced-motion, focus management, contrast).
- [ ] `hydration-sleuth` review clean (no SSR/CSR mismatch on `/room`).
- [ ] `zustand-auditor` review clean (`useRoomStore` selectors, no per-frame state churn).
- [ ] Perf budget met and measured (numbers recorded in the PR).
- [ ] `/` MVP route unchanged; `/room` is `noindex`; no `/` bundle regression.
- [ ] `pnpm lint` + `pnpm build` pass (Next 16: build no longer runs lint — both must be run explicitly).
- [ ] Analytics events firing and visible in Vercel Analytics (`room_entered`, `room_inspect_reached`, `room_inquire_click`).
- [ ] Static no-WebGL fallback verified (e.g. WebGL disabled in browser flags).
- [ ] Asset attribution / artisan metadata wired for the displayed thangka.

---

## Risks & mitigations

| Risk                                                    | Mitigation                                                                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Scope creep into a multi-artifact museum**            | Hard guardrail above; one wall, one piece, isolated route; re-open scope decision before adding any second piece. |
| Mobile first-person nav feels bad / nauseating          | Spike first; offer tap-to-walk + reduced-motion fallback; cap turn speed.                                         |
| Perf on mid-tier mobile                                 | dpr cap 1.5, primitive room, compressed texture, measured budget, fail-fast on WebGL caveat.                      |
| Pointer-lock UX confusion / trapping users              | Explicit "Click to enter", `Esc` to exit, visible exit control, non-lock fallback.                                |
| Distracts from the actual inquiry hypothesis            | Ships off the MVP page (`/room`, noindex); evaluate separately; don't divert the `/` test.                        |
| Material/disposal leaks (repo's known 3D failure class) | Clone-modify-assign; explicit dispose on unmount; auditor gate; re-entry leak test.                               |

---

## Notes / open questions

- Which specific thangka asset (and its artisan metadata) is the v1 subject? Needs a high-res source in `public/artifacts/`.
- What outcome makes the room "win" against the `/` hero — higher inquiry click-through, longer engagement, or both? Define the comparison threshold before evaluating, or the analytics data won't settle anything.
- Decision needed (in spike): drei `PointerLockControls` vs hand-rolled controls.
- Future (NOT this story): sculpture-on-plinth variant reusing the room engine; baked lightmaps; ambient audio.
