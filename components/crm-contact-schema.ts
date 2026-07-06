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

export const NOTIFY_IN_LABELS = {
  '1w': 'Em 1 semana',
  '1m': 'Em 1 mês',
  '3m': 'Em 3 meses',
  '6m': 'Em 6 meses',
  custom: 'Personalizado',
} as const

export type NotifyInPreset = keyof typeof NOTIFY_IN_LABELS

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
  priceRangeMax: z.string().optional(),
  paymentMethod: z.enum(['AVISTA', 'FINANCIAMENTO', 'PERMUTA']).optional(),
  description: z.string().optional(),
  notifyIn: z.enum(['1w', '1m', '3m', '6m', 'custom']).optional(),
  followUpDate: z.string().optional(),
}).refine(
  (data) => data.notifyIn !== 'custom' || !!data.followUpDate,
  { message: 'Informe a data da notificação', path: ['followUpDate'] }
)

export type CrmContactFormData = z.infer<typeof crmContactSchema>
