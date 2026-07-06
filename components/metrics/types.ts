export type Period = '7d' | '30d' | '90d'

export interface TopProperty {
  id: string
  name: string
  slug: string
  views: number
}

export interface SourceBreakdown {
  source: 'DIRECT' | 'GOOGLE' | 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'OTHER'
  count: number
}

export interface DailyViews {
  date: string
  views: number
}

export interface MetricsResponse {
  totalViews: number
  topProperties: TopProperty[]
  sourceBreakdown: SourceBreakdown[]
  dailyViews: DailyViews[]
}
