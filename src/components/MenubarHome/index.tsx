import Image from 'next/image'
import Link from 'next/link'
import { Box, Typography, useMediaQuery } from '@mui/material'
import logo from '@/assets/logo-auros-minimalist.svg'
import { FacebookLogo, InstagramLogo } from 'phosphor-react'

export function MenubarHome() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('sm'),
  )

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
          p: 2,
          a: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Link href="/" shallow>
          <Image
            src={logo}
            alt="logo"
            width={isSmallScreen ? 80 : 120}
            height={isSmallScreen ? 80 : 120}
          />
        </Link>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            a: { color: 'white', textDecoration: 'none' },
            'a:hover': { opacity: 0.7 },
          }}
        >
          <Link href="https://www.instagram.com/auroscorretoraimobiliaria/" aria-label="Link para o Instagram">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InstagramLogo size={20} weight="fill" />
            </Box>
          </Link>

          <Link href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR" aria-label="Link para o Facebook">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FacebookLogo size={20} weight="fill" />
            </Box>
          </Link>
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
