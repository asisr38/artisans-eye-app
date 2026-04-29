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
      <div className="mx-auto max-w-xl py-20 text-center">
        <p className="font-display mb-5 text-[clamp(1.75rem,3.6vw,2.5rem)] text-[var(--color-cream)]">
          Thank you.
        </p>
        <p className="text-[var(--color-cream-2)]">
          Your inquiry has been received. You&rsquo;ll hear back within one business day.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full border-0 border-b border-[var(--hairline-strong)] bg-transparent px-0 py-3 text-[16px] text-[var(--color-cream)] placeholder:text-[var(--color-cream-3)]/50 transition-colors duration-500 focus:border-[var(--color-bronze)] focus:outline-none'

  const labelClass =
    'mb-3 block text-[10px] uppercase tracking-[0.32em] text-[var(--color-cream-3)]'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-9">
      <div>
        <label htmlFor="name" className={labelClass}>
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          inputMode="email"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          Message
          <span className="ml-2 normal-case tracking-normal text-[var(--color-cream-3)]/70">
            — tell us what draws you to this piece
          </span>
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

      {errorMsg && (
        <p className="text-sm text-[var(--color-bronze-soft)]">{errorMsg}</p>
      )}

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="min-h-[52px] border border-[var(--color-cream)] bg-[var(--color-cream)] px-10 py-4 text-[12px] uppercase tracking-[0.32em] text-[var(--color-ink)] transition-all duration-500 hover:bg-transparent hover:text-[var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === 'submitting' ? 'Sending' : 'Send inquiry'}
        </button>
        {whatsAppHref && (
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[52px] items-center justify-center border border-[var(--hairline-strong)] px-10 py-4 text-center text-[12px] uppercase tracking-[0.32em] text-[var(--color-cream-2)] transition-colors duration-500 hover:border-[var(--color-cream)] hover:text-[var(--color-cream)]"
          >
            Message on WhatsApp
          </a>
        )}
      </div>
    </form>
  )
}
