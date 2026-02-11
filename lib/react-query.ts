import { QueryClient } from '@tanstack/react-query'

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados ficam "frescos" por 2 minutos (não refaz fetch ao remontar componente)
      staleTime: 2 * 60 * 1000,
      // Dados ficam em memória por 10 minutos após o componente desmontar
      gcTime: 10 * 60 * 1000,
      // Não refaz fetch ao focar a aba (evita requests desnecessários)
      refetchOnWindowFocus: false,
      // Retry apenas 1x em caso de erro
      retry: 1,
    },
  },
})
