"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlanFeature } from '@/hooks/use-plan-feature'

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
}

export function FeatureGate({ feature, children }: FeatureGateProps) {
  const hasAccess = usePlanFeature(feature)
  const router = useRouter()

  useEffect(() => {
    if (!hasAccess) {
      router.replace('/admin/upgrade')
    }
  }, [hasAccess, router])

  if (!hasAccess) return null

  return <>{children}</>
}
