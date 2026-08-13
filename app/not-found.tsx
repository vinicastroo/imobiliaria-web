import type { Metadata } from 'next'
import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

export default function Custom404() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-full p-4">
            <FileQuestion size={64} className="text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-primary text-7xl font-extrabold">404</h1>
          <h2 className="text-2xl font-bold text-gray-800">Página não encontrada</h2>
          <p className="text-gray-600">
            Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido
            movida ou não existir mais.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
          <Button asChild variant="default" className="gap-2">
            <Link href="/">
              <Home size={18} />
              Ir para o Início
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2 border-gray-300 text-gray-700">
            <Link href="/imoveis">
              <ArrowLeft size={18} />
              Ver Imóveis
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 text-sm text-gray-400">Erro: 404 - Not Found</div>
    </div>
  )
}
