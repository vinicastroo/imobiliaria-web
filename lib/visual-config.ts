import { cache } from 'react'
import { headers } from 'next/headers'

export interface VisualConfig {
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export const PLATFORM_DEFAULTS: VisualConfig = {
  logoUrl: null,
  primaryColor: '#EE9020',
  secondaryColor: '#0F172A',
  fontFamily: 'Montserrat',
}

/** 
 * Font families available for tenant selection.
 * Key: display name stored in DB | Value: Google Fonts API query string
 * Empty string = loaded via next/font, no <link> needed.
 */
export const SUPPORTED_FONTS: Record<string, string> = {
  Montserrat: '',
  Inter: 'Inter:wght@300;400;500;700',
  Roboto: 'Roboto:wght@300;400;500;700',
  Lato: 'Lato:wght@300;400;700',
  Poppins: 'Poppins:wght@300;400;500;700',
  Raleway: 'Raleway:wght@300;400;500;700',
  'Open Sans': 'Open+Sans:wght@300;400;500;700',
}

/**
 * Fetches the visual config for the current tenant.
 * Deduplicated with React.cache — safe to call in multiple Server Components
 * in the same request without extra DB/network hits.
 * Falls back to PLATFORM_DEFAULTS on any error or missing tenant.
 */
export const getTenantVisualConfig = cache(async (): Promise<VisualConfig> => {
  const tenantId = (await headers()).get('x-tenant-id')

  if (!tenantId) return PLATFORM_DEFAULTS

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/visual-config`,
      {
        headers: { 'x-agency-id': tenantId },
        next: { revalidate: 300 }, // 5-min Next.js Data Cache
      },
    )

    if (!res.ok) return PLATFORM_DEFAULTS

    const data = (await res.json()) as Partial<VisualConfig>

    return {
      logoUrl: data.logoUrl ?? null,
      primaryColor: data.primaryColor ?? PLATFORM_DEFAULTS.primaryColor,
      secondaryColor: data.secondaryColor ?? PLATFORM_DEFAULTS.secondaryColor,
      fontFamily: SUPPORTED_FONTS[data.fontFamily ?? ''] !== undefined
        ? (data.fontFamily ?? PLATFORM_DEFAULTS.fontFamily)
        : PLATFORM_DEFAULTS.fontFamily,
    }
  } catch {
    return PLATFORM_DEFAULTS
  }
})

/** Builds a Google Fonts URL for the given family (returns null for Montserrat). */
export function getGoogleFontsUrl(fontFamily: string): string | null {
  const query = SUPPORTED_FONTS[fontFamily]
  if (!query) return null // Montserrat or unknown — no <link> needed
  return `https://fonts.googleapis.com/css2?family=${query}&display=swap`
}
