"use client"

import { cn } from '@/lib/utils'
import type { Period } from './types'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
]

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-0.5 rounded-full bg-gray-200/60 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
            value === opt.value
              ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(16,24,40,0.12)]'
              : 'text-gray-500 hover:text-gray-800',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
