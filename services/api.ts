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
      // try __tenant__ cookie first, then fall back to env var
      const match = document.cookie.match(/(?:^|;\s*)__tenant__=([^;]*)/)
      const tenantId = match ? decodeURIComponent(match[1]) : null
      config.headers['x-agency-id'] = tenantId ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
    }
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default api