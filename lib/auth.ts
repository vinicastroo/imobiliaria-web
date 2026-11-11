import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiUrl } from '@/lib/api-url'

const API_URL = apiUrl('http://localhost:3333')

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },

      // `req.headers` contains the headers set by the middleware, including
      // x-tenant-id (injected from the resolved hostname). We forward it as
      // x-agency-id so the backend can verify tenant ownership.
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        // Middleware sets x-tenant-id on every request (Step 1).
        // On local dev, fall back to NEXT_PUBLIC_AGENCY_ID.
        const tenantId = req?.headers?.['x-tenant-id'] as string | undefined

        try {
          const res = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              'Content-Type': 'application/json',
              ...(tenantId ? { 'x-agency-id': tenantId } : {}),
            },
          })

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.message || 'Credenciais inválidas')
          }

          // accessToken: JWT assinado pela API (vazio se API_JWT_SECRET não existir lá)
          return { ...data.user, accessToken: data.accessToken ?? null }
        } catch (error) {
          console.error('Erro no authorize:', error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.agencyId = user.agencyId // this IS the tenantId
        token.planId = user.planId
        token.features = user.features
        token.realtorProfileId = user.realtorProfileId
        token.accessToken = user.accessToken ?? null
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: (token.id as string) ?? '',
          role: (token.role as string | undefined) ?? null,
          agencyId: (token.agencyId as string) ?? null,
          planId: (token.planId as string) ?? null,
          features: (token.features as string[]) ?? [],
          realtorProfileId: (token.realtorProfileId as string) ?? null,
        }
        // O admin chama a API direto do navegador, então o token precisa
        // chegar ao cliente (enviado como Authorization pelo services/api).
        session.accessToken = (token.accessToken as string | undefined) ?? null
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
