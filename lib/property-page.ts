import { notFound, permanentRedirect } from 'next/navigation'
import { getProperty } from '@/app/api/get-property'

export async function getPropertyForPage(slug: string) {
  const property = await getProperty(slug)
  if (!property || property.visible === false) notFound()
  if (property.slug !== slug) permanentRedirect(`/imoveis/${property.slug}`)
  return property
}
