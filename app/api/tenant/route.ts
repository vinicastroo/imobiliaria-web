import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const tenantId = (await headers()).get('x-tenant-id') ?? null
  return NextResponse.json({ tenantId })
}
