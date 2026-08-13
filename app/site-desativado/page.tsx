import type { Metadata } from 'next'
import { Construction } from 'lucide-react'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SiteDesativadoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-6">
            <Construction className="h-16 w-16 text-yellow-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Site em implementação</h1>
          <p className="text-lg text-gray-500">
            Estamos preparando tudo para você. Em breve o site estará disponível.
          </p>
        </div>

        <p className="text-sm text-gray-400">
          Se você é o administrador, acesse o{' '}
          <a href="/admin" className="text-blue-600 underline hover:opacity-80">
            painel administrativo
          </a>
          .
        </p>
      </div>
    </main>
  )
}
