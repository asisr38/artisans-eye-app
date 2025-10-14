import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
// Use nodejs runtime for better Vercel compatibility
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: 'artisans-eye-app',
    timestamp: Date.now(),
    env: process.env.VERCEL ? 'vercel' : 'local',
  })
}


