# Artisan’s Eye

## Purpose and scope

A curated Nepali handcraft brand. The current experiment is one thangka, its cultural context, an interactive gallery, and a qualified purchase inquiry. The user selected a contemporary Bhaktapur gallery revamp on September 7, 2026.

Do not invent artist identity, provenance, measurements, availability, or material claims. Thangkas use photography and zoom; sculptures need actual scanned/modelled assets. The gallery architecture is original scenery, not a historical reconstruction.

Cart, checkout, accounts, catalogs, dashboards, and Web3 remain outside the current experiment unless the user explicitly changes scope.

## Start small

Read PRODUCT.md and DESIGN.md for design work. Read docs/HANDOFF.md to resume implementation. Inspect only relevant source files and current Git changes. Avoid repeating the whole-project audit, parallel agents, unnecessary image generation, and repeated full test runs; the user wants efficient usage.

## Architecture

Next.js 16, React 19, TypeScript, Tailwind 4, R3F/drei/Three.js, Zustand, Resend. Dependencies and local fonts are already installed.

- app/page.tsx: current gallery website.
- components/gallery/: Blender model, demand-rendered gallery and camera presets, image study.
- components/3d/room/: existing walk-through at /room, now sharing the Blender architecture.
- components/ui/InquiryForm.tsx and app/api/inquire/route.ts: inquiry flow.
- Legacy eye components are retained, but are not mounted on the redesigned homepage.

## Asset workflow

assets/blender/build-gallery.py creates a new scene through Blender’s Python Console, saves the editable .blend and exports public/artifacts/3d/bhaktapur-gallery.glb. Read assets/blender/README.md before rebuilding. Preserve original photographs. Never mutate shared loader materials or dispose shared geometries; clone only what must change.

## Verification

npm run dev, npm run build, npm run lint. Use the already-running server if present. Run targeted checks while editing, one production build at the end, and browser checks for desktop/mobile and changed interactions. Existing legacy lint warnings are recorded in the handoff.

Preserve the user’s pre-existing uncommitted work. No deployment or external messages are authorized by draft preparation. Do not send a live test inquiry without explicit authorization.
