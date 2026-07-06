export const STAGE_COLORS = {
  blue: { label: 'Azul', header: 'text-blue-700', dot: 'bg-blue-400', hoverBg: 'bg-blue-50', hoverRing: 'ring-blue-300', pill: 'bg-blue-50 text-blue-700' },
  green: { label: 'Verde', header: 'text-green-700', dot: 'bg-green-400', hoverBg: 'bg-green-50', hoverRing: 'ring-green-300', pill: 'bg-green-50 text-green-700' },
  amber: { label: 'Âmbar', header: 'text-amber-700', dot: 'bg-amber-400', hoverBg: 'bg-amber-50', hoverRing: 'ring-amber-300', pill: 'bg-amber-50 text-amber-700' },
  red: { label: 'Vermelho', header: 'text-red-700', dot: 'bg-red-400', hoverBg: 'bg-red-50', hoverRing: 'ring-red-300', pill: 'bg-red-50 text-red-700' },
  violet: { label: 'Roxo', header: 'text-violet-700', dot: 'bg-violet-400', hoverBg: 'bg-violet-50', hoverRing: 'ring-violet-300', pill: 'bg-violet-50 text-violet-700' },
  pink: { label: 'Rosa', header: 'text-pink-700', dot: 'bg-pink-400', hoverBg: 'bg-pink-50', hoverRing: 'ring-pink-300', pill: 'bg-pink-50 text-pink-700' },
  orange: { label: 'Laranja', header: 'text-orange-700', dot: 'bg-orange-400', hoverBg: 'bg-orange-50', hoverRing: 'ring-orange-300', pill: 'bg-orange-50 text-orange-700' },
  cyan: { label: 'Ciano', header: 'text-cyan-700', dot: 'bg-cyan-400', hoverBg: 'bg-cyan-50', hoverRing: 'ring-cyan-300', pill: 'bg-cyan-50 text-cyan-700' },
  teal: { label: 'Turquesa', header: 'text-teal-700', dot: 'bg-teal-400', hoverBg: 'bg-teal-50', hoverRing: 'ring-teal-300', pill: 'bg-teal-50 text-teal-700' },
  gray: { label: 'Cinza', header: 'text-gray-700', dot: 'bg-gray-400', hoverBg: 'bg-gray-50', hoverRing: 'ring-gray-300', pill: 'bg-gray-100 text-gray-600' },
} as const

export type StageColorKey = keyof typeof STAGE_COLORS

export function getStageColor(color: string | null | undefined) {
  return STAGE_COLORS[(color ?? 'gray') as StageColorKey] ?? STAGE_COLORS.gray
}

export interface ClientStage {
  id: string
  name: string
  color: string
  order: number
  systemKey: 'INTERESTED' | 'VISITING' | 'ON_HOLD' | null
  _count?: { clients: number }
}
