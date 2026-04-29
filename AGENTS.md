# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Vision

**The Artisan's Eye** is a 3D-first DTC brand for Nepali handcraft — starting with thangka paintings and sculptures. The long-term vision is an Aesop/Bellroy-tier curated brand where each artifact has rich 3D presentation, artisan story, and cultural context.

### MVP Hypothesis

The current build exists to test ONE hypothesis:

> Will Western buyers send a qualified purchase inquiry for a single, beautifully presented Nepali handcraft artifact from an unknown brand?

**In scope for MVP:**
- One artifact product page (thangka first; sculpture second).
- 3D/interactive presentation tailored to piece type (thangka = deep-zoom + iconography; sculpture = true 3D turntable).
- Strong artisan narrative: name, photo, region, technique, time-to-make, cultural meaning.
- Single "Inquire to purchase" CTA → email form + WhatsApp link.
- Basic analytics: page views, 3D viewer engagement time, inquiry click-through.

**Out of scope until the hypothesis validates:**
- Cart, checkout, Stripe, user accounts, dashboards.
- Multi-product catalog, filters, search.
- Auth flows, role-based access.
- NFT minting, wallet connect, on-chain provenance, Web3 of any kind. (The 3D eye is brand identity only — not a Web3 signifier.)

If you are considering adding any of the above, stop and flag it. Ninety-plus percent of scope creep on this repo will come from re-adding these.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

Requires Node `^20.10.0` or `^22.0.0`.

## Architecture

**Next.js 15 App Router.** Server renders the shell, client takes over for 3D.

### Routing
- `/` — Hero with the 3D eye (brand signature). Single-artifact presentation lives here.
- `/api/health` — Liveness probe.

Every other route has been intentionally removed. The MVP is one page.

### 3D (`components/3d/`)
All 3D is client-only (SSR disabled via `dynamic(..., { ssr: false })`).

- **HeroCanvas** — single `<Canvas>` rendering the eye with ACES Filmic tone mapping, soft shadows, key/fill/rim lighting, and a starfield backdrop.
- **EyeModel** — loads `public/artifacts/3d/eye.glb`, clones geometries + materials (never mutates shared Three.js objects), overrides `tintColor`/`irisColor`/`metalness`/`roughness`/`envMapIntensity`. Iris micro-movements blend pointer/touch/deviceorientation with exponential smoothing. Scheduled for reduction — the current ~340-line interaction layer is overbuilt for the planned intro-animation + logo-persistence role.
- **CameraRig** — damps camera toward `cameraTargetPosition` via `maath/easing`.
- **Starfield** — R3F points-based starfield drawn inside the hero canvas.

### State (Zustand)
`components/state/useSceneStore.ts` holds camera target and eye scale. The previous phase state machine (`idle → zooming → revealing → focused`), `mintPhase`, `eyes[]` carousel, and `flowStep` have all been removed. Re-add only if the UX genuinely requires them.

### Key Patterns
- **Hydration safety**: gate 3D and browser-only APIs behind a `mounted` state; `suppressHydrationWarning` on the hero `<section>`.
- **Material customization**: clone material → modify properties → assign back. Never mutate shared materials from `scene.traverse`.

## Build Notes

- `output: 'standalone'` in `next.config.ts` — Docker-friendly.
- Images are unoptimized (`unoptimized: true`); all assets live in `/public`.
- Production build strips `console.*` and omits source maps.
- Webpack config silences Three.js video texture warnings (expected, not a bug).

## Next Work

Scope-cut landed (this PR). Next, in order:

1. **PR 2** — Replace `app/page.tsx` with the single-page product layout (hero · artifact · artisan · context · materials · CTA). Add `/api/inquire` (reuse `lib/api.ts` + `lib/validate.ts`). Wire analytics events.
2. **PR 3** — `EyeModel` cut-down: ~4s intro animation, skippable, once per session. End state = ~32px logo mark in top-left header. Remove drag/inertia/deviceorientation/touch blending.
3. **PR 4** — Thangka deep-zoom viewer (tiled image pyramid / OpenSeadragon) with iconography annotations.
4. **PR 5** — Sculpture template: GLB turntable (photogrammetry of the actual piece, Draco + KTX2 compressed).

## What NOT to do

- Do not re-add auth, dashboards, or Web3 components under the banner of "someday."
- Do not treat thangkas and sculptures with the same 3D presentation — they need different viewers.
- Do not add a multi-artifact catalog. The hypothesis is per-artifact; shipping a catalog pre-hypothesis is a distraction.
