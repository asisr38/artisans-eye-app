'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BasicWebsiteBriefForm from '../../components/ui/BasicWebsiteBriefForm'

export default function WebsiteBriefPage() {
  const [activeKey, setActiveKey] = useState<string>('')

  // Avoid any hydration differences on mobile (date, UA-dependent attrs)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <main className="min-h-svh w-full bg-gray-50 text-gray-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between p-4 md:p-10">
        <h2 className="text-base font-semibold md:text-lg">Project Brief</h2>
        <Link href="/" className="rounded-full border px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm hover:bg-gray-100" aria-label="Back to Home" tabIndex={0}>
          Back to Home
        </Link>
      </header>
      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 p-3 pt-0 md:gap-6 md:p-10 md:pt-0">
        <div>
          <BasicWebsiteBriefForm
            onFocusKeyChange={setActiveKey}
          />
        </div>
      </section>
    </main>
  )
}


