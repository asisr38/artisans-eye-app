import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const tenantId = process.env.MS_TENANT_ID
    const clientId = process.env.MS_CLIENT_ID
    const clientSecret = process.env.MS_CLIENT_SECRET
    const driveId = process.env.MS_DRIVE_ID
    const itemId = process.env.MS_EXCEL_ITEM_ID
    const tableName = process.env.MS_EXCEL_TABLE_NAME || 'Table1'

    if (tenantId && clientId && clientSecret && driveId && itemId) {
      const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      })
      if (!tokenRes.ok) throw new Error('Failed to get token')
      const token = await tokenRes.json()

      const row = [
        body.timestamp || new Date().toISOString(),
        body.businessName || '',
        body.businessDescription || '',
        body.mainGoal || '',
        body.threeWords || '',
        body.targetCustomers || '',
        body.serviceAreas || '',
        body.hasLogoColors || '',
        body.stylePreference || '',
        body.theme || '',
        body.likedSites || '',
        body.mainServices || '',
        body.hasAssets || '',
        (Array.isArray(body.wantedFeatures) ? body.wantedFeatures.join('; ') : '') || '',
        body.wantsCMS ? 'Yes' : 'No',
        body.wantsMaintenance ? 'Yes' : 'No',
        body.notes || '',
        body.backgroundImageUrl || '',
        body.lightColor || '',
      ]

      const graphUrl = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/workbook/tables/${tableName}/rows/add`
      await fetch(graphUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (_e) {
    // Intentionally return a generic error without logging in production build
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


