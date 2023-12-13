import Container from '@/components/Container'
import { Box, Button, Card, TextField } from '@mui/material'

import logo from '../../assets/logo.svg'
import Image from 'next/image'

import Head from 'next/head'
import { z, infer as Infer } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export default function Login() {
  const createSchema = z.object({
    email: z.string({ required_error: 'Email é obrigatório' }),
    password: z.string({ required_error: 'Senha é obrigatório' }),
  })
  type SchemaQuestion = Infer<typeof createSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaQuestion>({ resolver: zodResolver(createSchema) })
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      const { email, password } = data

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result) {
        router.push('/admin')
      }
    },
    [router],
  )

  return (
    <Container>
      <Head>
        <title>Auros | Login</title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30%',
              gap: 2,
            }}
          >
            <Image src={logo} alt="logo auros" width={300} height={100} />

            <TextField
              variant="outlined"
              fullWidth
              label="Email"
              required
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Senha"
              required
              type="password"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('password')}
            />

            <Button
              fullWidth
              color="primary"
              variant="contained"
              type="submit"
              sx={{ p: 1.5 }}
            >
              Entrar
            </Button>
          </Card>
        </Box>
      </form>
    </Container>
  )
}
