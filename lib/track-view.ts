const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'

const VISITOR_ID_KEY = '__visitor_id__'

function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null

  try {
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return null
  }
}

export function trackView(slug: string, agencyId: string, referrerUrl: string | null) {
  void fetch(`${apiUrl}/imovel/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-agency-id': agencyId },
    body: JSON.stringify({
      slug,
      referrerUrl: referrerUrl ?? '',
      visitorId: getVisitorId() ?? undefined,
    }),
    cache: 'no-store',
  }).catch(() => {})
}
