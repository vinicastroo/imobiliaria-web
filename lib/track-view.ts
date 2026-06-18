const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'

export function trackView(slug: string, agencyId: string, referrerUrl: string | null) {
  void fetch(`${apiUrl}/imovel/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-agency-id': agencyId },
    body: JSON.stringify({ slug, referrerUrl: referrerUrl ?? '' }),
    cache: 'no-store',
  }).catch(() => {})
}
