import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    agencyId: string | null
    planId: string | null
    features: string[]
  }

  interface Session {
    user: {
      id: string
      role: string
      agencyId: string | null
      planId: string | null
      features: string[]
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    agencyId: string | null
    planId: string | null
    features: string[]
  }
}
