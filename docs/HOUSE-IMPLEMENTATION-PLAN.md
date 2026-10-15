# Sunlit Bhaktapur house — implementation plan

Authorized September 8, 2026. Build on the current gallery and preserve the uncommitted Timer patch and timber lighting improvements.

## Experience

A sunlit house for Nepali art. Pasqua informs the inhabited architecture and restrained titles; Magical Reflections informs the guided camera route; UNESCO informs daylight and object study; Shopify informs the sequence of visual chapters. These are original adaptations, with no reference-site assets copied.

## Delivery sequence

1. **Architecture:** create a new editable v3 Blender scene. Open the right wall toward a planted courtyard, widen the roof light, reduce ceiling density, add a woven bench textile and simple vessel. Keep the focal timber wall and its readable lighting. Export architecture only, compressed GLB, and a new native preview. Preserve earlier scenes and sources.
2. **Guided journey:** replace the split hero with a large sticky gallery. Native scrolling moves between Arrival, The room and The work. Chapter buttons and previous/next controls provide equivalent navigation. The next step leads into the existing photograph study. Free walking remains available at /room.
3. **Camera and access:** share explicit camera stops; keep interpolation inside the room. Honor reduced motion with discrete views and instant navigation. Keep ordinary page scrolling, keyboard-operable controls, responsive framing, a static fallback, and the direct image-study link.
4. **Light and integration:** retain the timber washes, add courtyard daylight, and share the scene with /room. Original photograph colors and product facts remain unchanged. Keep the existing fonts and local assets.
5. **Verification:** inspect desktop and mobile, all chapter controls, scroll progression, reduced-motion behavior, and /room. Check GLB contents and size, TypeScript, targeted lint, existing tests and one production build. Record completed work and remaining limits.

## Acceptance

- The opening reveals both the painting and courtyard; timber detail stays visible.
- Three views progress continuously on scroll, with buttons and a direct path to Details.
- A failed WebGL load still shows the room and allows reaching the photograph.
- No pointer lock is required for the guided journey; reduced motion avoids camera travel.
- Blender source, authoring script, web export and preview agree; exported architecture contains no product photograph.
- No fabricated artisan story, product scan, checkout, publication or external messages.

## Status

Implemented locally on September 8, 2026.

- V3 Blender source, web export and native preview generated. Export validated: 435,136 bytes, nine mesh/material groups, Draco compression, no embedded images. Earlier versions preserved.
- Desktop and 390 × 844 portrait browser checks completed. All chapter controls, keyboard activation, ordinary Page Down progression and the Details link exercised. Mobile captions moved below the canvas after visual inspection revealed overlap.
- Sticky behavior verified with the stage at viewport top while the active chapter advances. Removed the old body overflow rule that prevented pinning.
- Static fallback exercised during a WebGL context loss while resizing/hot-reloading. Navigation and the photograph link remained usable; reload restored the live scene.
- Shared `/room` loaded and its direct painting view worked without pointer lock. Courtyard remains visual scenery outside the free-walk bounds.
- Ten regression tests passed, including sampled camera bounds, forward travel, invalid progress, reduced-motion stationary stops, Timer behavior and pointer-lock failure handling. Reduced motion was verified through tests and the media-query integration in code; an OS preference toggle was not exercised.
- Targeted ESLint, TypeScript, formatting checks, `git diff --check` and one production build passed. The Node 26 build process still emits the previously documented Tailwind `module.register()` warning; `.nvmrc` targets Node 24. No browser errors or THREE.Clock warnings appeared in the fresh validation tab.

## Practical limits

The architecture and display dimensions remain an original exhibition study. Product facts and source photographs are unchanged. Native Blender window input was unavailable during this pass, so v3 used the installed Blender background renderer; the editable source can be opened normally. Reference-site motion and assets were not copied. No deployment, live inquiry or Git push was performed.
