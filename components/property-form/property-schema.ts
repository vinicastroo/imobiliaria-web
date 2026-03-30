import { z } from 'zod'

export const propertySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').max(80, 'Slug não pode ultrapassar 80 caracteres'),
  code: z.union([z.string(), z.number()]).optional(),
  value: z.string().optional(),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  type_id: z.string().min(1, 'Tipo do imóvel é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  bedrooms: z.string().refine((v) => !v || Number(v) >= 0, 'Não pode ser negativo'),
  bathrooms: z.string().refine((v) => !v || Number(v) >= 0, 'Não pode ser negativo'),
  suites: z.string().refine((v) => !v || Number(v) >= 0, 'Não pode ser negativo'),
  parkingSpots: z.string().refine((v) => !v || Number(v) >= 0, 'Não pode ser negativo'),
  totalArea: z.string().refine((v) => !v || Number(v) >= 0, 'Não pode ser negativo'),
  privateArea: z.string().refine((v) => !v || Number(v) >= 0, 'Não pode ser negativo'),
  cep: z.string().min(8, 'CEP inválido'),
  state: z.string().min(1, 'Estado é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  realtorIds: z.array(z.string()).optional(),
  enterpriseId: z.string().optional(),
  priceOnRequest: z.boolean().default(false),
  pricePrefix: z.boolean().default(false),
  highlighted: z.boolean().default(false),
  transactionType: z.enum(['VENDA', 'ALUGUEL']).default('VENDA'),
  applyWatermark: z.boolean().default(true),
  infrastructureIds: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  if (!data.priceOnRequest && (!data.value || data.value.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Valor é obrigatório',
      path: ['value'],
    })
  }
})

export type PropertyFormData = z.infer<typeof propertySchema>
