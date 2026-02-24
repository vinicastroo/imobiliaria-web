"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner' // Se você usa Sonner, senão troque por console.log ou alert

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button' // Botão do Shadcn
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import api from '@/services/api'

interface ClientProps {
  id: string
  name: string
  phone: string
  email: string
  description: string
}

export default function AdminDashboard() {
  const { status } = useSession()
  const [clients, setClients] = useState<ClientProps[]>([])
  const [loading, setLoading] = useState(true)

  // Estado para controlar qual cliente será excluído (para o Modal)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadClients = async () => {
    try {
      setLoading(true)
      const response = await api.get('/clientes')
      setClients(response.data)
    } catch (error) {
      console.error("Erro ao carregar clientes", error)
      toast.error("Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [status])

  const handleDeleteClient = async () => {
    if (!clientToDelete) return

    try {
      setIsDeleting(true)
      await api.delete(`/clientes/${clientToDelete}`)

      setClients((prev) => prev.filter((c) => c.id !== clientToDelete))

      toast.success("Cliente removido com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar", error)
      toast.error("Erro ao remover cliente")
    } finally {
      setIsDeleting(false)
      setClientToDelete(null) // Fecha o modal
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#17375F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#17375F]">Bem-vindo ao sistema interno!</h1>
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
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="font-medium text-xs text-gray-400 uppercase mb-1">Observação:</p>
                          <p className="text-sm">{client.description || "Sem descrição."}</p>
                        </div>

                        <div className="flex justify-end pt-2 border-t mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                            onClick={() => setClientToDelete(client.id)}
                          >
                            <Trash2 size={16} />
                            Excluir Cliente
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o cliente da base de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault() // Impede fechar automático para mostrar loading se quiser
                handleDeleteClient()
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}