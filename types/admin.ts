export interface AdminPlan {
  id: string
  name: string
  defaultPrice: string
  maxUsers: number
  maxRealtors: number
  maxProperties: number
  features: string[]
  active: boolean
  createdAt: string
  updatedAt: string
  _count: { subscriptions: number }
}

export interface AdminAgencyOwner {
  id: string
  name: string
  email: string
}

export interface AdminAgency {
  id: string
  name: string
  slug: string | null
  customDomain: string | null
  cnpj: string | null
  active: boolean
  createdAt: string
  owner: AdminAgencyOwner | null
  subscription: {
    id: string
    status: 'PENDING' | 'ACTIVE' | 'CANCELED' | 'EXPIRED'
    planName: string
    planId: string
    effectivePrice: string
    snapshotPrice: string
    customPrice: string | null
    manualBilling: boolean
    startDate: string
  } | null
  usage: {
    users: number
    realtors: number
    properties: number
  }
}

export interface AgencyCreateResponse {
  success: boolean
  paymentLink: string | null
  agencyId: string
}
