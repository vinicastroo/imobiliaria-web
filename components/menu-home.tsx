import { MenubarHomeClient } from './menubar-home-client'
import { getTenantVisualConfig } from '@/lib/visual-config'

export async function MenubarHome() {
  const { logoUrl, secondaryColor } = await getTenantVisualConfig()
  return <MenubarHomeClient logoUrl={logoUrl} primaryColor={secondaryColor} />
}
