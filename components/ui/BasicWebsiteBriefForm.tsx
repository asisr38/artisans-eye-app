'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type BasicWebsiteBriefFormProps = {
  onFocusKeyChange?: (key: string) => void
  onVisualSuggest?: (visual: {
    tintColor?: string
    irisColor?: string
    metalness?: number
    roughness?: number
    envIntensity?: number
    background?: string
  }) => void
}

export default function BasicWebsiteBriefForm({ onFocusKeyChange, onVisualSuggest }: BasicWebsiteBriefFormProps) {
  const [form, setForm] = useState({
    timestamp: '',
    businessName: '',
    businessDescription: '',
    mainGoal: '',
    threeWords: '',
    targetCustomers: '',
    serviceAreas: '',
    hasLogoColors: '',
    stylePreference: '',
    theme: 'Light',
    likedSites: '',
    mainServices: '',
    hasAssets: '',
    wantedFeatures: [] as string[],
    wantsCMS: false,
    wantsMaintenance: false,
    notes: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const features = [
    'Contact form / Quote request',
    'Map / Location section',
    'Photo gallery / Portfolio',
    'Testimonials carousel',
    'Blog / Articles',
    'Social media links',
  ]

  const handleChange = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleFocus = (key: keyof typeof form) => {
    onFocusKeyChange?.(key)
  }

  const toggleFeature = (feat: string) => {
    setForm((f) => {
      const exists = f.wantedFeatures.includes(feat)
      return {
        ...f,
        wantedFeatures: exists ? f.wantedFeatures.filter((x) => x !== feat) : [...f.wantedFeatures, feat],
      }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // Suggest a visual theme from content heuristics
  const updateVisualSuggestion = () => {
    const prefersDark = form.theme === 'Dark'
    // Derive hue from threeWords or stylePreference
    const keyText = `${form.threeWords} ${form.stylePreference}`.toLowerCase()
    const modern = /modern|tech|digital|saas|ai|startup/.test(keyText)
    const natural = /nature|eco|organic|green|earth|outdoor/.test(keyText)
    const luxury = /luxury|premium|elegant|gold|royal/.test(keyText)

    const base: {
      tintColor?: string
      irisColor?: string
      metalness?: number
      roughness?: number
      envIntensity?: number
      background?: string
    } = {}

    if (luxury) {
      base.tintColor = '#f5e6c8'
      base.irisColor = '#9b6b00'
      base.envIntensity = 1.2
      base.metalness = 0.35
      base.roughness = 0.25
      base.background = prefersDark ? '#0b0b0b' : '#faf7ef'
    } else if (natural) {
      base.tintColor = '#e6f5ec'
      base.irisColor = '#1f7a53'
      base.envIntensity = 0.7
      base.metalness = 0.1
      base.roughness = 0.55
      base.background = prefersDark ? '#0b1410' : '#eaf7f0'
    } else if (modern) {
      base.tintColor = '#e8ecff'
      base.irisColor = '#2563eb'
      base.envIntensity = 1.0
      base.metalness = 0.2
      base.roughness = 0.35
      base.background = prefersDark ? '#0b0d16' : '#eef2ff'
    } else {
      base.tintColor = prefersDark ? '#dcdcdc' : '#ffffff'
      base.irisColor = prefersDark ? '#38bdf8' : '#2563eb'
      base.envIntensity = 0.8
      base.metalness = 0.15
      base.roughness = 0.4
      base.background = prefersDark ? '#0a0a0a' : '#f6f7ff'
    }

    onVisualSuggest?.(base)
  }

  // Recompute suggestions when key drivers change
  React.useEffect(() => {
    updateVisualSuggestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.theme, form.threeWords, form.stylePreference])

  return (
    <div className="rounded-2xl bg-white p-6 shadow md:p-8">
      <h1 className="mb-2 text-2xl font-bold">Website Brief Form</h1>
      <p className="mb-6 text-gray-600">Fill this form to describe your business and website goals.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Timestamp</label>
          <input
            type="text"
            value={form.timestamp}
            onChange={(e) => handleChange('timestamp', e.target.value)}
            onFocus={() => handleFocus('timestamp')}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="MM/DD/YYYY hh:mm:ss"
            aria-label="Timestamp"
            tabIndex={0}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">What is your business name?</label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            onFocus={() => handleFocus('businessName')}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Business name"
            tabIndex={0}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Please describe your business</label>
          <textarea
            value={form.businessDescription}
            onChange={(e) => handleChange('businessDescription', e.target.value)}
            onFocus={() => handleFocus('businessDescription')}
            className="min-h-[80px] w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Business description"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">What is your main goal for this website?</label>
          <input
            type="text"
            value={form.mainGoal}
            onChange={(e) => handleChange('mainGoal', e.target.value)}
            onFocus={() => handleFocus('mainGoal')}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Main goal"
            tabIndex={0}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Describe your business in 3 words</label>
          <input
            type="text"
            value={form.threeWords}
            onChange={(e) => handleChange('threeWords', e.target.value)}
            onFocus={() => handleFocus('threeWords')}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Three words"
            tabIndex={0}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Who are your target customers?</label>
            <input
              type="text"
              value={form.targetCustomers}
              onChange={(e) => handleChange('targetCustomers', e.target.value)}
              onFocus={() => handleFocus('targetCustomers')}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Target customers"
              tabIndex={0}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">What areas or cities do you serve?</label>
            <input
              type="text"
              value={form.serviceAreas}
              onChange={(e) => handleChange('serviceAreas', e.target.value)}
              onFocus={() => handleFocus('serviceAreas')}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Service areas"
              tabIndex={0}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Do you already have a logo or brand colors?</label>
            <input
              type="text"
              value={form.hasLogoColors}
              onChange={(e) => handleChange('hasLogoColors', e.target.value)}
              onFocus={() => handleFocus('hasLogoColors')}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Logo or colors"
              tabIndex={0}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">What kind of style do you want for your website?</label>
            <input
              type="text"
              value={form.stylePreference}
              onChange={(e) => handleChange('stylePreference', e.target.value)}
              onFocus={() => handleFocus('stylePreference')}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Style preference"
              tabIndex={0}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Do you prefer a light or dark theme?</label>
          <select
            value={form.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            onFocus={() => handleFocus('theme')}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Theme preference"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">List 2–3 websites you like and what you like about them</label>
          <textarea
            value={form.likedSites}
            onChange={(e) => handleChange('likedSites', e.target.value)}
            onFocus={() => handleFocus('likedSites')}
            className="min-h-[80px] w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Liked websites"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Main services to highlight</label>
          <textarea
            value={form.mainServices}
            onChange={(e) => handleChange('mainServices', e.target.value)}
            onFocus={() => handleFocus('mainServices')}
            className="min-h-[80px] w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Main services"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Do you have photos, testimonials, or project examples?</label>
          <input
            type="text"
            value={form.hasAssets}
            onChange={(e) => handleChange('hasAssets', e.target.value)}
            onFocus={() => handleFocus('hasAssets')}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Assets available"
            tabIndex={0}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Select desired features</label>
          <div className="grid gap-2 md:grid-cols-2">
            {features.map((feat) => (
              <label key={feat} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.wantedFeatures.includes(feat)}
                  onChange={() => toggleFeature(feat)}
                  aria-label={feat}
                />
                {feat}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.wantsCMS}
              onChange={(e) => handleChange('wantsCMS', e.target.checked)}
              aria-label="Wants CMS"
            />
            Yes, I want easy editing access (CMS)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.wantsMaintenance}
              onChange={(e) => handleChange('wantsMaintenance', e.target.checked)}
              aria-label="Wants maintenance"
            />
            Yes, I’d like ongoing maintenance after launch
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Any other notes or must‑have features?</label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            onFocus={() => handleFocus('notes')}
            className="min-h-[80px] w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Other notes"
          />
        </div>

        <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-black">
          Submit
        </button>
      </form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-lg border bg-green-50 p-4"
          >
            <p className="mb-2 text-sm font-medium">Form Submitted (Demo)</p>
            <pre className="max-h-[320px] overflow-auto rounded-lg border bg-white p-2 text-xs">{JSON.stringify(form, null, 2)}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


