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
      <div
        className="px-4 py-10 text-white"
        style={{ backgroundColor: secondaryColor, opacity: 0.98 }}
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-8 md:flex-row md:items-start md:gap-4">
          {/* Coluna 1: Logo */}
          <div className="flex items-center justify-center">
            <Image
              src={logoUrl ?? '/logo-gilli.svg'}
              alt="Imóveis Gilli Logo"
              width={160}
              height={160}
              className="w-40"
            />
          </div>

          {/* Coluna 2: Endereço */}
          <div className="flex w-full flex-col items-center gap-3 text-center md:w-auto md:items-start md:text-left">
            <h3 className="mb-1 w-fit border-b border-white pb-1 text-base font-semibold">
              Nossa Localização
            </h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={18} className="mt-0.5 shrink-0" />
              <p className="max-w-[200px]">SC-350, N° 377, Aurora - SC, 89186-000</p>
            </div>
            <Link
              href="https://api.whatsapp.com/send?phone=5547997882496&&text=Ol%C3%A1"
              className="flex items-center gap-3 text-sm transition-colors hover:text-gray-300"
            >
              <Phone size={18} className="shrink-0" />
              <span>(47) 99788-2496</span>
            </Link>
          </div>

          {/* Coluna 3: Contato & Social */}
          <div className="flex w-full flex-col items-center gap-3 text-center md:w-auto md:items-start md:text-left">
            <h3 className="mb-1 w-fit border-b border-white pb-1 text-base font-semibold">
              Contato
            </h3>

            <Link
              href="https://www.instagram.com/gilli_engenharia_e_imoveis/"
              className="flex items-center gap-2 text-sm transition-colors hover:text-gray-300"
            >
              <Instagram size={18} />
              <span>@gilli_engenharia_e_imoveis</span>
            </Link>

            <Link
              href="https://api.whatsapp.com/send?phone=5547997882496&&text=Ol%C3%A1"
              className="flex items-center gap-2 text-sm transition-colors hover:text-gray-300"
            >
              <WhatsappLogo size={18} />
              <span>(47) 99788-2496</span>
            </Link>

            <Link
              href="mailto:contato@imoveisgilli.com.br"
              className="flex items-center gap-2 text-sm transition-colors hover:text-gray-300"
            >
              <Mail size={18} />
              {/* TODO: Inserir e-mail da Gilli */}
              <span>contato@imoveisgilli.com.br</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Faixa Inferior */}
      <div className="px-4 py-4 text-xs text-white" style={{ backgroundColor: secondaryColor }}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <p className="opacity-80">Imóveis Gilli - CRECI/SC 8982-J</p>

          <Link
            href="https://www.codelabz.com.br/"
            target="_blank"
            className="flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
          >
            <span>Desenvolvido por:</span>
            <Image src="/codelabz.svg" alt="Code Labz" width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
