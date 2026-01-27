export interface Realtor {
  id: string
  name: string
  creci: string
  phone: string
  avatar?: string // Agora é string (URL) vinda do banco, não StaticImageData
}