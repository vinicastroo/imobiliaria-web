import { Metadata } from 'next'
import { ScalaTheme } from '@/components/scala-theme'

export const metadata: Metadata = {
  title: 'Entrar | Scala',
  description: 'Acesso ao painel Scala',
  icons: { icon: '/brand/favicon.svg', apple: '/brand/scala-app-icon.svg' },
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScalaTheme />
      {children}
    </>
  )
}
