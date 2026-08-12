import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getTenantVisualConfig } from '@/lib/visual-config'
import { getTenantIdentity } from '@/lib/tenant-info'
import { buildOrganizationJsonLd } from '@/lib/json-ld'
import { ModernTemplate } from '@/components/site-templates/modern-template'
import { ClassicTemplate } from '@/components/site-templates/classic-template'
import { MinimalTemplate } from '@/components/site-templates/minimal-template'
import type { LayoutType } from '@/lib/visual-config'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':')[0] ?? ''
  const { name } = await getTenantIdentity()
  const title = `${name} - Imóveis à Venda e Aluguel`
  const description = `Encontre os melhores imóveis à venda e para alugar com a ${name}.`

  return {
    title,
    description,
    alternates: { canonical: `https://${host}` },
    openGraph:  { title, description, url: `https://${host}`, type: 'website' },
  }
}

const TEMPLATES: Record<LayoutType, React.ComponentType<{ agencyId: string }>> = {
  MODERN:  ModernTemplate,
  CLASSIC: ClassicTemplate,
  MINIMAL: MinimalTemplate,
}

export default async function TenantHomePage() {
  const headerStore = await headers()
  const agencyId    = headerStore.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
  const layoutType  = (headerStore.get('x-tenant-layout') ?? 'MODERN') as LayoutType
  const host        = headerStore.get('host')?.split(':')[0] ?? ''

  const [{ name }, { logoUrl }] = await Promise.all([
    getTenantIdentity(),
    getTenantVisualConfig(),
  ])

  // Validate the header value — fall back to MODERN if tampered
  const SelectedTemplate = TEMPLATES[layoutType] ?? ModernTemplate
  const organizationJsonLd = buildOrganizationJsonLd(name, `https://${host}`, logoUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <SelectedTemplate agencyId={agencyId} />
    </>
  )
}
