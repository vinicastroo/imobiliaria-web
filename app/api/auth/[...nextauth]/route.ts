/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// 1. Atribua a configuração a uma variável 'handler'
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize(credentials) {
        if (
          credentials?.email !== process.env.AUROS_EMAIL ||
          credentials?.password !== process.env.AUROS_PASSWORD
        ) {
          throw new Error('invalid credentials')
        }

        return { id: '1', name: 'Auros', email: 'auros@admin.com' }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      // Ajuste para não perder a tipagem se possível, mas mantendo seu 'any'
      if (token?.user) {
        // Cuidado: aqui você está substituindo a sessão inteira pelo objeto user?
        // O padrão geralmente é: session.user = token.user
        session = token.user as any
      }
      return session
    },
  },
  // Adicione isso se estiver usando em desenvolvimento para ver logs melhores
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET, // Certifique-se de ter essa var no .env
})

// 2. Exporte GET e POST usando o handler
export { handler as GET, handler as POST }