import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${API_URL}/sessions`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          })

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.message || "Credenciais inválidas")
          }

          return data.user
        } catch (error) {
          console.error("Erro no authorize:", error)
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
        token.agencyId = user.agencyId
        token.planId = user.planId
        token.features = user.features
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          agencyId: (token.agencyId as string) ?? null,
          planId: (token.planId as string) ?? null,
          features: (token.features as string[]) ?? [],
        }
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
