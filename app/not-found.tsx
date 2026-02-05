// src/app/not-found.tsx (ou src/pages/404.tsx)
import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        {/* Ícone Principal */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#17375F]/10 p-4 rounded-full">
            <FileQuestion size={64} className="text-[#17375F]" />
          </div>
        </div>

        {/* Título e Erro */}
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold text-[#17375F]">404</h1>
          <h2 className="text-2xl font-bold text-gray-800">
            Página não encontrada
          </h2>
          <p className="text-gray-600">
            Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido movida ou não existir mais.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" className="bg-[#17375F] hover:bg-[#122b4a] gap-2">
            <Link href="/">
              <Home size={18} />
              Ir para o Início
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2 border-gray-300 text-gray-700">
            {/* O Link href=".." tenta voltar um nível no histórico, mas um link explícito para imóveis ou contato pode ser melhor */}
            <Link href="/imoveis">
              <ArrowLeft size={18} />
              Ver Imóveis
            </Link>
          </Button>
        </div>
      </div>

      {/* Rodapézinho discreto (opcional) */}
      <div className="absolute bottom-8 text-sm text-gray-400">
        Erro: 404 - Not Found
      </div>
    </div>
  )
}