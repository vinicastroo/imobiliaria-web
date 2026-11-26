import { z } from 'zod'

export const REALTORS_RANGES = [
  { value: '1', label: 'Só eu' },
  { value: '2-5', label: '2 a 5 corretores' },
  { value: '6-15', label: '6 a 15 corretores' },
  { value: '16-30', label: '16 a 30 corretores' },
  { value: '30+', label: 'Mais de 30 corretores' },
] as const

export const demoSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  agencyName: z.string().trim().min(2, 'Informe o nome da imobiliária'),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, '')
      return digits.length >= 10 && digits.length <= 13
    }, 'Informe um WhatsApp com DDD'),
  email: z.string().trim().email('E-mail inválido').or(z.literal('')),
  realtorsRange: z.enum(['', '1', '2-5', '6-15', '16-30', '30+']),
  message: z.string().trim().max(1000, 'Mensagem muito longa (até 1000 caracteres)'),
  /** Honeypot — fica escondido; robôs preenchem. */
  website: z.string(),
})

export type DemoFormData = z.infer<typeof demoSchema>
