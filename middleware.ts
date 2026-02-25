import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const PLATFORM_DOMAIN  = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'codelabz.com.br'
const SUPER_ADMIN_HOST = `admin.${PLATFORM_DOMAIN}`
const API_URL          = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

// Fallback agency used in local development (existing NEXT_PUBLIC_AGENCY_ID)
const DEV_AGENCY_ID = process.env.NEXT_PUBLIC_AGENCY_ID

// Map: hostname → internal site prefix
// Add new custom tenants here — generic-site is the fallback
const CUSTOM_SITE_PREFIXES: Record<string, string> = {
  'aurosimobiliaria.com.br': '/auros-site',
  'imoveisgilli.com.br':     '/gilli-site',
}

const ALL_SITE_PREFIXES = [...Object.values(CUSTOM_SITE_PREFIXES), '/generic-site']

interface TenantContext {
  id:   string
  slug: string
  name: string
}

async function fetchTenant(hostname: string): Promise<TenantContext | null> {
  try {
    const url = `${API_URL}/resolve-tenant?hostname=${encodeURIComponent(hostname)}`
    const res = await fetch(url)
    if (!res.ok) return null
    return res.json() as Promise<TenantContext>
  } catch {
    return null
  }
}

function isLocalDev(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname)
  )
}

function isPublicSitePage(pathname: string): boolean {
  return (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/api') &&
    pathname !== '/sitemap.xml' &&
    pathname !== '/robots.txt' &&
    !ALL_SITE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  )
}

function getSitePrefix(hostname: string): string {
  return CUSTOM_SITE_PREFIXES[hostname] ?? '/generic-site'
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth rules applied after tenant is resolved
// ─────────────────────────────────────────────────────────────────────────────
async function applyAuthRules(
  req: NextRequest,
  response: NextResponse,
  tenantId: string | null,
): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  const token  = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuth = !!token

  const isSuperAdmin = token?.role === 'SUPER_ADMIN'

  // /login → redirect already-authenticated users to admin dashboard
  if (pathname === '/login' && isAuth) {
    // SUPER_ADMIN always goes to the platform panel
    if (isSuperAdmin) {
      return NextResponse.redirect(new URL('/admin/agencies', req.url))
    }
    // Tenant users: only redirect if the token belongs to the current tenant.
    // If a user from tenant A lands on tenant B's login page while still logged
    // in to A, we let them see the login form so they can sign in to the right account.
    if (!tenantId || token.agencyId === tenantId) {
      return NextResponse.redirect(new URL('/admin/imoveis', req.url))
    }
    return response
  }

  // /admin/* → must be authenticated AND belong to this tenant
  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', encodeURI(req.url))
      return NextResponse.redirect(loginUrl)
    }

    // SUPER_ADMIN (agencyId=null) bypasses tenant matching — they can access
    // any admin route (used for local dev and future impersonation support).
    if (!isSuperAdmin && tenantId && token.agencyId !== tenantId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // SUPER_ADMIN accessing the tenant dashboard index → redirect to their panel
    if (isSuperAdmin && pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/agencies', req.url))
    }
  }

  return response
}

// ─────────────────────────────────────────────────────────────────────────────
// Main middleware
// ─────────────────────────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const hostname = (req.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const { pathname } = req.nextUrl

  // ── 1. Always skip static assets & internals ────────────────────────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/monitoring') ||
    pathname === '/manifest.webmanifest' ||
    /\.(ico|png|jpg|jpeg|svg|webp|avif|gif|css|js|map|woff2?|ttf|eot)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // ── 2. Super admin panel — require SUPER_ADMIN role ─────────────────────
  if (hostname === SUPER_ADMIN_HOST) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (pathname === '/login') {
      // Redirect already-authenticated super admins to their dashboard
      if (token?.role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/agencies', req.url))
      }
      return NextResponse.next()
    }

    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  }

  // ── 3. Local development — skip resolution, inject env-based tenant ─────
  if (isLocalDev(hostname)) {
    const domainParam = req.nextUrl.searchParams.get('domain')
    const domainCookie = req.cookies.get('__dev_domain__')?.value
    const effectiveDomain = domainParam ?? domainCookie ?? process.env.NEXT_PUBLIC_DEV_DOMAIN ?? null

    // If a domain is simulated (?domain= or cookie), resolve it via the backend
    // so tenant isolation works correctly for non-default tenants.
    let tenantId = DEV_AGENCY_ID ?? null
    if (effectiveDomain) {
      const resolved = await fetchTenant(effectiveDomain)
      if (resolved) tenantId = resolved.id
    }

    const requestHeaders = new Headers(req.headers)
    if (tenantId) requestHeaders.set('x-tenant-id', tenantId)

    let base: NextResponse
    if (isPublicSitePage(pathname)) {
      const prefix = getSitePrefix(effectiveDomain ?? '')
      const rewriteUrl = new URL(prefix + (pathname === '/' ? '' : pathname), req.url)
      base = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
    } else {
      base = NextResponse.next({ request: { headers: requestHeaders } })
    }

    const response = await applyAuthRules(req, base, tenantId)
    if (tenantId) {
      response.cookies.set('__tenant__', tenantId, { path: '/', httpOnly: false, sameSite: 'lax' })
    }
    if (domainParam) {
      response.cookies.set('__dev_domain__', domainParam, { path: '/', httpOnly: false, sameSite: 'lax' })
    }
    return response
  }

  // ── 4. Resolve tenant from hostname via backend ─────────────────────────
  const tenant = await fetchTenant(hostname)

  if (!tenant) {
    // Unknown hostname → send to platform landing page
    return NextResponse.redirect(`https://${PLATFORM_DOMAIN}`)
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-tenant-id',   tenant.id)
  requestHeaders.set('x-tenant-slug', tenant.slug)

  if (isPublicSitePage(pathname)) {
    const prefix = getSitePrefix(hostname)
    const rewriteUrl = new URL(prefix + (pathname === '/' ? '' : pathname), req.url)
    const response = await applyAuthRules(
      req,
      NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } }),
      tenant.id,
    )
    response.cookies.set('__tenant__', tenant.id, { path: '/', httpOnly: false, sameSite: 'lax' })
    return response
  }

  const response = await applyAuthRules(
    req,
    NextResponse.next({ request: { headers: requestHeaders } }),
    tenant.id,
  )
  response.cookies.set('__tenant__', tenant.id, { path: '/', httpOnly: false, sameSite: 'lax' })
  return response
}

export const config = {
  // Run on all paths except Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
