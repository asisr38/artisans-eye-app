# Gallery asset experiment

Created in the installed Blender application through computer use and its Python Console. An original contemporary gallery study, not a reconstruction of a heritage building. References: `../../docs/ARCHITECTURE-REFERENCES.md`.

## Files
- `bhaktapur-gallery-v2.blend`: current editable source, with preview photograph, camera, lights and packed image.
- `bhaktapur-gallery.blend`: retained first version.
- `build-gallery.py`: reproducible geometry and materials; creates a new scene and preserves other open scenes. Existing working files are backed up into `archive/` before replacement.
- `export-gallery.py`: exports the active reference-study scene and refreshes its preview after hand edits.
- `../../public/artifacts/3d/bhaktapur-gallery.glb`: architecture only, seven material groups, about 411 KB with Draco compression. Decoders are served locally from `public/draco/`.
- `../../public/artifacts/gallery-preview.png`: native Blender render used while the interactive room loads or when WebGL fails.
- `archive/`: local previous script, GLB, render and working-scene backups; excluded from Git along with Blender autosave files.

## Build through Blender
1. Place the pointer over the main editor; Shift-F4 opens Python Console.
2. Open the saved gallery `.blend` in this folder, then execute `import runpy; runpy.run_path(bpy.path.abspath('//build-gallery.py'), run_name='__main__')`. The script derives the repository root from its own location.
3. The script saves the v2 source and web export. Rerunning replaces generated outputs.
4. Execute `bpy.ops.render.render('INVOKE_DEFAULT', write_still=True)` to refresh the preview.
5. Shift-F5 returns to the viewport; Numpad 0 shows the camera.

## Hand edits
Duplicate the reference-study scene before editing, keeping its name prefix `Artisans Eye | Valley Reference Study`. Edit the seven `Gallery | ` material-group meshes. Save the Blender file, then run `import runpy; runpy.run_path(bpy.path.abspath('//export-gallery.py'), run_name='__main__')` in the console.

Export must restrict **both selection and active scene**. Selection alone can export selected objects from other preserved scenes, including the preview photograph. The helper enforces this restriction and Draco compression.

Coordinates are authored in website X/Y-up/Z, converted to Blender Z-up, then exported back to +Y up. The original product photograph remains separate from runtime architecture. Staged dimensions are illustrative.
