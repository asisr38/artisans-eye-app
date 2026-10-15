"""Original mesh components adapted from references/museum-components-v2.png.

All ornament is geometry: open lattice, feather loops, raised leaves and beads.
Coordinates are local X/Y-up/Z, with the carved face toward +Z. No image planes
or baked shading are used for the architectural details.
"""
import math
import bpy
import bmesh
from mathutils import Vector

TAU = 2 * math.pi


class Carving:
    def __init__(self):
        self.vertices = []
        self.faces = []

    def add(self, vertices, faces):
        offset = len(self.vertices)
        self.vertices.extend(vertices)
        self.faces.extend(tuple(offset + i for i in face) for face in faces)

    def box(self, x, y, z, w, h, d):
        self.add([(x + a*w/2, y + b*h/2, z + c*d/2)
                  for a,b,c in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),
                                (-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]],
                 [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])

    def tube(self, points, radius=.008, sides=6, closed=False):
        points = [Vector(p) for p in points]
        vertices = []
        for i,p in enumerate(points):
            previous = points[(i-1)%len(points)] if closed or i else p
            following = points[(i+1)%len(points)] if closed or i<len(points)-1 else p
            tangent = (following-previous).normalized()
            normal = Vector((0,0,1))
            if abs(tangent.dot(normal)) > .95:
                normal = Vector((0,1,0))
            across = tangent.cross(normal).normalized()
            normal = across.cross(tangent).normalized()
            vertices.extend(tuple(p + radius*(math.cos(j*TAU/sides)*across +
                                               math.sin(j*TAU/sides)*normal)) for j in range(sides))
        faces = []
        for i in range(len(points) if closed else len(points)-1):
            for j in range(sides):
                faces.append((i*sides+j,i*sides+(j+1)%sides,
                              ((i+1)%len(points))*sides+(j+1)%sides,
                              ((i+1)%len(points))*sides+j))
        if not closed:
            faces += [tuple(range(sides-1,-1,-1)),
                      tuple((len(points)-1)*sides+j for j in range(sides))]
        self.add(vertices, faces)

    def ring(self,x,y,z,rx,ry,radius=.008,n=32):
        self.tube([(x+rx*math.cos(i*TAU/n),y+ry*math.sin(i*TAU/n),z)
                   for i in range(n)],radius,closed=True)

    def leaf(self,x,y,z,length,width,angle,depth=.013):
        # Lens-shaped outline and raised ridge form a solid carved petal.
        outline = [(length*.5*(1-math.cos(i*TAU/12)),width*math.sin(i*TAU/12))
                   for i in range(12)]
        outline += [(length*.52,0),(length*.52,0)]
        vertices = [(x+u*math.cos(angle)-v*math.sin(angle),
                     y+u*math.sin(angle)+v*math.cos(angle),
                     z+(depth if i==12 else -.006 if i==13 else 0))
                    for i,(u,v) in enumerate(outline)]
        self.add(vertices,[(i,(i+1)%12,12) for i in range(12)] +
                         [((i+1)%12,i,13) for i in range(12)])

    def rosette(self,x,y,z,r=.045):
        for i in range(8):
            a=i*TAU/8
            self.leaf(x+math.cos(a)*r*.12,y+math.sin(a)*r*.12,z,r*.88,r*.19,a,r*.22)
        self.ring(x,y,z+.012,r*.17,r*.17,.006,12)

    def vine(self,x,y,z,length,vertical=False,step=.16):
        def at(u,v): return (x+v,y+u,z) if vertical else (x+u,y+v,z)
        count=max(1,round(length/step))
        step=length/count
        self.tube([at(length*i/(count*10),.012*math.sin(i*TAU/10))
                   for i in range(count*10+1)],.006)
        for i in range(count):
            u=(i+.5)*step
            for side in [-1,1]:
                px,py,pz=at(u,side*.008)
                angle=(math.pi/2 if vertical else 0)+side*.9
                self.leaf(px,py,pz+.003,.066,.018,angle,.011)

    def frame(self,w,h):
        for width,height,thick,z in [(w,h,.075,.0),(w-.14,h-.14,.045,.035),
                                     (w-.25,h-.25,.026,.065)]:
            for x in [-width/2,width/2]:self.box(x,0,z,thick,height,.10)
            for y in [-height/2,height/2]:self.box(0,y,z,width+thick,thick,.10)
        for x in [-w/2,w/2]:self.vine(x,-h/2+.07,.063,h-.14,True)
        for y in [-h/2,h/2]:self.vine(-w/2+.04,y,.065,w-.08)
        for y,width,thickness,z in [(-h/2-.06,w+.17,.075,.065),
                                  (-h/2-.13,w+.24,.065,.07),
                                  (h/2+.075,w+.15,.075,.035)]:
            self.box(0,y,z,width,thickness,.23)
        for x in [-w*.32,w*.32]:self.box(x,-h/2-.22,-.015,.12,.15,.21)

    def lattice(self,cx,cy,w,h,z,spacing=.105):
        for slope in [-1,1]:
            for n in range(-math.ceil((w+h)/spacing),math.ceil((w+h)/spacing)+1):
                offset=n*spacing
                ends=[]
                for x in [-w/2,w/2]:
                    y=slope*x+offset
                    if -h/2<=y<=h/2:ends.append((cx+x,cy+y,z))
                for y in [-h/2,h/2]:
                    x=(y-offset)/slope
                    if -w/2<x<w/2:ends.append((cx+x,cy+y,z))
                if len(ends)==2:self.tube(ends,.009,4)

    def object(self,name,mat,location=(0,0,0),rotation=0):
        mesh=bpy.data.meshes.new(name)
        mesh.from_pydata([(x,-z,y) for x,y,z in self.vertices],[],self.faces)
        mesh.update()
        bm=bmesh.new();bm.from_mesh(mesh)
        bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000001)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
        bm.to_mesh(mesh);bm.free()
        obj=bpy.data.objects.new('Gallery | '+name,mesh)
        bpy.context.scene.collection.objects.link(obj)
        obj.location=(location[0],-location[2],location[1]);obj.rotation_euler[2]=rotation
        mesh.materials.append(mat)
        obj.asset_mark()
        obj.asset_data.description='Original Bhaktapur-inspired mesh study from approved museum-components-v2 reference; illustrative scale.'
        obj['reference']='references/museum-components-v2.png'
        obj['geometry']='Open mesh lattice and raised relief; no image-plane ornament'
        return obj


def peacock_window():
    c=Carving();c.frame(1.31,2.02)
    # Circular pierced fan, with double feather loops and a sculptural bird.
    c.ring(0,.15,.10,.54,.60,.018,64)
    for i in range(28):
        a=i*TAU/28
        tx=.51*math.cos(a);ty=.15+.56*math.sin(a)
        bx=0;by=-.20
        length=math.hypot(tx-bx,ty-by);angle=math.atan2(ty-by,tx-bx)
        loop=[]
        for j in range(24):
            t=j*TAU/24
            u=length*.5*(1-math.cos(t));v=.027*math.sin(t)
            loop.append((bx+u*math.cos(angle)-v*math.sin(angle),
                         by+u*math.sin(angle)+v*math.cos(angle),.105))
        c.tube(loop,.006,closed=True)
        ex=bx+(tx-bx)*.84;ey=by+(ty-by)*.84
        c.ring(ex,ey,.116,.012,.015,.004,12)
    # Layered leaf solids describe the body and paired wings; curved neck and beak.
    c.leaf(0,-.51,.13,.43,.095,math.pi/2,.065)
    for side in [-1,1]:
        c.leaf(side*.015,-.40,.17,.27,.049,math.pi/2+side*.34,.027)
        c.tube([(side*.035,-.48,.15),(side*.045,-.59,.15),(side*.10,-.60,.15)],.009)
    c.tube([(0,-.19,.19),(0,-.07,.21),(.008,.03,.22),(.045,.09,.22)],.032,10)
    c.leaf(.016,.062,.245,.088,.036,0,.025)
    c.leaf(.073,.077,.246,.054,.013,-.12,.008)
    c.ring(.052,.091,.275,.007,.007,.003,10)
    for dx in [-.016,0,.016]:c.tube([(.034,.111,.235),(.034+dx,.16,.235)],.004)
    # Separate lower lattice panel, cornice rosettes and flanking leaf spandrels.
    c.lattice(0,-.77,1.04,.24,.10,.09)
    c.box(0,-.61,.085,1.10,.035,.08)
    for x in [-.44,-.22,0,.22,.44]:c.rosette(x,.87,.12,.057)
    for side in [-1,1]:
        for y in [-.39,-.13,.13,.39,.65]:c.leaf(side*.53,y,.12,.095,.028,math.pi/2,.018)
    return c


def gallery_window():
    c=Carving();c.frame(3.18,1.32)
    for i in range(5):
        x=(i-2)*.58
        c.lattice(x,-.05,.48,.84,.045,.092)
        for dx in [-.27,.27]:
            c.box(x+dx,0,.08,.055,1.11,.13)
            c.vine(x+dx,-.49,.155,.98,True,.18)
        # Five small cusped opening heads, a continuous solid timber outline.
        points=[(x-.24,.28,.10),(x-.24,.40,.10),(x-.18,.47,.10),
                (x-.10,.44,.10),(x-.08,.52,.10),(x,.59,.10),
                (x+.08,.52,.10),(x+.10,.44,.10),(x+.18,.47,.10),
                (x+.24,.40,.10),(x+.24,.28,.10)]
        c.tube(points,.022,8)
        c.rosette(x,-.56,.15,.050)
        c.box(x,-.84,.015,.14,.20,.25)
    return c


def timber_band(width=2.50):
    c=Carving();c.box(0,0,0,width,.19,.12)
    for y in [-.108,.108]:c.box(0,y,.035,width+.08,.033,.18)
    count=round(width/.23)
    for i in range(count):
        x=-width/2+(i+.5)*width/count
        c.rosette(x,0,.072,.072)
    for y in [-.091,.091]:
        for i in range(round(width/.04)):
            c.leaf(-width/2+i*.04,y,.08,.027,.011,.35,.009)
    return c


def strut():
    c=Carving()
    c.tube([(0,0,0),(.48,.51,0)],.055,4)
    for i in range(6):
        u=(i+.35)/6
        c.leaf(u*.48,u*.51,.045,.11,.042,-.6,.025)
        c.leaf(u*.48,u*.51,-.045,.11,.042,-.6,-.025)
    c.box(0,-.02,0,.14,.11,.16)
    c.box(.48,.53,0,.22,.09,.19)
    return c


def install(timber):
    objects=[]
    window=peacock_window()
    for x,label in [(-2.17,'left'),(2.17,'right')]:
        objects.append(window.object('Peacock window '+label,timber,(x,1.72,-3.73)))
    gallery=gallery_window()
    objects.append(gallery.object('Five-bay gallery window',timber,(-2.93,1.90,.20),math.pi/2))
    objects.append(gallery.object('Courtyard gallery window',timber,(5.30,1.80,-2.71)))
    objects.append(timber_band().object('Carved focal lintel',timber,(0,3.0,-3.51)))
    # One editable assembly for the six relief struts, keeping draw calls modest.
    brackets=Carving()
    for x in [-2.82,2.82]:
        side=-1 if x>0 else 1
        for z in [-2.40,.35,2.80]:
            part=strut()
            brackets.add([(x+side*a,2.55+b,z+c) for a,b,c in part.vertices],part.faces)
    objects.append(brackets.object('Carved courtyard struts',timber))
    return objects
