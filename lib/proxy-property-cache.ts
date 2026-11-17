import { getCache } from '@vercel/functions'

// fetch() com `next.revalidate` não tem efeito dentro do proxy.ts, então cada
// visita a uma página de imóvel consultava a API (e acordava o banco) só para
// decidir entre 200 e 404. Este cache (Vercel Runtime Cache) guarda a resposta
// e é limpo por `expirePropertyProxyCache()` sempre que o admin altera imóveis.
const TAG = 'properties'

// Imóvel existente: vale até alguém alterar imóveis no admin (24h como garantia).
export const PROPERTY_FOUND_TTL = 60 * 60 * 24
// Inexistente/oculto: curto, para um erro de invalidação não esconder um imóvel novo por muito tempo.
export const PROPERTY_MISSING_TTL = 60 * 10

// Falha de cache nunca derruba a página: sem cache o proxy só volta a consultar a API.
export async function readPropertyProxyCache<T>(key: string): Promise<T | null> {
  try {
    return ((await getCache().get(key)) as T | null) ?? null
  } catch {
    return null
  }
}

export async function writePropertyProxyCache(
  key: string,
  value: unknown,
  ttl: number,
): Promise<void> {
  try {
    await getCache().set(key, value, { ttl, tags: [TAG], name: key.split(':')[0] })
  } catch {
    // segue sem cache
  }
}

export async function expirePropertyProxyCache(): Promise<void> {
  try {
    await getCache().expireTag(TAG)
  } catch {
    // as entradas expiram sozinhas pelo TTL
  }
}
