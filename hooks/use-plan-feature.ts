import { useSession } from 'next-auth/react'

export function usePlanFeature(feature: string): boolean {
  const { data: session } = useSession()

  if (!session?.user?.planId) {
    return true
  }

  return session.user.features.includes(feature)
}
