import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTenantVisualConfig } from '@/lib/visual-config'
import { getTenantIdentity, FALLBACK_NAME } from '@/lib/tenant-info'
import { AdminShell } from '@/components/admin-shell'
import { SIDEBAR_COOKIE } from '@/lib/sidebar'
import { ScalaTheme } from '@/components/scala-theme'
import '@/app/globals.css'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  icons: { icon: '/brand/favicon.svg', apple: '/brand/scala-app-icon.svg' },
}

// Server Component — fetches tenant visual config once per request.
// getTenantVisualConfig() is deduplicated via React.cache, so the root
// layout and this layout share a single network call.
// O painel usa a marca Scala (<ScalaTheme />); a imobiliária aparece no menu.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [{ iconUrl, primaryColor }, identity, cookieStore] = await Promise.all([
    getTenantVisualConfig(),
    getTenantIdentity(),
    cookies(),
  ])
  const tenantName = identity.name === FALLBACK_NAME ? null : identity.name
  const initialExpanded = cookieStore.get(SIDEBAR_COOKIE)?.value !== 'collapsed'

  return (
    <>
      <ScalaTheme />
      <AdminShell
        tenantLogoUrl={iconUrl}
        tenantName={tenantName}
        tenantColor={primaryColor}
        initialExpanded={initialExpanded}
      >
        {children}
      </AdminShell>
    </>
  )
}
