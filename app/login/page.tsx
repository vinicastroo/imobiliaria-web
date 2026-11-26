import { getTenantVisualConfig } from '@/lib/visual-config'
import { getTenantIdentity, FALLBACK_NAME } from '@/lib/tenant-info'
import { LoginForm } from './_components/login-form'

export default async function LoginPage() {
  const [visualConfig, identity] = await Promise.all([getTenantVisualConfig(), getTenantIdentity()])

  const agencyName = identity.name === FALLBACK_NAME ? null : identity.name

  // Ícone quadrado da imobiliária (cabe no selo ao lado do nome); cai para o logo.
  return (
    <LoginForm logoUrl={visualConfig.iconUrl ?? visualConfig.logoUrl} agencyName={agencyName} />
  )
}
