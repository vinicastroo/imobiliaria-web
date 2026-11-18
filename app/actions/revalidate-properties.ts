'use server'

import { revalidateTag } from 'next/cache'
import { expirePropertyProxyCache } from '@/lib/proxy-property-cache'

export async function revalidateProperties() {
  revalidateTag('properties', 'default')
  // O proxy guarda se cada imóvel existe num cache à parte, que o revalidateTag não alcança
  await expirePropertyProxyCache()
}
