import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Mail, Phone, Instagram } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'
import { getTenantVisualConfig } from '@/lib/visual-config'

export default async function Footer() {
  const { logoUrl, primaryColor, secondaryColor } = await getTenantVisualConfig()

  return (
    <footer className="flex flex-col">
      {/* Seção Principal */}
      <div className="text-white py-10 px-4" style={{ backgroundColor: secondaryColor, opacity: 0.98 }}>
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">

          {/* Coluna 1: Logo */}
          <div className="flex items-center justify-center">
            <Image src={logoUrl ?? '/logo-gilli.svg'} alt="Imóveis Gilli Logo" width={160} height={160} className="w-40" />
          </div>

          {/* Coluna 2: Endereço */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left w-full md:w-auto">
            <h3 className="text-base font-semibold border-b border-white pb-1 mb-1 w-fit">
              Nossa Localização
            </h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <p className="max-w-[200px]">
                {/* TODO: Inserir endereço da Gilli */}
                Endereço - Cidade - Estado
              </p>
            </div>
            <Link
              href="https://api.whatsapp.com/send?phone=55XXXXXXXXXXX&&text=Olá, vim pelo site"
              className="flex items-center gap-3 text-sm hover:text-gray-300 transition-colors"
            >
              <Phone size={18} className="shrink-0" />
              <span>(47) 99788-2496</span>
            </Link>
          </div>

          {/* Coluna 3: Contato & Social */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left w-full md:w-auto">
            <h3 className="text-base font-semibold border-b border-white pb-1 mb-1 w-fit">
              Contato
            </h3>

            <Link href="https://www.instagram.com/imoveisgilli/" className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <Instagram size={18} />
              {/* TODO: Inserir @ do Instagram da Gilli */}
              <span>@imoveisgilli</span>
            </Link>

            <Link href="https://api.whatsapp.com/send?phone=55XXXXXXXXXXX&&text=Olá" className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <WhatsappLogo size={18} />
              {/* TODO: Inserir número do WhatsApp da Gilli */}
              <span>(XX) XXXXX-XXXX</span>
            </Link>

            <Link href="mailto:contato@imoveisgilli.com.br" className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <Mail size={18} />
              {/* TODO: Inserir e-mail da Gilli */}
              <span>contato@imoveisgilli.com.br</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Faixa Inferior */}
      <div className="text-white py-4 px-4 text-xs" style={{ backgroundColor: secondaryColor, }}>
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p className="opacity-80">
            Imóveis Gilli - CRECI 54 430 F
          </p>

          <Link
            href="https://www.codelabz.com.br/"
            target="_blank"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            <span>Desenvolvido por:</span>
            <Image src="/codelabz.svg" alt="Code Labz" width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
