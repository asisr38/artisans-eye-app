import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

// Resend's default verified sender for unverified accounts. Swap to
// `inquiries@<yourdomain>` once the domain is verified in Resend.
const FROM_ADDRESS = "The Artisan's Eye <onboarding@resend.dev>"
const TO_ADDRESS = 'ashishforllc@gmail.com'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export type InquiryPayload = {
  name: string
  email: string
  message: string
  artifact?: string
}

export type InquiryResult =
  | { ok: true }
  | { ok: false; reason: 'not_configured' | 'send_failed' }

export async function sendInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  if (!resend) return { ok: false, reason: 'not_configured' }

  const subjectArtifact = payload.artifact ? `: ${payload.artifact}` : ''
  const subject = `New inquiry${subjectArtifact} — ${payload.name}`

  const body = [
    `From: ${payload.name} <${payload.email}>`,
    payload.artifact ? `Artifact: ${payload.artifact}` : null,
    '',
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      replyTo: payload.email,
      subject,
      text: body,
    })
    if (result.error) return { ok: false, reason: 'send_failed' }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'send_failed' }
  }
}
