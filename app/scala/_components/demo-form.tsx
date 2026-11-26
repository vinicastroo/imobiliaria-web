'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { apiUrl } from '@/lib/api-url'
import { cn } from '@/lib/utils'
import { demoSchema, REALTORS_RANGES, type DemoFormData } from './demo-schema'

type Status = 'idle' | 'submitting' | 'success'

const fieldClass =
  'h-11 w-full rounded-[10px] border border-[var(--scala-border)] bg-white px-3.5 text-[15px] text-[var(--scala-ink)] outline-none transition-colors placeholder:text-[#8a929d] hover:border-[#141a223d] focus-visible:border-[var(--scala-royal)] focus-visible:ring-3 focus-visible:ring-[var(--scala-royal-soft)] aria-invalid:border-red-500'

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function sourceFromUrl(): string {
  if (typeof window === 'undefined') return 'lp'
  const params = new URLSearchParams(window.location.search)
  return params.get('utm_source') ?? params.get('ref') ?? 'lp'
}

export function DemoForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      name: '',
      agencyName: '',
      phone: '',
      email: '',
      realtorsRange: '',
      message: '',
      website: '',
    },
  })

  const onValid = async (data: DemoFormData) => {
    setStatus('submitting')
    setSubmitError(null)
    try {
      const res = await fetch(`${apiUrl('http://localhost:3333')}/platform/demo-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          email: data.email || undefined,
          realtorsRange: data.realtorsRange || undefined,
          message: data.message || undefined,
          source: sourceFromUrl(),
        }),
      })

      if (res.status === 429) {
        setSubmitError('Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.')
        setStatus('idle')
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      setStatus('success')
    } catch {
      setSubmitError('Não foi possível enviar seu pedido. Verifique sua conexão e tente de novo.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex min-h-[520px] flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--scala-border)] bg-white p-8 text-center"
      >
        <CheckCircle2 className="size-12 text-[var(--scala-royal)]" strokeWidth={1.75} />
        <h3 className="text-2xl font-semibold tracking-tight text-[var(--scala-ink)]">
          Recebemos seu pedido
        </h3>
        <p className="max-w-sm text-[15px] leading-relaxed text-[var(--scala-muted)]">
          Vamos te chamar no WhatsApp em até 1 dia útil para combinar o melhor horário da
          demonstração.
        </p>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid, (errs) => {
        const first = Object.values(errs).find(Boolean) as { message?: string } | undefined
        toast.error(first?.message ?? 'Revise os campos do formulário')
      })}
      className="flex flex-col gap-5 rounded-2xl border border-[var(--scala-border)] bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Seu nome" error={errors.name?.message} htmlFor="demo-name">
          <input
            id="demo-name"
            autoComplete="name"
            placeholder="Nome e sobrenome"
            aria-invalid={!!errors.name}
            className={fieldClass}
            disabled={submitting}
            {...register('name')}
          />
        </Field>
        <Field label="Imobiliária" error={errors.agencyName?.message} htmlFor="demo-agency">
          <input
            id="demo-agency"
            autoComplete="organization"
            placeholder="Nome da imobiliária"
            aria-invalid={!!errors.agencyName}
            className={fieldClass}
            disabled={submitting}
            {...register('agencyName')}
          />
        </Field>
        <Field label="WhatsApp" error={errors.phone?.message} htmlFor="demo-phone">
          <input
            id="demo-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(47) 99999-9999"
            aria-invalid={!!errors.phone}
            className={fieldClass}
            disabled={submitting}
            {...register('phone', {
              onChange: (e) => setValue('phone', maskPhone(e.target.value)),
            })}
          />
        </Field>
        <Field label="E-mail" optional error={errors.email?.message} htmlFor="demo-email">
          <input
            id="demo-email"
            type="email"
            autoComplete="email"
            placeholder="voce@imobiliaria.com.br"
            aria-invalid={!!errors.email}
            className={fieldClass}
            disabled={submitting}
            {...register('email')}
          />
        </Field>
      </div>

      <Field label="Tamanho da equipe" optional htmlFor="demo-team">
        <select
          id="demo-team"
          className={cn(
            fieldClass,
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 stroke=%27%235d6673%27 stroke-width=%272%27%3E%3Cpath d=%27m4 6 4 4 4-4%27/%3E%3C/svg%3E")] appearance-none bg-[right_14px_center] bg-no-repeat pr-10',
          )}
          disabled={submitting}
          {...register('realtorsRange')}
        >
          <option value="">Selecione</option>
          {REALTORS_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="O que você quer ver na demonstração?"
        optional
        error={errors.message?.message}
        htmlFor="demo-message"
      >
        <textarea
          id="demo-message"
          rows={3}
          placeholder="Ex.: quero entender o CRM e como fica o site com o meu domínio"
          aria-invalid={!!errors.message}
          className={cn(fieldClass, 'h-auto resize-none py-3')}
          disabled={submitting}
          {...register('message')}
        />
      </Field>

      {/* Honeypot: invisível para pessoas e leitores de tela */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="demo-website">Site</label>
        <input id="demo-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submitError && (
        <p role="alert" className="rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--scala-royal)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--scala-royal-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--scala-royal)] disabled:cursor-not-allowed disabled:opacity-80"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando…
          </>
        ) : (
          'Agendar demonstração'
        )}
      </button>
      <p className="text-center text-xs text-[var(--scala-muted)]">
        Usamos seus dados só para falar com você sobre a demonstração.
      </p>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string
  htmlFor: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--scala-ink)]">
        {label}
        {optional && <span className="font-normal text-[var(--scala-muted)]"> (opcional)</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
