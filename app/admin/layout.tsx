import type { Metadata } from 'next'
import { getTenantVisualConfig } from '@/lib/visual-config'
import { getTenantIdentity, FALLBACK_NAME } from '@/lib/tenant-info'
import { Menubar } from '@/components/menu'
import { ScalaTheme } from '@/components/scala-theme'
import '@/app/globals.css'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  icons: { icon: '/brand/favicon.svg', apple: '/brand/scala-app-icon.svg' },
}

// Server Component — fetches tenant visual config once per request.
// getTenantVisualConfig() is deduplicated via React.cache, so the root
// layout and this layout share a single network call.
// O painel usa a marca Scala (<ScalaTheme />); a imobiliária aparece na sidebar.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [{ iconUrl, primaryColor }, identity] = await Promise.all([
    getTenantVisualConfig(),
    getTenantIdentity(),
  ])
  const tenantName = identity.name === FALLBACK_NAME ? null : identity.name

  return (
    <div className="min-h-screen bg-gray-50">
      <ScalaTheme />
      <Menubar tenantLogoUrl={iconUrl} tenantName={tenantName} tenantColor={primaryColor} />

      <main className="w-full pl-20">{children}</main>
    </div>
  )
}
