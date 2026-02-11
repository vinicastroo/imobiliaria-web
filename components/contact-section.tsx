"use client"

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner' // Usando Sonner do shadcn em vez de react-toastify
import api from 'services/api'

import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Label } from 'components/ui/label'

const contactSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  phone: z.string().min(1, "Telefone obrigatório"),
  description: z.string().min(1, "Mensagem obrigatória"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post('/clientes', { ...data, origin: 'WEBSITE' })
      toast.success('Contato enviado com sucesso!')
      reset()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao enviar contato. Tente novamente.')
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full min-h-[600px] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#fafafa] to-[#D0DEF8] overflow-hidden"
    >
      {/* Background City Image */}
      <div className="absolute bottom-0 w-full flex justify-center opacity-80 pointer-events-none">
        <Image src="/city-background.svg" alt="Cidade" className="w-auto h-[300px] md:h-[450px]" width={300} height={300} />
      </div>

      <Card className="w-full max-w-[544px] z-10 shadow-xl bg-white/90 py-6 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#17375F]">Entre em contato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register('name')} placeholder="Seu nome completo" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register('phone')} placeholder="(00) 00000-0000" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Observação</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Como podemos ajudar?"
                className="min-h-[100px]"
                maxLength={255}
              />
            </div>

            <Button type="submit" className="w-full bg-[#17375F] hover:bg-[#122b4a]" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Contato'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}