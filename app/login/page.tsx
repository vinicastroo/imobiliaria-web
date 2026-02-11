"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import logo from '@/public/logo-blue.svg'

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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5">

      {/* LADO ESQUERDO: FORMULÁRIO (2 colunas de 5 = 40%) */}
      <div className="flex items-center justify-center py-12 lg:col-span-2 bg-white">
        <div className="mx-auto w-[350px] space-y-6">

          {/* Cabeçalho do Form */}
          <div className="flex flex-col space-y-2 text-center items-center">
            <div className="relative w-40 h-20 mb-2">
              <Image
                src={logo}
                alt="Logo Auros"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17375F]">
              Acesso Administrativo
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@auros.com.br"
                {...register('email')}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                {/* Link opcional de esqueci a senha */}
                {/* <a href="#" className="text-xs text-[#17375F] hover:underline">Esqueceu a senha?</a> */}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register('password')}
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#17375F] hover:bg-[#122b4a] mt-4 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Acessar'
              )}
            </Button>
          </form>

          {/* Rodapé do Form (Opcional) */}
          {/* <p className="px-8 text-center text-sm text-muted-foreground">
            Protegido por reCAPTCHA e sujeito à{' '}
            <span className="underline underline-offset-4 hover:text-[#17375F] cursor-pointer">
              Política de Privacidade
            </span>
            .
          </p> */}
        </div>
      </div>

      {/* LADO DIREITO: IMAGEM (3 colunas de 5 = 60%) */}
      <div className="hidden bg-muted lg:block lg:col-span-3 relative">
        {/* Imagem de Fundo (Substitua pela sua imagem real de um imóvel bonito) */}
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Imagem de Imóvel de Alto Padrão"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay (Camada escura transparente) para dar destaque */}
        <div className="absolute inset-0 bg-[#17375F]/60 mix-blend-multiply" />

        {/* Texto sobre a imagem (Opcional) */}
        <div className="absolute bottom-10 left-10 z-20 text-white max-w-lg">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;A tecnologia impulsionando o mercado imobiliário. Gerencie seus imóveis com eficiência e elegância.&rdquo;
            </p>
            {/* <footer className="text-sm opacity-80">Auros Imobiliária</footer> */}
          </blockquote>
        </div>
      </div>

    </div>
  )
}