import { getTenantVisualConfig } from '@/lib/visual-config'
import type { ReactNode } from 'react'

export default async function GilliSiteLayout({ children }: { children: ReactNode }) {
  const { primaryColor, secondaryColor } = await getTenantVisualConfig()
  return (
    <div
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
