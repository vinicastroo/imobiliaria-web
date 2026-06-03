import { getTenantVisualConfig } from '@/lib/visual-config'

export async function SiteFooter() {
  const { primaryColor } = await getTenantVisualConfig()

  return (
    <footer
      className="py-8 px-6 text-center text-sm text-white/80 mt-auto"
      style={{ backgroundColor: primaryColor }}
    >
      <p>Todos os direitos reservados.</p>
    </footer>
  )
}
