import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=5547997882496&text=Ol%C3%A1,%20vim%20pelo%20site%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es'

export function WhatsAppFab() {
  return (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-colors hover:bg-[#1ebe5d]"
    >
      <WhatsappLogo size={30} weight="fill" className="animate-pulse text-white" />
    </Link>
  )
}
