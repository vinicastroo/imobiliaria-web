import Image from 'next/image'
import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import logo from '@/assets/logo-auros-minimalist.svg'

export function MenubarHome() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ background: '#17375F' }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          px: 2,
          a: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Link href="/">
          <Image src={logo} alt="logo" width={80} height={80} />
        </Link>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            a: { color: 'white', textDecoration: 'none' },
            'a:hover': { opacity: 0.7 },
          }}
        >
          <Link href="/imoveis">
            <Typography variant="body2">Imóveis</Typography>
          </Link>
          <Link href="/contato">
            <Typography variant="body2">Entre em contato</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
