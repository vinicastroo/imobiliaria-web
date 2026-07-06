import type { ReactNode } from 'react'
import { getTenantVisualConfig, getGoogleFontsUrl } from '@/lib/visual-config'
import { TrackingScripts } from '@/components/tracking-scripts'

export default async function TenantSiteLayout({ children }: { children: ReactNode }) {
  const { primaryColor, secondaryColor, fontFamily } = await getTenantVisualConfig()
  const fontsUrl = getGoogleFontsUrl(fontFamily)

  return (
    <>
      {fontsUrl && (
        <link rel="stylesheet" href={fontsUrl} />
      )}
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
