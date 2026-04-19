'use client'

import { useState, type FormEvent } from 'react'

type State = 'idle' | 'submitting' | 'success' | 'error'

type Props = {
  artifact?: string
  whatsAppHref?: string
}

export default function InquiryForm({ artifact, whatsAppHref }: Props) {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('submitting')
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      artifact,
    }

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setErrorMsg(data?.error?.message ?? 'Could not send inquiry. Please try again.')
        setState('error')
        return
      }
      setState('success')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="mb-4 text-2xl font-light tracking-wide text-white">Thank you.</p>
        <p className="text-white/60">
          Your inquiry has been received. You&rsquo;ll hear back within one business day.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full border border-white/20 bg-transparent px-4 py-3 text-white placeholder:text-white/30 focus:border-white/60 focus:outline-none transition-colors'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-white/60">
          Your name
        </label>
        <input id="name" name="name" required maxLength={120} className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-white/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-white/60">
          Message <span className="text-white/35">— tell us what draws you to this piece</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="bg-white px-8 py-3 font-medium tracking-wide text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === 'submitting' ? 'Sending…' : 'Send inquiry'}
        </button>
        {whatsAppHref && (
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/30 px-8 py-3 text-center font-medium tracking-wide text-white transition-colors hover:border-white/60"
          >
            Or message on WhatsApp
          </a>
        )}
      </div>
    </form>
  )
}
