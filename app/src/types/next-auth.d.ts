import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  // Estende a tipagem do objeto User retornado pelo authorize
  interface User {
    id: string
    role: string
    agencyId: string
  }

  // Estende a tipagem da Sessão usada no useSession()
  interface Session {
    user: {
      id: string
      role: string
      agencyId: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  // Estende a tipagem do Token JWT
  interface JWT {
    id: string
    role: string
    agencyId: string
  }
}