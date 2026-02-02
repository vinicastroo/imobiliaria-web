import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// A URL da sua API Fastify
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

const authOptions: NextAuthOptions = {
  // Configuração de Sessão usando JWT (obrigatório para Credentials com API externa)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },

  // Página de login customizada
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
      // AQUI CONECTAMOS COM O FASTIFY
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // 1. Faz o POST para sua rota /sessions no Fastify
          const res = await fetch(`${API_URL}/sessions`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          })

          const data = await res.json()

          // 2. Se a API retornar erro (400, 401, etc)
          if (!res.ok) {
            // Você pode lançar erro para mostrar toast no front
            throw new Error(data.message || "Credenciais inválidas")
          }

          // 3. Se deu certo, retorna o usuário
          // O objeto 'data.user' deve conter: { id, name, email, role, agencyId }
          return data.user

        } catch (error) {
          console.error("Erro no authorize:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    // PASSO 1: Salvar dados do backend no Token JWT
    // Esse callback roda sempre que um token é criado ou atualizado
    async jwt({ token, user }) {
      if (user) {
        // 'user' só existe na primeira vez (login).
        // Aqui persistimos os dados customizados dentro do token criptografado
        token.id = user.id
        token.role = user.role
        token.agencyId = user.agencyId
      }
      return token
    },

    // PASSO 2: Expor dados do Token para o Frontend (useSession)
    // Esse callback roda sempre que o front chama getSession() ou useSession()
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user, // Mantém name, email e image padrões
          id: token.id as string,
          role: token.role as string, // Ex: OWNER, REALTOR
          agencyId: token.agencyId as string, // O ID da Imobiliária
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Defina isso no .env (openssl rand -base64 32)
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }