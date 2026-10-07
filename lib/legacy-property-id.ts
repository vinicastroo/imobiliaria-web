const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const CUID_RE = /^c[a-z0-9]{24}$/

// Old property URLs used the database ID instead of the slug.
export function isLegacyPropertyId(value: string) {
  return UUID_RE.test(value) || CUID_RE.test(value)
}
