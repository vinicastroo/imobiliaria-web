import axios from 'axios'
import { getSession } from 'next-auth/react'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'

const api = axios.create({
  baseURL,
})

// Cache em memória — reseta a cada refresh/navegação, nunca persiste valor de outra sessão
let cachedTenantId: string | null = null

async function resolveTenantId(): Promise<string> {
  if (cachedTenantId) {
    console.log('[api] tenantId (cache memória):', cachedTenantId)
    return cachedTenantId
  }

  try {
    const res = await fetch('/api/tenant')
    const data = await res.json() as { tenantId: string | null }
    console.log('[api] /api/tenant response:', { status: res.status, ok: res.ok, data })
    if (res.ok && data.tenantId) {
      cachedTenantId = data.tenantId
      return cachedTenantId
    }
  } catch (err) {
    console.error('[api] falha ao buscar /api/tenant:', err)
  }

  return ''
}

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
      const tenantId = await resolveTenantId()
      config.headers['x-agency-id'] = tenantId
      console.log('[api] x-agency-id final:', tenantId, '| url:', config.url)
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
