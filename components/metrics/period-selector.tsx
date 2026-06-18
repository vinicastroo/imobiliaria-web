"use client"

import { Button } from '@/components/ui/button'
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
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(opt.value)}
          className={value === opt.value ? 'bg-white shadow-sm text-gray-900 hover:bg-white' : 'text-gray-500 hover:text-gray-700'}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
