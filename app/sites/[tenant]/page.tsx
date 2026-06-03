import { headers } from 'next/headers'
import { getTenantVisualConfig } from '@/lib/visual-config'
import { ModernTemplate } from '@/components/site-templates/modern-template'
import { ClassicTemplate } from '@/components/site-templates/classic-template'
import { MinimalTemplate } from '@/components/site-templates/minimal-template'
import type { LayoutType } from '@/lib/visual-config'

const TEMPLATES: Record<LayoutType, React.ComponentType<{ agencyId: string }>> = {
  MODERN:  ModernTemplate,
  CLASSIC: ClassicTemplate,
  MINIMAL: MinimalTemplate,
}

export default async function TenantHomePage() {
  const headerStore = await headers()
  const agencyId    = headerStore.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
  const layoutType  = (headerStore.get('x-tenant-layout') ?? 'MODERN') as LayoutType

  // Validate the header value — fall back to MODERN if tampered
  const SelectedTemplate = TEMPLATES[layoutType] ?? ModernTemplate

  return <SelectedTemplate agencyId={agencyId} />
}
