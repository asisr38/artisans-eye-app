"""Artisan's Eye gallery study. Run from Blender's Python Console.
Creates a new scene, preserves any other open scene, saves .blend and exports GLB.
Coordinates are authored as web X/Y(up)/Z then converted to Blender Z-up.
Architecture is original contemporary scenery, not a documented heritage building.
"""
import bpy, math, time
from pathlib import Path
from mathutils import Vector
ROOT = str(Path(__file__).resolve().parents[2])
Path(ROOT, 'assets/blender/archive').mkdir(parents=True, exist_ok=True)
if bpy.context.object and bpy.context.object.mode != 'OBJECT': bpy.ops.object.mode_set(mode='OBJECT')
# Preserve the working scene, including any edits made after the previous save.
if bpy.data.filepath.startswith(ROOT+'/assets/blender/'):
 bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/blender/archive/working-before-'+str(int(time.time()))+'.blend', copy=True)
scene = bpy.data.scenes.new('Artisans Eye | Valley Reference Study')
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
timber=material('Smoked timber',(.20,.13,.09),.58)
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
box('Right masonry wall',(3.13,1.75,0),(.26,3.5,8.2),plaster)
# Clay wall as an inset, framed by layered timber joinery.
box('Clay focal recess',(0,1.73,-3.97),(2.16,3.40,.08),clay)
for x in [-1.17,1.17]:
 box('Outer jamb',(x,1.68,-3.79),(.18,3.36,.26),timber)
 box('Inner jamb bead',(x*.90,1.70,-3.67),(.035,3.14,.035),brass,.004)
 for y in [.18,.31,2.73,2.87]:box('Jamb collar',(x,y,-3.72),(.23,.07,.30),timber,.008)
for y,w,h,z in [(3.00,2.53,.16,-3.73),(3.15,2.70,.12,-3.78),(3.27,2.84,.08,-3.83)]:
 box('Layered head moulding',(0,y,z),(w,h,.34),timber,.01)
box('Stone threshold',(0,.045,-3.74),(2.75,.09,.5),stone,.01)
# Decorative geometric rosettes. Original motifs, no copied sacred figures.
def rosette(x,y,z,r=.085):
 for i in range(8):
  angle=i*math.pi/4
  o=box('Rosette petal',(x+math.cos(angle)*r*.48,y+math.sin(angle)*r*.48,z),(.07,.025,.026),timber,.01)
  o.rotation_euler[1]=angle
 box('Rosette centre',(x,y,z+.012),(.035,.035,.026),brass,.008)
for x in [-.95,-.63,-.31,0,.31,.63,.95]:rosette(x,3.01,-3.53,.07)
# Deep-set side windows: frame within frame, fine diamond lattice and fan head.
for center in [-2.17,2.17]:
 box('Window shadow recess',(center,1.70,-3.92),(1.31,2.24,.09),timber,.005)
 for offset,w,h,depth in [(0,1.42,2.48,.14),(.055,1.30,2.34,.11),(.10,1.17,2.20,.07)]:
  for x in [center-w/2,center+w/2]:box('Window layered jamb',(x,1.72,-3.80+offset),(.065,h,depth),timber,.008)
  for y in [1.72-h/2,1.72+h/2]:box('Window layered rail',(center,y,-3.80+offset),(w+.065,.065,depth),timber,.008)
 # Diagonal bars clipped to a rectangular light; geometry carries the pattern.
 halfw=.53; halfh=.88
 for slope in [-1,1]:
  for n in range(-9,10):
   intercept=n*.16
   candidates=[]
   for x in [-halfw,halfw]:
    y=slope*x+intercept
    if -halfh<=y<=halfh:candidates.append((x,y))
   for y in [-halfh,halfh]:
    x=(y-intercept)/slope
    if -halfw<=x<=halfw:candidates.append((x,y))
   if len(candidates)>=2:
    (x1,y1),(x2,y2)=candidates[:2]; length=math.hypot(x2-x1,y2-y1)
    o=box('Diamond lattice',(center+(x1+x2)/2,1.63+(y1+y2)/2,-3.64),(length,.022,.025),timber,.003)
    o.rotation_euler[1]=-math.atan2(y2-y1,x2-x1)
 # Radiating fan with a modest curved outer rail.
 for i in range(13):
  a=math.pi*i/12; r=.50
  o=box('Window fan spoke',(center+math.cos(a)*r/2,2.53+math.sin(a)*r/2,-3.61),(r,.025,.04),timber,.003)
  o.rotation_euler[1]=-a
 for i in range(24):
  a=math.pi*(i+.5)/24
  o=box('Window fan arch',(center+.52*math.cos(a),2.53+.52*math.sin(a),-3.61),(.08,.045,.07),timber,.004)
  o.rotation_euler[1]=math.pi/2-a
 box('Projecting window sill',(center,.49,-3.65),(1.63,.14,.43),timber,.014)
 for x in [center-.48,center+.48]:box('Sill corbel',(x,.36,-3.78),(.13,.16,.24),timber)
# Brick dado with staggered courses; individual bricks catch side lighting.
for side in [-1,1]:
 for row in range(9):
  y=.07+row*.09
  for col in range(24):
   z=-3.83+col*.33+(row%2)*.165
   if z>3.93:continue
   box('Hand-sized brick',(side*2.991,y,z),(.027,.077,.311),bricklight if (row*11+col*7)%5==0 else brick,0)
 box('Timber dado cap',(side*2.97,.87,0),(.10,.065,8),timber,.008)
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
for zi in range(25):
 z=-3.85+zi*.32
 if -.40<z<1.50:
  for x in [-2.1,2.1]:box('Short skylight joist',(x,3.43,z),(1.8,.16,.10),timber,.008)
 else:box('Close-spaced ceiling joist',(0,3.43,z),(6.12,.16,.10),timber,.008)
for x in [-2.1,2.1]:box('Ceiling side infill',(x,3.56,0),(1.8,.08,8.2),timber,.008)
for z,depth in [(-2.3,3.0),(2.85,2.3)]:box('Ceiling end infill',(0,3.56,z),(2.4,.08,depth),timber,.008)
for x in [-1.23,1.23]:box('Skylight curb',(x,3.61,.55),(.14,.26,2.16),timber)
for z in [-.53,1.63]:box('Skylight curb',(0,3.61,z),(2.6,.26,.14),timber)
# Contemporary discreet track lighting under the historic-inspired structure.
for x in [-.80,.80]:
 box('Museum light track',(x,3.27,-2.4),(.028,.025,2.3),brass,.004)
 for z in [-3.1,-2.1]:box('Small gallery luminaire',(x,3.19,z),(.09,.12,.13),timber,.01)
box('Contemplation bench',(-2.50,.46,.05),(.65,.10,1.75),timber,.025)
for z in [-.53,.63]:box('Bench support',(-2.50,.23,z),(.49,.40,.12),timber)
# Join by material for a small web draw-call budget.
for mat in [plaster,clay,timber,stone,brass,brick,bricklight]:
 bpy.ops.object.select_all(action='DESELECT'); group=[o for o in scene.objects if o.type=='MESH' and o.data.materials[0]==mat]
 for o in group:o.select_set(True)
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
bpy.ops.mesh.primitive_plane_add(size=2, location=pos((0,1.62,-3.84)), rotation=(math.pi/2,0,0))
o=bpy.context.object;o.name='Preview only | thangka photograph';o.scale=(.55,.825,1);o.data.materials.append(art)
def aim(o, target):o.rotation_euler=(Vector(pos(target))-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,location,target,power,size,color):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos(location);aim(o,target)
area('Skylight daylight',(0,4.4,.55),(0,0,-1),900,2.1,(1,.96,.88))
area('Artwork light',(0,3.1,-2),(0,1.6,-3.8),85,1.0,(1,.93,.80))
area('Entrance fill',(1,2.8,4),(0,1.5,-3),450,4,(.90,.95,1))
cam=bpy.data.cameras.new('Gallery camera');o=bpy.data.objects.new('Gallery camera',cam);scene.collection.objects.link(o)
o.location=pos((1.75,1.78,2.9));aim(o,(0,1.5,-3.4));cam.lens=25;scene.camera=o
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
img.pack()
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/blender/bhaktapur-gallery-v2.blend')
print('ARTISANS_EYE_GALLERY_READY',len(architectures),'material groups',sum(len(o.data.polygons) for o in architectures),'polygons')
