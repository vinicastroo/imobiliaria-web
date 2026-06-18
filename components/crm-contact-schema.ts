import { z } from 'zod'

export const crmContactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  status: z.enum(['INTERESTED', 'VISITING', 'ON_HOLD']),
  followUpMonths: z.union([z.literal(1), z.literal(3), z.literal(6)]).optional(),
  realtorId: z.string().min(1).nullable().optional(),
})

export type CrmContactFormData = z.infer<typeof crmContactSchema>
