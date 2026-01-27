import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, MessageCircle } from 'lucide-react' // Usando Lucide para manter padrão Shadcn

export function MenubarHome() {
  return (
    <header className="flex justify-center items-center bg-[#17375F] w-full">
      <div className="w-full max-w-[1200px] flex justify-between items-center p-4">

        {/* Logo com responsividade via CSS (sem useMediaQuery) */}
        <Link href="/">
          <Image
            src="/logo-auros-minimalist.svg"
            alt="Logo Auros"
            width={120}
            height={120}
            // Mobile: 80px (w-20), Desktop: 120px (md:w-[120px])
            className="w-20 h-20 md:w-[120px] md:h-[120px] object-contain"
            priority // Carrega mais rápido por ser LCP (Largest Contentful Paint) provável
          />
        </Link>

        {/* Links e Ícones */}
        <nav className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <Link
              href="https://api.whatsapp.com/send?phone=5547988163739&text=Olá, vim pelo site, gostaria de mais informações"
              aria-label="WhatsApp"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <MessageCircle size={24} />
            </Link>

            <Link
              href="https://www.instagram.com/auroscorretoraimobiliaria/"
              aria-label="Instagram"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Instagram size={24} />
            </Link>

            <Link
              href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR"
              aria-label="Facebook"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Facebook size={24} />
            </Link>
          </div>

          <div className="flex items-center gap-4 text-white text-sm md:text-base font-medium">
            <Link href="/imoveis" className="hover:underline hover:opacity-80 transition-opacity">
              Imóveis
            </Link>
            <Link href="/#contact" className="hover:underline hover:opacity-80 transition-opacity whitespace-nowrap">
              Entre em contato
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}