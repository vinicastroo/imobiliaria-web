/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
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
      user && (token.user = user)
      return token
    },
    async session({ session, token }) {
      session = token.user as any
      return session
    },
  },
})
