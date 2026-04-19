/**
 * Shared API route utilities for app/api/**.
 *
 * Goals:
 *  - One canonical response shape everywhere (ok/err).
 *  - Validation wrapper that fails fast with structured issues.
 *  - In-memory per-IP rate limiter (STOPGAP — replace with Upstash/Redis
 *    before this goes behind a load balancer or serverless).
 *  - A session helper that today is a stub, tomorrow hides whatever auth
 *    provider we pick. Every route should call `requireSession(req)` (or
 *    explicitly opt out via `PUBLIC_ROUTE`) so auth lives in one place.
 */

import { NextRequest, NextResponse } from 'next/server'
import type { Validator } from './validate'

// ────── Response shape ──────

export type ApiError = {
  code: string
  message: string
  details?: unknown
}

export const ok = <T>(data: T, init?: number | ResponseInit) =>
  NextResponse.json(
    { ok: true, data },
    typeof init === 'number' ? { status: init } : init
  )

export const fail = (error: ApiError, status = 400) =>
  NextResponse.json({ ok: false, error }, { status })

// ────── Validation wrapper ──────
//
// Route handlers in Next.js 15 receive (req, ctx) where ctx.params is a
// Promise. We pass that through untouched so dynamic routes can still
// `await ctx.params` if they need it.

export type RouteCtx = { params: Promise<Record<string, string | string[] | undefined>> }
export type RouteHandler = (req: NextRequest, ctx: RouteCtx) => Promise<Response> | Response

type Handler<T> = (
  req: NextRequest,
  parsed: T,
  ctx: RouteCtx
) => Promise<Response> | Response

export function withBody<T>(schema: Validator<T>, handler: Handler<T>): RouteHandler {
  return async (req, ctx) => {
    let raw: unknown
    try {
      raw = await req.json()
    } catch {
      return fail({ code: 'invalid_json', message: 'Request body must be valid JSON' }, 400)
    }
    const result = schema.safeParse(raw)
    if (!result.success) {
      return fail(
        {
          code: 'validation_failed',
          message: 'Request body failed validation',
          details: result.error.issues,
        },
        400
      )
    }
    return handler(req, result.data, ctx)
  }
}

export function withQuery<T>(schema: Validator<T>, handler: Handler<T>): RouteHandler {
  return async (req, ctx) => {
    const params: Record<string, string> = {}
    req.nextUrl.searchParams.forEach((v, k) => {
      params[k] = v
    })
    const result = schema.safeParse(params)
    if (!result.success) {
      return fail(
        {
          code: 'invalid_query',
          message: 'Query parameters failed validation',
          details: result.error.issues,
        },
        400
      )
    }
    return handler(req, result.data, ctx)
  }
}

// ────── Rate limiter (in-memory — STOPGAP) ──────
//
// This is fine for a single Node process. It's a LIE for:
//   - Vercel serverless (instances don't share memory)
//   - Multiple containers behind a load balancer
//   - Any autoscaling setup
// Replace with Upstash Redis (@upstash/ratelimit) before production traffic.

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export type RateLimitOpts = {
  windowMs: number
  max: number
  // Identifier derivation. Defaults to x-forwarded-for, then x-real-ip, then 'unknown'.
  key?: (req: NextRequest) => string
}

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

export function withRateLimit(opts: RateLimitOpts, handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const id = (opts.key ?? clientKey)(req)
    const now = Date.now()
    const bucket = buckets.get(id)
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(id, { count: 1, resetAt: now + opts.windowMs })
    } else {
      bucket.count += 1
      if (bucket.count > opts.max) {
        const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: 'rate_limited',
              message: `Too many requests. Retry in ${retryAfter}s.`,
            },
          },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        )
      }
    }
    // Opportunistic cleanup of expired buckets when the map gets large.
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k)
      }
    }
    return handler(req, ctx)
  }
}

// ────── Session / auth ──────
//
// STUB. When we wire Supabase Auth (per the agreed stack), swap the body of
// requireSession to read the Supabase session cookie and verify it. Every
// non-public route should call this — do NOT inline auth checks.
//
// Until that lands, set REQUIRE_AUTH_MOCK=1 in .env.local to simulate
// authenticated requests (any x-mock-user header passes); leave unset to
// treat every route as public.

export type Session = { userId: string; role: 'buyer' | 'seller' | 'admin' }

export async function requireSession(req: NextRequest): Promise<Session | Response> {
  if (process.env.REQUIRE_AUTH_MOCK !== '1') {
    // Auth not enforced yet. Return a placeholder session so handlers can
    // keep their shape — flip REQUIRE_AUTH_MOCK or replace this when
    // Supabase Auth lands.
    return { userId: 'anonymous', role: 'buyer' }
  }
  const mockUser = req.headers.get('x-mock-user')
  if (!mockUser) {
    return fail(
      { code: 'unauthorized', message: 'Authentication required' },
      401
    )
  }
  return { userId: mockUser, role: 'buyer' }
}

// ────── External fetch helpers ──────

export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 8_000, ...rest } = init
  return fetch(url, { ...rest, signal: AbortSignal.timeout(timeoutMs) })
}
