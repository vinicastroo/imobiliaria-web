import { getTenantVisualConfig } from '@/lib/visual-config'
import type { ReactNode } from 'react'
import { WhatsAppFab } from './_components/whatsapp-fab'

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
      <WhatsAppFab />
    </div>
  )
}
