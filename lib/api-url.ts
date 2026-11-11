// NEXT_PUBLIC_API_URL em produção termina com "/". Concatenado com "/rota" vira
// "//rota", que a Vercel redireciona (308). No navegador, redirect em preflight
// CORS é bloqueado: foi o que zerou o registro de visualizações desde 25/09.
export function apiUrl(fallback: string): string {
  return (process.env.NEXT_PUBLIC_API_URL || fallback).replace(/\/+$/, '')
}
