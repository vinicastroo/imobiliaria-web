import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url') ?? ''

  if (!url.startsWith('https://')) {
    return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
  }

  const upstream = await fetch(url)
  const blob = await upstream.blob()
  const contentType = upstream.headers.get('Content-Type') ?? 'image/png'

  return new Response(blob, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
