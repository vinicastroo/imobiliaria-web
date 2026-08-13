import { getTenantVisualConfig } from '@/lib/visual-config'

export async function SiteFooter() {
  const { primaryColor } = await getTenantVisualConfig()

  return (
    <footer
      className="mt-auto px-6 py-8 text-center text-sm text-white/80"
      style={{ backgroundColor: primaryColor }}
    >
      <p>Todos os direitos reservados.</p>
    </footer>
  )
}
