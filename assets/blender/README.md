# Gallery asset experiment

Initial versions were created in the installed Blender application through computer use and its Python Console. The v3 courtyard and v4 carved geometry were generated and rendered with the same local Blender script in background mode after native window controls failed. An original contemporary gallery study, not a reconstruction of a heritage building. References: `../../docs/ARCHITECTURE-REFERENCES.md`.

## Files
- `bhaktapur-gallery-v4.blend`: current editable source, with preview photograph, camera, lights and packed image.
- `bhaktapur-gallery-v3.blend`, `bhaktapur-gallery-v2.blend` and `bhaktapur-gallery.blend`: retained earlier versions.
- `build-gallery.py`: reproducible geometry and materials; creates a new scene and preserves other open scenes. Existing working files are backed up into `archive/` before replacement.
- `export-gallery.py`: exports the active gallery scene and refreshes its preview after hand edits.
- `../../public/artifacts/3d/bhaktapur-gallery.glb`: architecture only, 15 meshes / nine materials, 871,068 bytes with Draco compression. Decoders are served locally from `public/draco/`.
- `../../public/artifacts/gallery-preview.png`: native Blender render used while the interactive room loads or when WebGL fails.
- `archive/`: local previous script, GLB, render and working-scene backups; excluded from Git along with Blender autosave files.

## Build through Blender
1. Place the pointer over the main editor; Shift-F4 opens Python Console.
2. Open the saved gallery `.blend` in this folder, then execute `import runpy; runpy.run_path(bpy.path.abspath('//build-gallery.py'), run_name='__main__')`. The script derives the repository root from its own location.
3. The script saves the v4 source and web export. Rerunning replaces generated outputs.
4. Execute `bpy.ops.render.render('INVOKE_DEFAULT', write_still=True)` to refresh the preview.
5. Shift-F5 returns to the viewport; Numpad 0 shows the camera.

## Hand edits
Duplicate the gallery scene before editing, keeping its name prefix `Artisans Eye | Sunlit House`. Edit the structural material-group meshes and the six separate asset-marked meshes in `Carved architectural components | v4`. Keep their `Gallery | ` name prefix for export. Save the Blender file, then run `import runpy; runpy.run_path(bpy.path.abspath('//export-gallery.py'), run_name='__main__')` in the console.

Export must restrict **both selection and active scene**. Selection alone can export selected objects from other preserved scenes, including the preview photograph. The helper enforces this restriction and Draco compression.

Coordinates are authored in website X/Y-up/Z, converted to Blender Z-up, then exported back to +Y up. The original product photograph remains separate from runtime architecture. Staged dimensions are illustrative.

## Local background alternative

From the repository root, run:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python assets/blender/build-gallery.py --python-expr "import bpy; bpy.ops.render.render(write_still=True)"
```

This creates the v4 source and export and writes the preview to its exact configured filename. The running interactive Blender session is unaffected. The courtyard is scenery; `/room` movement remains bounded to the main gallery.

## V4 carved geometry

`carved-components.py` builds the approved reference's peacock screens, five-bay gallery windows, carved focal lintel and diagonal relief struts as real mesh geometry. Lattice openings, feather loops, leaves and rosettes have depth; the reference image is not pasted onto surfaces. Fine sculptural detail is an original procedural interpretation of the concept, not an exact historical reproduction.

The two peacock screens flank the painting. Five-bay windows are installed above the left bench and on the courtyard north wall. A narrower brick course replaces the previous dado. Source meshes remain separate and are marked as Blender assets; only the remaining structure is grouped by material for web efficiency.

To inspect the carve work, choose `Carving detail camera` as the scene camera or select `Gallery | Peacock window left` in the named collection and use Frame Selected. The default camera still shows the whole gallery. `inspect-carvings.py` validates all six components and renders the detail camera from the saved file without resaving it. Its actual-geometry render is `references/carved-window-geometry-v4.png`.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background assets/blender/bhaktapur-gallery-v4.blend --python assets/blender/inspect-carvings.py
```
