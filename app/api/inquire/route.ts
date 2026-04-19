import { NextRequest } from 'next/server'
import * as v from '@/lib/validate'
import { fail, ok, withBody, withRateLimit } from '@/lib/api'
import { sendInquiry } from '@/lib/email'

const InquirySchema = v.object({
  name: v.string({ trim: true, min: 1, max: 120 }),
  email: v.email({ max: 200 }),
  message: v.string({ trim: true, min: 20, max: 2000 }),
  artifact: v.optional(v.string({ max: 200 })),
})

export const POST = withRateLimit(
  { windowMs: 10 * 60 * 1000, max: 3 },
  withBody(InquirySchema, async (_req: NextRequest, body) => {
    const result = await sendInquiry(body)

    if (!result.ok) {
      if (result.reason === 'not_configured') {
        if (process.env.NODE_ENV === 'production') {
          return fail(
            {
              code: 'email_not_configured',
              message: 'Email delivery is not configured on this deployment.',
            },
            503
          )
        }
        // Dev convenience: log the payload and return a fake success so the
        // UI flow can be exercised without a RESEND_API_KEY. NEVER reached
        // in production (guard above).
        console.warn('[inquire] dev-mode: RESEND_API_KEY missing. Payload:', body)
        return ok({ sent: false, reason: 'dev_not_configured' })
      }

      return fail(
        { code: 'email_send_failed', message: 'Could not deliver inquiry. Please try again.' },
        502
      )
    }

    return ok({ sent: true })
  })
)
