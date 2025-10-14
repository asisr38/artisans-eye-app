'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Link from 'next/link'
import BasicWebsiteBriefForm from '../../components/ui/BasicWebsiteBriefForm'

const FormEyeCanvas = dynamic(() => import('../../components/3d/FormEyeCanvas'), {
  ssr: false,
})

export default function WebsiteBriefPage() {
  const [activeKey, setActiveKey] = useState<string>('')
  const [captureFn, setCaptureFn] = useState<null | (() => Promise<string>)>(null)
  const [visual, setVisual] = useState({
    tintColor: '#ffffff',
    irisColor: '#2563eb',
    metalness: 0.15,
    roughness: 0.35,
    envIntensity: 0.8,
    background: '#eef2ff',
  })

  return (
    <main className="min-h-svh w-full bg-gray-50 text-gray-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between p-4 md:p-10">
        <h2 className="text-lg font-semibold">Project Brief</h2>
        <Link href="/" className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100" aria-label="Back to Home" tabIndex={0}>
          Back to Home
        </Link>
      </header>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 pt-0 md:grid-cols-2 md:p-10 md:pt-0">
        <div className="order-2 md:order-1">
          <BasicWebsiteBriefForm
            onFocusKeyChange={setActiveKey}
            onVisualSuggest={(v) => setVisual((prev) => ({ ...prev, ...v }))}
          />
        </div>
        <div className="order-1 md:order-2">
          <div className="sticky top-4 w-full md:top-10">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow">
              <FormEyeCanvas activeKey={activeKey} visual={visual} onCaptureRef={(fn) => setCaptureFn(() => fn)} />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                onClick={async () => {
                  if (!captureFn) return
                  const dataUrl = await captureFn()
                  if (!dataUrl) return
                  const a = document.createElement('a')
                  a.href = dataUrl
                  a.download = 'eye-preview.png'
                  a.click()
                }}
                aria-label="Capture 3D preview"
                tabIndex={0}
              >
                Capture PNG
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


