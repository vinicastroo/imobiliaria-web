import { Construction } from 'lucide-react'

export default function SiteDesativadoPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="bg-yellow-100 rounded-full p-6">
            <Construction className="h-16 w-16 text-yellow-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Site em implementação</h1>
          <p className="text-gray-500 text-lg">
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
