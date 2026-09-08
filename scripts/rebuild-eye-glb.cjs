// Asset pipeline for public/artifacts/3d/eye.glb (and future GLBs — PR 5's
// sculpture turntable needs the same treatment).
//
// The source export (Nomad Sculpt) ships VEC3/u16-normalized COLOR_0 vertex
// colors, an unused COLOR_1, a 90k-vertex transmission cornea shell, and no
// compression — 5.4 MB, and three r184 fails to compile a vertex shader for
// the VEC3 colors ("cannot convert vec3 to vec4"). This script:
//   - drops COLOR_1 (three.js only reads COLOR_0)
//   - converts COLOR_0 to VEC4/u8 normalized (the well-supported layout)
//   - optionally replaces KHR_materials_transmission with plain alpha BLEND
//     (--strip-transmission): visually identical here, and it avoids three's
//     transmission pass (a full extra scene render per frame)
//   - simplifies the cornea shell (~92% fewer vertices, no visible change)
//   - dedup + prune + quantize + meshopt compression (drei's useGLTF wires
//     the meshopt decoder by default — no app code needed)
// Result: 5.4 MB → ~150 KB.
//
// Deps are not in package.json (one-off tool). Run with:
//   npm i --no-save @gltf-transform/core @gltf-transform/functions \
//     @gltf-transform/extensions meshoptimizer
//   node scripts/rebuild-eye-glb.cjs <src.glb> <dst.glb> [--strip-transmission]
const { NodeIO } = require('@gltf-transform/core')
const { ALL_EXTENSIONS } = require('@gltf-transform/extensions')
const fns = require('@gltf-transform/functions')
const { MeshoptSimplifier, MeshoptEncoder } = require('meshoptimizer')

const SRC = process.argv[2]
const DST = process.argv[3]
const STRIP_TRANSMISSION = process.argv.includes('--strip-transmission')

if (!SRC || !DST) {
  console.error(
    'usage: node scripts/rebuild-eye-glb.cjs <src.glb> <dst.glb> [--strip-transmission]',
  )
  process.exit(1)
}

;(async () => {
  await MeshoptSimplifier.ready
  await MeshoptEncoder.ready

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })

  const doc = await io.read(SRC)
  const root = doc.getRoot()

  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const c1 = prim.getAttribute('COLOR_1')
      if (c1) {
        prim.setAttribute('COLOR_1', null)
        c1.dispose()
      }
      const c0 = prim.getAttribute('COLOR_0')
      if (c0 && c0.getType() === 'VEC3') {
        const count = c0.getCount()
        const out = new Uint8Array(count * 4)
        const el = [0, 0, 0]
        for (let i = 0; i < count; i++) {
          c0.getElement(i, el) // denormalized floats 0..1
          out[i * 4] = Math.round(el[0] * 255)
          out[i * 4 + 1] = Math.round(el[1] * 255)
          out[i * 4 + 2] = Math.round(el[2] * 255)
          out[i * 4 + 3] = 255
        }
        const next = doc.createAccessor('COLOR_0').setType('VEC4').setArray(out).setNormalized(true)
        prim.setAttribute('COLOR_0', next)
        c0.dispose()
      }
    }
  }

  if (STRIP_TRANSMISSION) {
    for (const mat of root.listMaterials()) {
      if (mat.getExtension('KHR_materials_transmission')) {
        mat.setExtension('KHR_materials_transmission', null)
        mat.setAlphaMode('BLEND')
      }
    }
  }

  // Simplify only the heavy cornea shell; leave the painted inner eye intact
  // (simplification would eat vertex-color detail in the iris).
  for (const mesh of root.listMeshes()) {
    if (!mesh.getName().includes('Sclera')) continue
    for (const prim of mesh.listPrimitives()) {
      fns.weldPrimitive(prim, { tolerance: 0 })
      fns.simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio: 0.08, error: 0.0008 })
    }
  }

  await doc.transform(
    fns.dedup(),
    fns.prune(),
    fns.quantize(),
    fns.meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  )

  await io.write(DST, doc)
  const { statSync } = require('fs')
  console.log('wrote', DST, (statSync(DST).size / 1024).toFixed(0) + ' KB')
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      console.log(mesh.getName(), 'verts:', prim.getAttribute('POSITION').getCount())
    }
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
