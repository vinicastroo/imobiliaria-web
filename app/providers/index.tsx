"use client"

import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { query } from 'lib/react-query' // Supondo que você exporte o queryClient daqui
import type { Session } from 'next-auth'

export function Providers({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={query}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}