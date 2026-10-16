# The Artisan’s Eye

A contemporary gallery for Nepali handcraft, starting with a single Avalokiteshvara thangka and a personal purchase inquiry.

## Run

Use Node 24 LTS (`.nvmrc`) and the existing pnpm lockfile. Node 26 currently triggers a Tailwind loader deprecation warning.

```sh
pnpm run dev
pnpm run build
pnpm run lint
pnpm test
pnpm run format:check
```

Use `pnpm run format` to apply the shared formatting rules.

The homepage includes a Blender-authored interactive gallery, camera presets, image zoom/pan, cultural context, an honest object record, and an inquiry form. `/room` retains the walk-through experience with the same architecture. Next.js 16 / React 19 / TypeScript / R3F. Fonts are local, with licenses in `app/fonts`, so builds do not fetch Google Fonts.

## Continue

Read `docs/HANDOFF.md` for status, `PRODUCT.md` and `DESIGN.md` for direction, and `assets/blender/README.md` for the computer-use asset workflow. Original photography and the prior 3D eye components are preserved.

## Deploy

Vercel detects pnpm from the lockfile but may pick pnpm 9, which ignores the `patchedDependencies` entry in `pnpm-workspace.yaml`. `vercel.json` therefore pins the install to the same pnpm as `packageManager` so the Fiber Timer patch is applied; keep the two versions in sync. Set `RESEND_API_KEY` in the Vercel project.

Docker: `docker compose up --build` builds a standalone Node 24 image and serves on port 3000. Put runtime secrets such as `RESEND_API_KEY` in a local `.env` next to `docker-compose.yml`; the file is optional and never copied into the image. `GET /api/health` (also reachable as `/health`) is the health probe used by the image's `HEALTHCHECK`.

## Inquiry delivery

Production requires `RESEND_API_KEY`; without it the endpoint returns 503. Configure a verified sender in `lib/email.ts` before launch. Development without the key does not send an email and the form explicitly reports that fact. Do not confuse a local form test with delivery verification.

Artist identity, making history, measurements, condition, and pricing still require verification. The gallery is original exhibition scenery and its scale is illustrative. Nothing has been published by this revamp.
