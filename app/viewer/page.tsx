import dynamic from 'next/dynamic'

const ModelViewerCanvas = dynamic(
  () => import('../../components/3d/ModelViewerCanvas'),
  { ssr: false }
)

export default function ViewerPage() {
  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <h1 className="text-base font-semibold tracking-wide text-amber-300">Artifact Viewer</h1>
        <a href="/" className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">Back</a>
      </div>
      <ModelViewerCanvas src="/artifacts/3_15_2023.glb" />
    </main>
  )
}


