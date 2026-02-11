import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auros | Login",
  description: "Acesso administrativo",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}