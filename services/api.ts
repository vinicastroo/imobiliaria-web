import axios from 'axios'
import { getSession } from 'next-auth/react'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'

const api = axios.create({
  baseURL,
  headers: {
    'x-agency-id': process.env.NEXT_PUBLIC_AGENCY_ID 
  }
})

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession()

    if (session?.user) {
      config.headers['x-user-id'] = session.user.id

      if (session.user.agencyId) {
        config.headers['x-agency-id'] = session.user.agencyId
      } else {
        // SUPER_ADMIN has no agency — remove the env-based default header
        delete config.headers['x-agency-id']
      }
    } else {
      // Public page (no session): resolve tenant from __tenant__ cookie
      const match = document.cookie.match(/(?:^|;\s*)__tenant__=([^;]*)/)
      const tenantId = match ? decodeURIComponent(match[1]) : null
      if (tenantId) {
        config.headers['x-agency-id'] = tenantId
      }
    }
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default api