# auros-imob-web

Frontend da plataforma SaaS multi-tenant para imobiliárias. Um único Next.js serve o painel admin, os sites white-label de cada imobiliária e o painel super admin.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Auth**: NextAuth v4 (strategy JWT)
- **UI**: Shadcn/ui + Tailwind CSS v4 + Radix UI
- **Data fetching**: TanStack Query v5
- **Formulários**: React Hook Form + Zod
- **Editor rich text**: Tiptap
- **Drag & drop**: @dnd-kit
- **Upload**: react-dropzone + react-easy-crop
- **Ícones**: lucide-react e @phosphor-icons/react (SSR: `/dist/ssr`)
- **Toast**: sonner

## Comandos

```bash
npm run dev    # next dev (porta 3000)
npm run build  # next build
npm run lint   # eslint
```

## Estrutura de rotas

```
app/
  (aurosimobiliaria.com.br)/auros-site/   # Site público Auros
  (imoveisgilli.com.br)/gilli-site/       # Site público Gilli
  (generic-tenant)/generic-site/          # Site genérico (fallback)
  admin/                                  # Painel admin do tenant
    imoveis/
    corretores/
    clientes/
    configuracoes/
    empreendimentos/
    infraestruturas/
    tipo-imovel/
    usuarios/
    agencies/    # Super admin
    plans/       # Super admin
  login/
  api/           # Route handlers Next.js (NextAuth)
components/
  ui/            # Shadcn components
  property-form/ # Formulário de imóvel (form, schema, uploader, crop)
  menu.tsx       # Sidebar do admin
  ...
middleware.ts    # Multi-tenancy + auth
```

## Multi-tenancy

O middleware (`middleware.ts`) resolve o tenant pelo hostname em cada requisição:

1. **Hostname conhecido** (`aurosimobiliaria.com.br`, `imoveisgilli.com.br`) → rewrite para o site específico
2. **Hostname desconhecido** → resolve via `GET /resolve-tenant?hostname=` na API
3. **Super admin** (`admin.codelabz.com.br`) → painel de plataforma, exige role `SUPER_ADMIN`
4. **Local dev** → usa `NEXT_PUBLIC_AGENCY_ID` ou cookie `__dev_domain__`

O tenant ID é propagado via:
- Header `x-tenant-id` (lido em Server Components com `headers()`)
- Cookie `__tenant__` (lido em Client Components)

Adicionar novo tenant customizado em `middleware.ts`:
```ts
const CUSTOM_SITE_PREFIXES: Record<string, string> = {
  'novo-tenant.com.br': '/novo-site',
}
```

## Auth (NextAuth)

- Strategy: JWT
- Roles: `OWNER`, `MANAGER`, `REALTOR`, `SUPER_ADMIN`
- `isSuperAdmin`: `session.user.role === 'SUPER_ADMIN'`
- `isSuperAdminPanel`: `session.user.agencyId === null`
- Regras no middleware: tenant users só acessam o admin do próprio tenant
- Super admin acessa qualquer `/admin/*`, mas ao entrar em `/admin` é redirecionado para `/admin/agencies`

## Chamadas à API

- Base URL: `NEXT_PUBLIC_API_URL`
- Header obrigatório em todas as chamadas do tenant: `x-agency-id`
- Em Server Components: ler `agencyId` via `headers().get('x-tenant-id')`
- Em Client Components: ler via cookie `__tenant__` ou contexto de sessão

## Componentes principais

### `components/menu.tsx`
Sidebar do admin. Lógica:
- `isSuperAdmin` → sempre mostra rotas de plataforma (Agencies, Plans)
- `!isSuperAdminPanel` → mostra rotas do tenant (Imóveis, Corretores, etc.)

### `components/property-form/`
Formulário completo de imóvel:
- `property-schema.ts` — schema Zod (latitude/longitude opcionais)
- `use-property-form.ts` — lógica de submit, upload, toast de erro de validação
- `image-uploader.tsx` — drag & drop, crop, reordenação, limite de 15 fotos
- `use-image-crop-queue.ts` — fila de crop sequencial

### TanStack Query
- Usar `useQuery` para leitura, `useMutation` para escrita
- Sempre chamar `queryClient.invalidateQueries` após mutations bem-sucedidas

## Convenções

### Ícones
- Usar `lucide-react` para componentes client
- Usar `@phosphor-icons/react/dist/ssr` para componentes server (SSR-safe)

### Cores do tenant
- Cores primárias definidas como CSS vars: `--primary`, `--secondary`
- Usar classes Tailwind `text-primary`, `bg-primary`, `border-primary`
- **Nunca** hardcodar cores hex de tenant (ex: `#17375F`)

### Validação de formulários
- Schema Zod em arquivo separado `*-schema.ts`
- Usar segundo argumento do `handleSubmit` para mostrar toast no erro de validação:
```ts
form.handleSubmit(onValid, (errors) => {
  const first = Object.values(errors).find(Boolean) as { message?: string }
  toast.error(first?.message ?? 'Revise os campos do formulário')
})
```

### Componentes de lista
- Usar `memo()` em itens de lista que renderizam frequentemente
- Preferir Server Components para páginas de listagem

## Variáveis de ambiente

```
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_AGENCY_ID       # Fallback local dev
NEXT_PUBLIC_PLATFORM_DOMAIN # ex: codelabz.com.br
NEXT_PUBLIC_DEV_DOMAIN      # Simular tenant em dev local
```

## Checklist antes de commitar

1. Cores do tenant usam variáveis CSS (`text-primary`), não hex
2. Ícones SSR usam `@phosphor-icons/react/dist/ssr`
3. Chamadas à API incluem `x-agency-id` no header
4. Mutations invalidam as queries correspondentes
5. Novos sites adicionados em `CUSTOM_SITE_PREFIXES` no middleware
6. Erros de validação Zod mostram toast com mensagem do schema
