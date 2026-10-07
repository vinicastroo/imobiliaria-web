'use client'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'
const VISITOR_ID_KEY = '__visitor_id__'
const VIEWS_KEY = '__property_views_v1__'
const VIEW_TTL = 24 * 60 * 60 * 1000
const MAX_ENTRIES = 500
const inFlight = new Map<string, Promise<void>>()
const seen = new Map<string, number>()
let fallbackVisitorId: string | undefined

function getVisitorId(): string {
  try {
    const stored = localStorage.getItem(VISITOR_ID_KEY)
    if (stored && /^[\w-]{8,64}$/.test(stored)) return stored
    fallbackVisitorId ??= crypto.randomUUID()
    localStorage.setItem(VISITOR_ID_KEY, fallbackVisitorId)
  } catch {
    // Storage can be unavailable; retain an anonymous ID for this page session.
    fallbackVisitorId ??= crypto.randomUUID()
  }
  return fallbackVisitorId
}

function readViews(): Record<string, number> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    const now = Date.now()
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([, expiry]) => typeof expiry === 'number' && expiry > now && expiry <= now + VIEW_TTL,
        )
        .slice(-MAX_ENTRIES),
    )
  } catch {
    return {}
  }
}

export function trackView(propertyId: string, slug: string, agencyId: string): Promise<void> {
  if (typeof window === 'undefined' || document.visibilityState !== 'visible' || !agencyId) {
    return Promise.resolve()
  }

  const key = JSON.stringify([agencyId, propertyId])
  if (Math.max(seen.get(key) ?? 0, readViews()[key] ?? 0) > Date.now()) return Promise.resolve()
  const pending = inFlight.get(key)
  if (pending) return pending

  const request = (async () => {
    try {
      const response = await fetch(`${apiUrl}/imovel/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-agency-id': agencyId },
        body: JSON.stringify({
          slug,
          referrerUrl: document.referrer.slice(0, 2048),
          visitorId: getVisitorId(),
        }),
        keepalive: true,
        signal: AbortSignal.timeout(10_000),
        cache: 'no-store',
      })
      if (!response.ok) return
      const result = await response.json()
      if (!result.ok) return
      const expiry =
        typeof result.expiresAt === 'number'
          ? Math.min(result.expiresAt, Date.now() + VIEW_TTL)
          : Date.now() + VIEW_TTL
      seen.delete(key)
      seen.set(key, expiry)
      if (seen.size > MAX_ENTRIES) seen.delete(seen.keys().next().value!)
      try {
        // Merge again after the request to preserve visits recorded by other tabs.
        const views = readViews()
        delete views[key]
        views[key] = expiry
        localStorage.setItem(
          VIEWS_KEY,
          JSON.stringify(Object.fromEntries(Object.entries(views).slice(-MAX_ENTRIES))),
        )
      } catch {
        // The in-memory guard still deduplicates if storage is blocked/full.
      }
    } catch {
      // Analytics must never break the property page; failures remain retryable.
    }
  })().finally(() => {
    inFlight.delete(key)
  })
  inFlight.set(key, request)
  return request
}
