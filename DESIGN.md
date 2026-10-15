# Artisan's Eye visual system

## Direction

Contemporary Bhaktapur gallery, chosen September 7, 2026. A visitor studies a thangka in a sunlit, quiet room: pale mineral plaster, warm stone, dark timber and a clay focal wall. The interface reads like discreet gallery signage beside the physical work.

## Color

Restrained mineral surfaces with an oxide-clay accent. Page paper: oklch(95% 0.014 80). Ink: oklch(26% 0.025 55). Secondary: oklch(46% 0.025 60). Clay: oklch(45% 0.09 38). Borders: oklch(82% 0.025 75). Dark inquiry section uses warm ink with paper text.

## Typography

Jost for human-scale gallery wayfinding and body text; Bodoni Moda for brief display titles. Body copy 17px, generous leading, max 65ch. No repeated mono labels or card grids.

## Composition

A full-height gallery opens immediately with a small paper caption and chapter navigation. Native scrolling guides Arrival → The room → The work, followed by the original photograph study, context, record and inquiry. The right-hand opening reveals a planted courtyard, with linen and terracotta furnishings. Mobile retains the chapter bar and uses wider camera framing. Implementation and reference decisions: docs/HOUSE-IMPLEMENTATION-PLAN.md.

## Motion and interaction

Demand-rendered 3D with native scroll-driven camera movement and explicit chapter buttons. Reduced motion selects discrete stationary views. Free exploration remains at /room. Image study uses zoom controls and bounded drag/pan, reset, keyboard, and touch pinch. Preserve ordinary page scrolling; do not intercept wheel or touch events in the guided gallery.

## Asset pipeline

Editable source: assets/blender/bhaktapur-gallery-v4.blend. Reproducible authoring script: assets/blender/build-gallery.py. Runtime: public/artifacts/3d/bhaktapur-gallery.glb. Product photography stays separate from scenery. Dimensions of the staged painting are illustrative until real measurements are verified.

## Valley architecture references

The current room combines layered timber surrounds and geometric screens inspired by Bhaktapur woodcraft, courtyard-gallery rhythm from Patan, and the lime plaster, terracotta and close timber joists of Kathmandu’s restored Pashupati Museum. These are original adaptations, not a historical reconstruction. Sources and decisions: docs/ARCHITECTURE-REFERENCES.md.

## Carved component implementation

The approved `assets/blender/references/museum-components-v2.png` now informs real mesh geometry: pierced peacock screens, five-bay window bands, raised floral relief and carved supporting struts. Components are individually editable in the v4 source, alongside finer terracotta brick courses. `assets/blender/carved-components.py` is the reusable procedural source.
