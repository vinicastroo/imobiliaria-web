import { MenubarHomeClient } from './menubar-home-client'
import { getTenantVisualConfig } from '@/lib/visual-config'
import type { SocialLinks } from './menubar-home-client'

interface MenubarHomeProps {
  socialLinks?: SocialLinks
}

export async function MenubarHome({ socialLinks }: MenubarHomeProps = {}) {
  const { logoUrl, secondaryColor } = await getTenantVisualConfig()

  return (
    <MenubarHomeClient
      logoUrl={logoUrl}
      primaryColor={secondaryColor}
      socialLinks={socialLinks}
    />
  )
}
