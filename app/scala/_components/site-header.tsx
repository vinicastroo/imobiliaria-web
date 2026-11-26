import Image from 'next/image'
import Link from 'next/link'
import scalaLogo from '@/public/brand/scala-logo.svg'

const NAV = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#clientes', label: 'Clientes' },
  { href: '#precos', label: 'Preços' },
  { href: '#perguntas', label: 'Dúvidas' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--scala-border)] bg-[var(--scala-paper)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="Scala — início" className="shrink-0">
          <Image src={scalaLogo} alt="Scala" className="h-7 w-auto" priority />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--scala-muted)] transition-colors hover:text-[var(--scala-ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#demonstracao"
          className="inline-flex h-10 items-center rounded-[10px] bg-[var(--scala-royal)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--scala-royal-hover)]"
        >
          Agendar demonstração
        </a>
      </div>
    </header>
  )
}
