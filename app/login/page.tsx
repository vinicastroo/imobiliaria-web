import { headers } from 'next/headers'
import { getTenantVisualConfig } from '@/lib/visual-config'
import { LoginForm } from './_components/login-form'

export default async function LoginPage() {
  const [visualConfig, headersList] = await Promise.all([
    getTenantVisualConfig(),
    headers(),
  ])

  const agencyName = headersList.get('x-tenant-slug') ?? null

  return (
    <LoginForm
      logoUrl={visualConfig.logoUrl}
      agencyName={agencyName}
    />
  )
}
