import { Box } from '@mui/material'
import Link from 'next/link'

export default function Custom404() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        textAlign: 'center',
        p: 2,
        color: 'white',
        background: '#17375F',
        a: {
          textDecoration: 'underline',
          color: 'white',
        },
      }}
    >
      <h1>404 - Página não encontrada</h1>
      <Link href="/">Ir para a página principal</Link>
    </Box>
  )
}
