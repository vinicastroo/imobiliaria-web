import { z } from 'zod'

export const propertySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  code: z.union([z.string(), z.number()]).optional(),
  value: z.string().min(1, 'Valor é obrigatório'),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  type_id: z.string().min(1, 'Tipo do imóvel é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  bedrooms: z.string(),
  bathrooms: z.string(),
  suites: z.string(),
  parkingSpots: z.string(),
  totalArea: z.string(),
  privateArea: z.string(),
  cep: z.string().min(8, 'CEP inválido'),
  state: z.string().min(1, 'Estado é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().optional(),
  latitude: z.string().min(1, 'Latitude obrigatória'),
  longitude: z.string().min(1, 'Longitude obrigatória'),
  realtorIds: z.array(z.string()).optional(),
  enterpriseId: z.string().optional(),
})

export type PropertyFormData = z.infer<typeof propertySchema>
