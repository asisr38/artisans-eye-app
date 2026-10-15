"""Validate the v4 mesh components and render the saved detail camera.

Run against bhaktapur-gallery-v4.blend in background mode. Does not resave or
change the default gallery camera in the source file.
"""
from pathlib import Path
import json
import bpy

root = Path(__file__).resolve().parents[2]
scene = bpy.context.scene
collection = bpy.data.collections['Carved architectural components | v4']
assert len(collection.objects) == 6
report = []
for obj in collection.objects:
    assert obj.type == 'MESH' and obj.asset_data
    assert obj.data.polygons and all(d > 0 for d in obj.dimensions)
    assert not obj.data.validate(verbose=True), f'Invalid mesh repaired: {obj.name}'
    report.append({'name': obj.name, 'vertices': len(obj.data.vertices),
                   'faces': len(obj.data.polygons), 'dimensions': list(obj.dimensions)})
print('CARVED_COMPONENT_VALIDATION', json.dumps(report))
scene.camera = scene.objects['Carving detail camera']
scene.camera.data.ortho_scale = 2.8
scene.render.resolution_x = 1100
scene.render.resolution_y = 1400
scene.render.filepath = str(root / 'assets/blender/references/carved-window-geometry-v4.png')
bpy.ops.render.render(write_still=True)
