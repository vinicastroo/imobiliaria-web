export interface TypeProperty {
  id: string
  description: string
}

export interface Realtor {
  id: string
  name: string
  creci: string
  avatar?: string
}

export interface Enterprise {
  id: string
  name: string
}

export interface PropertyFile {
  id: string
  path: string
  fileName: string
  thumb?: boolean
}

export interface PropertyData {
  id: string
  name: string
  slug: string
  code: string | number
  summary: string
  description: string
  value: string
  bedrooms: string
  bathrooms: string
  parkingSpots: string
  suites: string
  totalArea: string
  privateArea: string
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  numberAddress: string
  longitude: string
  latitude: string
  type_property: {
    id: string
    description: string
  }
  files: PropertyFile[]
  realtors: Realtor[]
  enterprise?: {
    id: string
    name: string
  }
}

export type ImageItem =
  | { type: 'existing'; id: string; path: string; fileName: string; thumb?: boolean }
  | { type: 'new'; id: string; file: File; preview: string }
