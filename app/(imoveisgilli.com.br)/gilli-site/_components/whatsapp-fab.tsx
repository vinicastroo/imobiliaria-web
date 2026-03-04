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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1ebe5d] transition-colors"
    >
      <WhatsappLogo size={30} weight="fill" className="text-white animate-pulse" />
    </Link>
  )
}
