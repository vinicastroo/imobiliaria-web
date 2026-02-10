import { useCallback, useEffect, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { toast } from 'sonner'
import brasilAPi from '@/services/brasilAPi'

interface CepResult {
  city: string
  neighborhood: string
  state: string
  street: string
  latitude?: string
  longitude?: string
}

export function useCepLookup(
  cep: string,
  onResult: (data: CepResult) => void,
) {
  const lastCepRef = useRef<string>('')

  const debouncedLookup = useDebouncedCallback((value: string) => {
    if (value === lastCepRef.current) return

    lastCepRef.current = value

    brasilAPi
      .get(`/api/cep/v2/${value}`)
      .then((res) => {
        const result: CepResult = {
          city: res.data.city,
          neighborhood: res.data.neighborhood,
          state: res.data.state,
          street: res.data.street,
        }
        if (res.data.location?.coordinates) {
          result.latitude = res.data.location.coordinates.latitude
          result.longitude = res.data.location.coordinates.longitude
        }
        onResult(result)
      })
      .catch(() => toast.error('Erro ao buscar CEP'))
  }, 500)

  useEffect(() => {
    const cleaned = cep?.replace(/\D/g, '') ?? ''
    if (cleaned.length >= 8) {
      debouncedLookup(cleaned)
    }
  }, [cep, debouncedLookup])

  const setInitialCep = useCallback((value: string) => {
    lastCepRef.current = value.replace(/\D/g, '')
  }, [])

  return { setInitialCep }
}
