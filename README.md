# The Artisan’s Eye

Next.js + React Three Fiber immersive minting experience.

## Getting Started
- `npm run dev`
- Visit `http://localhost:3000` and `http://localhost:3000/brief`

## Deploy (Vercel)
- Build: `next build`
- Start: `next start` (production)
- Node 18+

## Notes
- Client-only 3D is mounted from `components/hero/HeroRoot.tsx`.
- All assets are local under `public/` (GLB, INSV, images).
- No remote image domains configured.

---

## Brief page with 3D eye preview

Open `/brief`. The form updates the 3D eye look direction and visual theme live. You can capture a PNG snapshot.

### Customize visuals (FormEyeCanvas)

`components/3d/FormEyeCanvas.tsx` accepts a `visual` object:

- `tintColor`: hex/rgb string applied gently to materials
- `irisColor`: eye iris color
- `metalness`: 0..1 (more metallic)
- `roughness`: 0..1 (lower = shinier)
- `envIntensity`: 0..5 reflection influence
- `background`: canvas background color
- `lightColor`: ambient/directional light color
- `backgroundImageUrl`: optional URL for a background plate

These can be set via the brief form or passed as props.

### Capture PNG

Click “Capture PNG” under the preview to download the current render.

## Submitting to Excel (Microsoft Graph)

The brief form posts submissions to Microsoft Excel if environment variables are configured. Create a table in your workbook with columns matching the order used here (or add to any table and adjust order in code if needed).

Required env vars:

```
MS_TENANT_ID=...
MS_CLIENT_ID=...
MS_CLIENT_SECRET=...
MS_DRIVE_ID=...            # Drive ID of the OneDrive/SharePoint drive
MS_EXCEL_ITEM_ID=...       # Item ID of the Excel file
MS_EXCEL_TABLE_NAME=Table1 # Name of the table in the workbook
```

Flow:
- `POST /api/brief/submit` → exchanges client credentials for Graph token → adds a row to the table.
- Timestamp is auto-populated with ISO string on submit.

## Update lighting colors

- In the brief preview, lighting color is driven by `visual.lightColor`.
- In the hero scene (`components/3d/HeroCanvas.tsx`), update the light color values to change the global lighting.

Example:

```tsx
<ambientLight intensity={0.6} color={'#ffd7a6'} />
<directionalLight intensity={0.9} position={[2,3,4]} color={'#ffd7a6'} />
```

## Change eye colors/material feel

In `components/3d/EyeModel.tsx`, these props are supported:

```tsx
<EyeModel tintColor="#e8ecff" irisColor="#2563eb" metalness={0.2} roughness={0.35} envIntensity={1} />
```

Materials are cloned and modified safely at runtime.

## Background image behind the eye

On `/brief`, set “Background image URL”. The preview renders the image on a plane behind the eye.

## Add 2D texts to home page

`components/ui/HeroOverlay.tsx` contains a headline and subtext centered near the top of the hero. Edit the text or Tailwind classes there to customize.

