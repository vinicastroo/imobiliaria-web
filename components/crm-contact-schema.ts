import { z } from 'zod'

export const CAPTURE_SOURCE_LABELS = {
  TRAFEGO: 'Tráfego Pago',
  SITE: 'Site',
  INSTA: 'Instagram',
  INDICACAO: 'Indicação',
  VISITA: 'Visita Espontânea',
} as const

export const PAYMENT_METHOD_LABELS = {
  AVISTA: 'À Vista',
  FINANCIAMENTO: 'Financiamento',
  PERMUTA: 'Com Permuta',
} as const

export const crmContactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  contactDate: z.string().optional(),
  captureSource: z.enum(['TRAFEGO', 'SITE', 'INSTA', 'INDICACAO', 'VISITA']).optional(),
  propertiesId: z.string().min(1).nullable().optional(),
  realtorId: z.string().min(1).nullable().optional(),
  desiredPropertyType: z.string().optional(),
  desiredNeighborhood: z.string().optional(),
  priceRangeMin: z.string().optional(),
  priceRangeMax: z.string().optional(),
  paymentMethod: z.enum(['AVISTA', 'FINANCIAMENTO', 'PERMUTA']).optional(),
  description: z.string().optional(),
})

export type CrmContactFormData = z.infer<typeof crmContactSchema>
