# Gallery revamp handoff

Updated September 8, 2026. Branch: `codex/artisans-eye-gallery-revamp`.

## Current: v4 reference-driven carved geometry — September 8, 2026

- Current editable source: `assets/blender/bhaktapur-gallery-v4.blend`; earlier files remain intact. The approved component image is now represented by real mesh relief and lattice, authored by `carved-components.py` and installed by `build-gallery.py`.
- Two peacock screens flank the art, two five-bay windows occupy the left wall and courtyard, the focal lintel has raised rosettes, supporting struts have leaf relief, and the dado has finer brick courses.
- Six components stay separately editable in a named collection and are asset-marked. Export contains 15 meshes, nine materials, 871,068 bytes, Draco, no photograph textures. Shared loader cache key is v4; homepage and `/room` use the same model.
- All six asset meshes passed Blender validation. Native whole-room/detail renders confirm geometry; homepage and `/room` loaded the new asset without browser errors or warnings. The production build and source syntax checks passed. Components are procedural interpretations of the concept; fine chisel marks and wood grain from the reference image are not yet sculpted or baked.

## Previous: sunlit house and guided journey — September 8, 2026

- Implementation plan: `docs/HOUSE-IMPLEMENTATION-PLAN.md`. The homepage now has three scroll-linked views, chapter/previous/next controls and a direct photograph-study link. `/room` retains free navigation inside its original movement bounds.
- Current source: `assets/blender/bhaktapur-gallery-v3.blend`. Opens the right wall onto a planted courtyard, loosens the roof joists and adds a bench textile and vessel. Generated with local background Blender after native window controls failed; the open interactive session was not used to generate v3.
- Export: 435,136 bytes, nine mesh/material groups, Draco compressed, zero embedded images. Original product photo remains separate. Native preview refreshed; shared side daylight and existing wood washes keep the joinery visible.
- Mobile caption sits below the scene to preserve artwork visibility. Body overflow no longer creates a false sticky-scroll ancestor. Demand rendering, static fallback and discrete reduced-motion camera stops remain.
- Verified desktop/mobile framing, chapter buttons, keyboard/scroll progression, Details, fallback and `/room` direct view. Ten tests, targeted lint/format, TypeScript and production build passed. Reduced-motion camera behavior has regression coverage; OS preference switching was not exercised.
- Preserve prior uncommitted Timer patch and wood lighting. Earlier dated sections below describe previous versions, not the current homepage controls.

## Delivered

- New contemporary Bhaktapur gallery homepage: original Blender architecture, room/work camera presets, optional drag exploration, static render fallback, photograph zoom/pan with keyboard controls and detail selections, approach/object record, and inquiry.
- Blender computer-use experiment completed using its Python Console, GLB export, and native render. Source and repeatable procedure in `assets/blender/`.
- Shared architecture also used by the existing `/room` walk-through. Prevented its pointer-lock component from trying to lock on every page click, including the accessible direct-view button.
- Artwork texture cloned instead of mutating the shared loader cache; its colors are independent of architectural lighting.
- Fonts bundled locally with OFL licenses. No font network calls during build.
- Inquiry preview no longer falsely claims email was delivered. Successful real submissions emit an analytics event.
- AGENTS.md shortened and CLAUDE.md points to it. Preserve this small context footprint; no parallel agents or full re-audits for routine edits.

## Verification

- Production build passed after fonts were bundled locally and local build workers were allowed outside the restrictive sandbox.
- Targeted lint passed for the new gallery, homepage/layout, inquiry form, room shell and artwork wall.
- TypeScript checked; browser inspected at desktop and mobile breakpoints.
- Verified camera selection, close view, detail expansion, zoom and reset, and the `/room` direct-view path to its inquiry CTA.
- Legacy code has pre-existing lint warnings. The embedded browser does not reliably support pointer lock; direct view and keyboard/touch paths should remain available. No real email was sent.

## Continue without repeating the audit

Read PRODUCT.md, DESIGN.md and only the files needed for the next change. The main site is `app/page.tsx` and `components/gallery/`. Old eye components are retained but not mounted on the new homepage. Historical plans in `docs/jira/` are historical context.

The running preview observed at verification was `http://localhost:3000`; inspect the current server before starting another. A production build may need elevated local worker permissions in the Codex sandbox; that is not an app deployment requirement.

## Real-world information still needed

Artist identity and making story, verified materials/condition/dimensions, price and availability, production email sender configuration. The current zoom uses the existing photograph, not a new high-resolution scan. Sculpture presentation still requires an actual sculpture model. Gallery architecture and display scale are illustrative.

## Preservation

Pre-existing tracked and untracked work was backed up locally outside the repository before editing. It included eye changes and the AE-101 room. The original photographs and legacy components remain. No push, publication, or live inquiry was performed.

## Kathmandu Valley reference enhancement — September 7, 2026

- Updated the shared room with layered timber surrounds, diagonal lattice and fan heads, bracketed columns, brick dado, terracotta paving, dense ceiling joists and a framed skylight. Sources and adaptations: ARCHITECTURE-REFERENCES.md.
- Current editable source is assets/blender/bhaktapur-gallery-v2.blend. Earlier sources and working-state backups remain in assets/blender/archive/ and the original .blend is retained.
- Runtime export: 411,160 bytes, seven mesh/material groups, Draco compressed, no embedded photographs. Local decoders avoid a runtime CDN dependency. Always restrict Blender export to active scene as well as selection; preserved scenes may contain selected objects.
- Shared lighting adjusted for the new enclosed roof; homepage camera reframed. Native Blender preview refreshed.
- Verified homepage model loading and camera presets, /room loading and direct painting view, with no browser errors. Targeted ESLint, TypeScript and production build passed. Existing Three.Clock deprecation warnings remain.

## Development log fixes — September 7, 2026

- Replaced the room's Drei pointer-lock wrapper with native lock/change/mouse listeners. Lock requests use a synchronous store subscription to retain the click gesture, catching promise rejection as well as synchronous exceptions. Failure opens drag/keyboard navigation and removes the retry prompt for that visit. Pointer-lock error events cover legacy browsers too.
- The main painting study loads eagerly because it can become the LCP image on direct #study visits.
- .nvmrc now targets Node 24 LTS. Traced DEP0205 under Node 26 to @tailwindcss/node's module.register call; changing .nvmrc does not switch an already-running shell or server.
- THREE.Clock originally came from installed @react-three/fiber 9.6.1; the Timer patch below now resolves it.
- Three pointer-lock regression checks and production build passed. Targeted lint has no errors; pre-existing R3F camera mutation warnings remain. Test command: node --experimental-strip-types --test scripts/request-pointer-lock.test.mjs.

## Repository cleanup

- Shared Prettier rules and pnpm format/test commands; ES module type is explicit, with standalone CommonJS tooling retaining .cjs. Node 24+ is the supported runtime and pnpm is pinned.
- Blender scripts derive the repository path from their script location and run through runpy. Native sources remain tracked; local archive/autosave files and browser captures stay on disk outside the commit.
- Bundled Draco decoders include their upstream Apache license and are excluded from application linting. Removed the unused gallery-canvas interaction prop; interaction remains controlled by the gallery wrapper.

## Timer deprecation fix

- Versioned pnpm patch migrates Fiber 9.6.1 clock construction to a THREE.Timer-backed compatibility adapter across ESM and CommonJS builds. See patches/README.md for maintenance and upstream context.
- Regression coverage checks warning-free store creation, delta/elapsed seconds, stop/restart, manual advance and demand-loop restart.
