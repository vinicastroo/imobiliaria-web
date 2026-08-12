import { cache } from 'react'
import { headers } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
const FALLBACK_NAME = 'Portal Imobiliário'

export interface TenantIdentity {
  name: string
  slug: string | null
}

/**
 * Resolves the current tenant's display name for SEO metadata (title,
 * description, JSON-LD) on the generic /sites/[tenant] site engine.
 * Reads the x-tenant-name header set by middleware; falls back to a
 * resolve-tenant fetch when the header is missing, mirroring the fallback
 * in getTenantVisualConfig.
 */
export const getTenantIdentity = cache(async (): Promise<TenantIdentity> => {
  const headerStore = await headers()

  const headerName = headerStore.get('x-tenant-name')
  if (headerName) {
    return { name: decodeURIComponent(headerName), slug: headerStore.get('x-tenant-slug') }
  }

  const host = headerStore.get('host')
  if (!host) return { name: FALLBACK_NAME, slug: null }

  try {
    const hostname = host.split(':')[0]
    const res = await fetch(
      `${API_URL}/resolve-tenant?hostname=${encodeURIComponent(hostname)}`,
      { next: { revalidate: 300, tags: ['tenant'] } },
    )
    if (!res.ok) return { name: FALLBACK_NAME, slug: null }
    const tenant = (await res.json()) as { name?: string; slug?: string }
    return { name: tenant.name ?? FALLBACK_NAME, slug: tenant.slug ?? null }
  } catch {
    return { name: FALLBACK_NAME, slug: null }
  }
})
