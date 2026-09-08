"""Export only the active gallery architecture, then refresh its preview."""
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[2]
assert bpy.context.scene.name.startswith('Artisans Eye | Valley Reference Study'), (
    'Select the reference study scene before exporting'
)
if bpy.context.object and bpy.context.object.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')

bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.context.scene.objects:
    obj.select_set(obj.type == 'MESH' and obj.name.startswith('Gallery | '))

bpy.ops.export_scene.gltf(
    filepath=str(ROOT / 'public/artifacts/3d/bhaktapur-gallery.glb'),
    export_format='GLB',
    use_selection=True,
    use_active_scene=True,
    export_apply=True,
    export_yup=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
)
scene = bpy.context.scene
scene.render.filepath = str(ROOT / 'public/artifacts/gallery-preview.png')
bpy.ops.render.render('INVOKE_DEFAULT', write_still=True)
