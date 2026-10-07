import Link from 'next/link'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { getTenantIdentity } from '@/lib/tenant-info'

export async function SiteFooter() {
  const [{ primaryColor }, { name }] = await Promise.all([
    getTenantVisualConfig(),
    getTenantIdentity(),
  ])
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto text-white" style={{ backgroundColor: primaryColor }}>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between md:px-12">
        <span className="text-lg font-semibold">{name}</span>
        <nav className="flex items-center gap-6 text-sm text-white/85">
          <Link href="/" className="transition-colors hover:text-white">
            Início
          </Link>
          <Link href="/imoveis" className="transition-colors hover:text-white">
            Imóveis
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/15 px-6 py-4 text-center text-xs text-white/70 md:px-12 md:text-left">
        © {year} {name}. Todos os direitos reservados.
      </div>
    </footer>
  )
}
