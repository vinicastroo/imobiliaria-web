"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import api from '@/services/api'

interface ClientProps {
  id: string
  name: string
  phone: string
  email: string
  description: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { status } = useSession()
  const [clients, setClients] = useState<ClientProps[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/login')
  //   }
  // }, [status, router])

  useEffect(() => {
    const loadClients = async () => {
      // if (status !== 'authenticated') return

      try {
        setLoading(true)
        const response = await api.get('/clientes')
        setClients(response.data)
      } catch (error) {
        console.error("Erro ao carregar clientes", error)
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [status])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#17375F]" />
      </div>
    )
  }

  // if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#17375F]">Bem-vindo ao sistema interno da Auros!</h1>
          <p className="text-gray-500">Gerencie seus clientes e leads aqui.</p>
        </div>

        <Card className='py-6'>
          <CardHeader>
            <CardTitle className="text-[#17375F]">Clientes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : clients.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum cliente encontrado.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {clients.map((client) => (
                  <AccordionItem key={client.id} value={client.id}>
                    <AccordionTrigger className="hover:no-underline hover:bg-gray-50 px-2 rounded">
                      <div className="flex flex-col md:flex-row md:items-center text-left gap-1">
                        <span className="font-semibold text-gray-700">{client.name}</span>
                        <span className="text-xs md:text-sm text-gray-500 font-normal">
                          ({client.email} - {client.phone})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-50/50 p-4 border-t text-gray-600">
                      <p className="font-medium text-xs text-gray-400 uppercase mb-1">Observação:</p>
                      {client.description || "Sem descrição."}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}