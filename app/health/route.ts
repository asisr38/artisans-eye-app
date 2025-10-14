import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
// Use edge for universal availability (avoids region cold starts)
export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: 'artisans-eye-app',
    timestamp: Date.now(),
    env: process.env.VERCEL ? 'vercel' : 'local',
  })
}


