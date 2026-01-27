"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // Atenção: navigation no App Router
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import logo from '@/public/logo.svg'

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        toast.error('Email ou senha incorretos')
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        router.push('/admin')
        toast.success('Login realizado com sucesso')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 items-center justify-center bg-[#17375F] p-4">
      <div className="relative w-48 h-24 mb-4">
        <Image
          src={logo}
          alt="Logo Auros"
          fill
          className="object-contain"
          priority
        />
      </div>

      <Card className="w-full max-w-[400px] shadow-lg py-6">

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                {...register('email')}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register('password')}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#17375F] hover:bg-[#122b4a] mt-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}