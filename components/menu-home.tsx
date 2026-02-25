import { MenubarHomeClient } from './menubar-home-client'
import { getTenantVisualConfig } from '@/lib/visual-config'

export async function MenubarHome() {
  const { iconUrl, logoUrl, secondaryColor } = await getTenantVisualConfig()
  return <MenubarHomeClient logoUrl={iconUrl ?? logoUrl} primaryColor={secondaryColor} />
}
