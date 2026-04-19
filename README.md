# The Artisan's Eye

A 3D-first DTC brand for Nepali handcraft — thangka paintings and sculptures, each presented with the artisan story and cultural context a piece deserves.

The current build is the MVP: a single-artifact page testing whether Western buyers will send qualified inquiries for a single, beautifully presented piece from an unknown brand.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Deploy (Vercel)

- Build: `next build`
- Start: `next start`
- Requires Node `^20.10.0` or `^22.0.0`.

### Environment variables

```
RESEND_API_KEY=...   # required in production; inquiry form posts will 503 without it
```

In development, omitting `RESEND_API_KEY` is fine — the `/api/inquire` route logs
the submission and returns a fake success so the UI flow can be exercised. In
production, missing the key returns `503 email_not_configured` so the problem
surfaces immediately.

The sender address is `onboarding@resend.dev` (Resend&rsquo;s default for
unverified accounts). Once a domain is verified in Resend, swap the `FROM_ADDRESS`
constant in `lib/email.ts` to `inquiries@<yourdomain>`.

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19 + TypeScript
- React Three Fiber + drei + three.js
- Zustand (scene state)
- Tailwind v4

## Structure

- `app/` — App Router pages. Currently only `/` and `/api/health`.
- `components/3d/` — HeroCanvas, EyeModel, CameraRig, Starfield. Client-only.
- `components/hero/` — Hero composition.
- `components/state/useSceneStore.ts` — Zustand scene state.
- `lib/api.ts`, `lib/validate.ts` — API handler primitives (validation, rate limiting, structured errors).
- `public/artifacts/3d/eye.glb` — the brand eye.

## Notes

- All assets are local under `public/`.
- The 3D eye is the brand signature — it is not a Web3/NFT element and no on-chain functionality exists in this codebase.
- See `CLAUDE.md` for scope boundaries and the upcoming PR sequence.
