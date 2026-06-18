"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react'

import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/password/forgot', {
        email: data.email,
        callbackUrl: `${window.location.origin}/login/reset-password`,
      })
      setSent(true)
    } catch {
      toast.error('Ocorreu um erro. Tente novamente.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[380px] space-y-6">

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <MailCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary">Verifique seu e-mail</h1>
            <p className="text-sm text-muted-foreground">
              Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em breve. Verifique também a pasta de spam.
            </p>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold text-primary">Esqueceu a senha?</h1>
              <p className="text-sm text-muted-foreground">
                Informe seu e-mail e enviaremos as instruções para criar uma nova senha.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>

              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
