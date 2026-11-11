import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    agencyId: string | null
    planId: string | null
    features: string[]
    realtorProfileId: string | null
    accessToken?: string | null
  }

  interface Session {
    accessToken: string | null
    user: {
      id: string
      role: string | null
      agencyId: string | null
      planId: string | null
      features: string[]
      realtorProfileId: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    agencyId: string | null
    planId: string | null
    features: string[]
    realtorProfileId: string | null
    accessToken?: string | null
  }
}
