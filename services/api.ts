import axios from 'axios'
import { getSession } from 'next-auth/react'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'

const api = axios.create({
  baseURL,
})

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession()

    if (session?.user) {
      config.headers['x-user-id'] = session.user.id

      if (session.user.agencyId) {
        config.headers['x-agency-id'] = session.user.agencyId
      } else {
        // SUPER_ADMIN has no agency
        delete config.headers['x-agency-id']
      }
    } else if (!config.headers['x-agency-id']) {
      // Public page (no session) and no explicit per-request agency ID:
      // try __tenant__ cookie first, fall back to fetching /api/tenant, then env var
      const match = document.cookie.match(/(?:^|;\s*)__tenant__=([^;]*)/)
      let tenantId = match ? decodeURIComponent(match[1]) : null

      console.log('[api] cookie __tenant__:', tenantId, '| all cookies:', document.cookie)

      if (!tenantId) {
        try {
          const res = await fetch('/api/tenant')
          const data = await res.json() as { tenantId: string | null }
          console.log('[api] /api/tenant response:', { status: res.status, ok: res.ok, data })
          if (res.ok) {
            tenantId = data.tenantId
            if (tenantId) {
              document.cookie = `__tenant__=${encodeURIComponent(tenantId)}; path=/; samesite=lax`
            }
          }
        } catch (err) {
          console.error('[api] falha ao buscar /api/tenant:', err)
          // network error — fall through to env var
        }
      }

      config.headers['x-agency-id'] = tenantId ?? ''
      console.log('[api] x-agency-id final:', config.headers['x-agency-id'], '| url:', config.url)
    }
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => {
    console.log('[api] resposta:', response.config.url, '| status:', response.status, '| x-agency-id enviado:', response.config.headers?.['x-agency-id'])
    return response
  },
  (error) => {
    console.error('[api] erro na resposta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      'x-agency-id': error.config?.headers?.['x-agency-id'],
    })
    return Promise.reject(error)
  }
)

export default api