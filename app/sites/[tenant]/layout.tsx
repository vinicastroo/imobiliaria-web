import type { ReactNode } from 'react'
import { getTenantVisualConfig } from '@/lib/visual-config'
import { TrackingScripts } from '@/components/tracking-scripts'

export default async function TenantSiteLayout({ children }: { children: ReactNode }) {
  const { primaryColor, secondaryColor, fontFamily } = await getTenantVisualConfig()

  return (
    <>
      {/* Font <link> is already injected with preconnect by the root layout (app/layout.tsx) */}
      <style>{`
        :root {
          --primary-color:   ${primaryColor};
          --secondary-color: ${secondaryColor};
          --site-font:       '${fontFamily}', sans-serif;
        }
      `}</style>
      <div style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
        {children}
      </div>
      <TrackingScripts />
    </>
  )
}
