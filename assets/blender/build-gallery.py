"""Artisan's Eye gallery study. Run from Blender's Python Console.
Creates a new scene, preserves any other open scene, saves .blend and exports GLB.
Coordinates are authored as web X/Y(up)/Z then converted to Blender Z-up.
Architecture is original contemporary scenery, not a documented heritage building.
"""
import bpy, math, time, runpy
from pathlib import Path
from mathutils import Vector
ROOT = str(Path(__file__).resolve().parents[2])
Path(ROOT, 'assets/blender/archive').mkdir(parents=True, exist_ok=True)
if bpy.context.object and bpy.context.object.mode != 'OBJECT': bpy.ops.object.mode_set(mode='OBJECT')
# Preserve the working scene, including any edits made after the previous save.
if bpy.data.filepath.startswith(ROOT+'/assets/blender/'):
 bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/blender/archive/working-before-'+str(int(time.time()))+'.blend', copy=True)
scene = bpy.data.scenes.new('Artisans Eye | Sunlit House v4 — Carved Timber')
bpy.context.window.scene = scene

def pos(v): return (v[0], -v[2], v[1])
def linear(c): return c/12.92 if c <= .04045 else ((c+.055)/1.055)**2.4
def material(name, rgb, roughness=.7, metallic=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*[linear(c) for c in rgb],1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=m.diffuse_color
 p.inputs['Roughness'].default_value=roughness; p.inputs['Metallic'].default_value=metallic
 return m
plaster=material('Warm lime plaster',(.69,.64,.55),.93)
clay=material('Oxide clay reveal',(.42,.24,.17),.9)
timber=material('Carved warm timber',(.27,.18,.115),.67)
stone=material('Honed warm stone',(.49,.46,.40),.86)
brick=material('Fired terracotta',(.48,.26,.17),.90)
bricklight=material('Fired terracotta variation',(.53,.30,.20),.90)
brass=material('Aged brass',(.55,.40,.22),.38,.65)
meshes=[]
def box(name, location, scale, mat, bevel=.015):
 bpy.ops.mesh.primitive_cube_add(size=1, location=pos(location)); o=bpy.context.object; o.name=name
 o.dimensions=(scale[0],scale[2],scale[1]); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
 o.data.materials.append(mat)
 if bevel:
  b=o.modifiers.new('Soft crafted edges','BEVEL'); b.width=bevel; b.segments=2
  bpy.ops.object.modifier_apply(modifier=b.name)
 meshes.append(o); return o
# Thick masonry, mineral plaster and a stone sill make real shadow reveals.
box('Stone floor',(0,-.10,0),(6.4,.20,8.4),stone)
box('North masonry wall',(0,1.75,-4.13),(6.4,3.5,.26),plaster)
box('Left masonry wall',(-3.13,1.75,0),(.26,3.5,8.2),plaster)
# Right-hand opening looks into an original planted courtyard.
box('Right north pier',(3.13,1.75,-3.0),(.26,3.5,2.2),plaster)
box('Right south pier',(3.13,1.75,3.27),(.26,3.5,1.66),plaster)
box('Courtyard opening lintel',(3.13,3.32,.27),(.30,.36,4.36),plaster)
box('Courtyard threshold',(3.15,.045,.27),(.62,.09,4.35),stone)
for z in [-1.9,2.44]:
 box('Courtyard timber jamb',(3.0,1.61,z),(.19,3.22,.17),timber)
box('Courtyard timber header',(3.0,3.13,.27),(.21,.18,4.5),timber)

# Clay wall as an inset, framed by layered timber joinery.
box('Clay focal recess',(0,1.73,-3.97),(2.16,3.40,.08),clay)
for x in [-1.17,1.17]:
 box('Outer jamb',(x,1.68,-3.79),(.18,3.36,.26),timber)
 box('Inner jamb bead',(x*.90,1.70,-3.67),(.035,3.14,.035),brass,.004)
 for y in [.18,.31,2.73,2.87]:box('Jamb collar',(x,y,-3.72),(.23,.07,.30),timber,.008)
for y,w,h,z in [(3.00,2.53,.16,-3.73),(3.15,2.70,.12,-3.78),(3.27,2.84,.08,-3.83)]:
 box('Layered head moulding',(0,y,z),(w,h,.34),timber,.01)
box('Stone threshold',(0,.045,-3.74),(2.75,.09,.5),stone,.01)
# Reference-driven mesh components, retained separately for editing and reuse.
for x in [-2.17,2.17]:
 box('Deep window backing',(x,1.72,-3.975),(1.43,2.23,.025),timber,0)
carved = runpy.run_path(ROOT+'/assets/blender/carved-components.py')['install'](timber)
components=bpy.data.collections.new('Carved architectural components | v4')
scene.collection.children.link(components)
for obj in carved:
 for collection in list(obj.users_collection):collection.objects.unlink(obj)
 components.objects.link(obj)
# Brick dado with staggered courses; individual bricks catch side lighting.
for side in [-1,1]:
 for row in range(12):
  y=.045+row*.068
  for col in range(29):
   z=-3.89+col*.275+(row%2)*.1375
   if z>3.93 or (side==1 and -1.9<z<2.44):continue
   box('Fine-course brick',(side*2.991,y,z),(.035,.058,.263),bricklight if (row*11+col*7)%5==0 else brick,0)
 if side==-1:box('Timber dado cap',(side*2.97,.87,0),(.10,.065,8),timber,.008)
# Fine terracotta side strips, central limestone path. No dark graph-paper joints.
for xi in range(16):
 x=-2.81+xi*.375
 for zi in range(21):
  z=-3.79+zi*.375
  if abs(x)<1.10:continue
  box('Terracotta floor tile',(x,.012,z),(.363,.024,.363),bricklight if (xi*3+zi)%6==0 else brick,0)
for xi in range(3):
 for zi in range(11):box('Central stone paver',(-.72+xi*.72,.008,-3.6+zi*.72),(.707,.018,.707),stone,0)
for x in [-1.15,1.15]:box('Stone path edging',(x,.015,0),(.05,.035,8),stone,.006)
# Paired side pilasters with shaped bases, collars, and bracketed capitals.
for x in [-2.82,2.82]:
 for z in [-2.40,.35,2.80]:
  box('Pillar stone foot',(x,.12,z),(.38,.24,.38),stone,.015)
  box('Timber pillar shaft',(x,1.60,z),(.17,2.78,.17),timber,.025)
  for y,w,h in [(.30,.29,.12),(.44,.22,.06),(2.74,.24,.07),(2.87,.32,.13),(3.03,.48,.12)]:box('Pillar capital moulding',(x,y,z),(w,h,w),timber,.008)
  direction=-1 if x>0 else 1
  o=box('Angled supporting bracket',(x+direction*.22,3.05,z),(.61,.10,.15),timber,.015);o.rotation_euler[1]=-direction*math.pi/4
# Close ceiling joists with a central skylight: enclosure, rhythm and a light source.
for zi in range(17):
 z=-3.85+zi*.48
 if -.95<z<1.95:
  for x in [-2.1,2.1]:box('Short skylight joist',(x,3.43,z),(1.8,.16,.10),timber,.008)
 else:box('Close-spaced ceiling joist',(0,3.43,z),(6.12,.16,.10),timber,.008)
for x in [-2.1,2.1]:box('Ceiling side infill',(x,3.56,0),(1.8,.08,8.2),timber,.008)
for z,depth in [(-2.6,2.5),(3.05,1.9)]:box('Ceiling end infill',(0,3.56,z),(2.4,.08,depth),timber,.008)
for x in [-1.23,1.23]:box('Skylight curb',(x,3.61,.55),(.14,.26,3.10),timber)
for z in [-1.0,2.10]:box('Skylight curb',(0,3.61,z),(2.6,.26,.14),timber)
# Contemporary discreet track lighting under the historic-inspired structure.
for x in [-.80,.80]:
 box('Museum light track',(x,3.27,-2.4),(.028,.025,2.3),brass,.004)
 for z in [-3.1,-2.1]:box('Small gallery luminaire',(x,3.19,z),(.09,.12,.13),timber,.01)
box('Contemplation bench',(-2.50,.46,.05),(.65,.10,1.75),timber,.025)
for z in [-.53,.63]:box('Bench support',(-2.50,.23,z),(.49,.40,.12),timber)
# Courtyard scenery: shallow planting beds, stone paving and an enclosing wall.
foliage=material('Courtyard olive foliage',(.30,.38,.18),.95)
linen=material('Undyed woven linen',(.71,.63,.48),.96)
box('Courtyard paving',(5.30,-.05,.25),(4.3,.1,6.3),stone)
box('Garden far wall',(7.42,1.5,.25),(.23,3.0,6.3),plaster)
box('Garden north wall',(5.35,1.5,-2.9),(4.35,3.0,.22),plaster)
box('Garden south parapet',(5.35,.65,3.35),(4.35,1.3,.22),plaster)
for y in [.2,.43,.66]:box('Courtyard far brick band',(7.28,y,.25),(.03,.15,6.1),brick)
for z in [-2.0,-.1,1.8]:
 box('Garden timber wall panel',(7.25,1.75,z),(.07,1.2,.8),timber)
 for y in [1.3,1.55,1.8,2.05,2.3]:box('Garden panel slat',(7.17,y,z),(.05,.035,.9),linen,0)
for x in [3.8,4.6,5.4,6.2,7.0]:
 for z in [-2.3,-1.5,-.7,.1,.9,1.7,2.5]:box('Garden paver',(x,.012,z),(.78,.02,.78),stone,0)
for z in [-1.5,1.65]:
 box('Raised terracotta planter',(6.55,.27,z),(1.15,.54,1.2),bricklight)
 box('Planter earth',(6.55,.545,z),(1.02,.02,1.06),timber,0)
 for i in range(6):
  a=i*2.4; x=6.55+math.cos(a)*.29; zz=z+math.sin(a)*.30; h=.7+(i%3)*.24
  box('Plant stem',(x,.55+h/2,zz),(.035,h,.035),timber,0)
  for j in range(3):
   bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1,location=pos((x+math.cos(a+j)*.14,.75+h-j*.18,zz+math.sin(a+j)*.14)))
   leaf=bpy.context.object;leaf.name='Sculptural garden foliage';leaf.scale=(.24,.19,.32);leaf.data.materials.append(foliage);meshes.append(leaf)
# A simple woven runner on the bench, with visible warp stripes and fringe.
box('Bench linen runner',(-2.50,.522,.05),(.62,.016,.95),linen,.004)
for z in [-.37+i*.045 for i in range(20)]:box('Woven runner stripe',(-2.50,.532,z),(.61,.003,.008),brick,0)
for x in [-2.78+i*.043 for i in range(14)]:
 for z in [-.46,.56]:box('Runner fringe',(x,.522,z),(.01,.009,.08),linen,0)
# A small unglazed vessel by the bench, original scenery rather than a listed product.
bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=10,radius=1,location=pos((-2.45,.23,1.35)))
vessel=bpy.context.object;vessel.name='Unglazed vessel';vessel.scale=(.20,.20,.23);vessel.data.materials.append(bricklight);meshes.append(vessel)
# Join by material for a small web draw-call budget.
for mat in [plaster,clay,timber,stone,brass,brick,bricklight,foliage,linen]:
 bpy.ops.object.select_all(action='DESELECT'); group=[o for o in scene.objects if o.type=='MESH' and o.data.materials[0]==mat and not o.name.startswith('Gallery | ')]
 for o in group:o.select_set(True)
 if not group:continue
 bpy.context.view_layer.objects.active=group[0]
 if len(group)>1:bpy.ops.object.join()
 group[0].name='Gallery | '+mat.name
architectures=[o for o in scene.objects if o.type=='MESH']
# Export architecture only. The product photograph remains a separate web asset.
bpy.ops.object.select_all(action='DESELECT')
for o in architectures:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=ROOT+'/public/artifacts/3d/bhaktapur-gallery.glb', export_format='GLB', use_selection=True, use_active_scene=True, export_apply=True, export_yup=True, export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6, export_draco_position_quantization=14)
# Editable preview artwork; the texture is an existing photograph, not a generated product.
img=bpy.data.images.load(ROOT+'/public/artifacts/thangka-centerpiece.jpg', check_existing=True)
art=bpy.data.materials.new('Existing thangka photograph'); art.use_nodes=True
p=art.node_tree.nodes.get('Principled BSDF'); tex=art.node_tree.nodes.new('ShaderNodeTexImage');tex.image=img
art.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color']);p.inputs['Roughness'].default_value=.9
bpy.ops.mesh.primitive_plane_add(size=2, location=pos((0,1.55,-3.82)), rotation=(math.pi/2,0,0))
o=bpy.context.object;o.name='Preview only | thangka photograph';o.scale=(.465,.70,1);o.data.materials.append(art)
def aim(o, target):o.rotation_euler=(Vector(pos(target))-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,location,target,power,size,color):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos(location);aim(o,target)
area('Skylight daylight',(0,4.4,.55),(0,0,-1),900,2.1,(1,.96,.88))
area('Artwork light',(0,3.1,-2),(0,1.6,-3.8),85,1.0,(1,.93,.80))
area('Courtyard daylight',(6,4,.3),(0,1.2,-.7),1100,4,(1,.97,.9))
for x in [-2,2]:area('Timber soft wash',(x,2.7,-1.1),(x,1.6,-3.8),100,2.2,(1,.94,.84))
area('Entrance fill',(1,2.8,4),(0,1.5,-3),450,4,(.90,.95,1))
cam=bpy.data.cameras.new('Gallery camera');o=bpy.data.objects.new('Gallery camera',cam);scene.collection.objects.link(o)
o.location=pos((-1.9,1.72,3.1));aim(o,(.45,1.45,-2.05));cam.lens=23;scene.camera=o
scene.world=bpy.data.worlds.new('Gallery daylight');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.34,.30,.25,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
scene.render.engine='CYCLES';scene.cycles.samples=40;scene.cycles.use_denoising=True
scene.render.resolution_x=1600;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.filepath=ROOT+'/public/artifacts/gallery-preview.png'
scene.view_settings.view_transform='AgX'
# Frame the authored asset when returning to the viewport.
for screen in bpy.data.screens:
 for a in screen.areas:
  if a.type=='VIEW_3D':
   a.spaces.active.region_3d.view_perspective='CAMERA'
   a.spaces.active.shading.type='MATERIAL'
# A second camera exposes the actual carving geometry for close inspection.
detail=bpy.data.cameras.new('Carving detail camera');detail.type='ORTHO';detail.ortho_scale=2.55
view=bpy.data.objects.new('Carving detail camera',detail);scene.collection.objects.link(view)
view.location=pos((-1.80,1.86,-1.60));aim(view,(-2.17,1.72,-3.65))
img.pack()
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/blender/bhaktapur-gallery-v4.blend')
print('ARTISANS_EYE_GALLERY_READY',len(architectures),'material groups',sum(len(o.data.polygons) for o in architectures),'polygons')
