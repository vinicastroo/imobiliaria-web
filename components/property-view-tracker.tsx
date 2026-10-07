'use client'

import { useEffect } from 'react'
import { trackView } from '@/lib/track-view'

export function PropertyViewTracker({
  propertyId,
  slug,
  agencyId,
}: {
  propertyId: string
  slug: string
  agencyId: string
}) {
  useEffect(() => {
    const record = () => {
      void trackView(propertyId, slug, agencyId)
    }
    record()
    document.addEventListener('visibilitychange', record)
    return () => document.removeEventListener('visibilitychange', record)
  }, [propertyId, slug, agencyId])

  return null
}
