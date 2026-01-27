import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Pega o token do NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith('/login')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

  // 1. Se estiver na pagina de LOGIN e já estiver LOGADO -> Manda pro Admin
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/admin/imoveis', req.url))
  }

  // 2. Se estiver tentando acessar ADMIN e NÃO estiver logado -> Manda pro Login
  if (isAdminPage && !isAuth) {
    // Opcional: Adicionar ?callbackUrl= para voltar pra pagina que estava
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', encodeURI(req.url))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}