import api from '@/services/api'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import {
  EnvelopeOpen,
  FacebookLogo,
  InstagramLogo,
  MapPin,
  WhatsappLogo,
} from 'phosphor-react'
import { useCallback, useEffect, useState } from 'react'
import logoFull from '@/assets/logo-full.svg'
import Image from 'next/image'

interface CubProps {
  monthYear: string
  cubValue: string
  monthPercentage: string
  yearPercentage: string
  twelveMonthsPercentage: string
}

export default function Footer() {
  const [cubInformation, setCubinformation] = useState<CubProps>()

  const loadCubinformation = useCallback(async () => {
    const response = await api.get('/cub-information')

    if (response) {
      setCubinformation(response.data)
    }
  }, [])

  useEffect(() => {
    loadCubinformation()
  }, [loadCubinformation])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          background: '#17375F',
          minHeight: '324px',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            alignItems: 'flex-start',
            justifyContent: { xs: 'center', sm: 'center', md: 'space-between' },
            maxWidth: '1200px',
            width: '100%',
            margin: 'auto auto',
            gap: 4,
            p: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 2, sm: 2, md: 0 },
              width: '100%',
            }}
          >
            <Image src={logoFull} alt="logo" width={160} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              color: 'white',
              alignItems: { xs: 'center', sm: 'center', md: 'flex-start' },
              mb: { xs: 2, sm: 2 },
              width: '100%',
              a: {
                textDecoration: 'none',
                color: 'white',
              },
              'a:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{ borderBottom: '1px solid #fff', mb: 1 }}
            >
              Rio do sul
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={20} weight="fill" />
              <Typography variant="body2" flex={1}>
                R. XV de Novembro, 1751 - sala02, Laranjeiras, Rio do Sul - SC
              </Typography>
            </Box>

            <Link href="https://api.whatsapp.com/send?phone=5547999008090">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsappLogo size={20} weight="fill" />
                <Typography variant="body2">(47) 99900-8090</Typography>
              </Box>
            </Link>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              color: 'white',
              alignItems: { xs: 'center', sm: 'center', md: 'flex-start' },
              mb: { xs: 2, sm: 2 },
              width: '100%',
              a: {
                textDecoration: 'none',
                color: 'white',
              },
              'a:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography variant="body1" sx={{ borderBottom: '1px solid #fff' }}>
              Balneário Camboriú
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <MapPin size={20} weight="fill" />
              <Typography variant="body2" flex={1}>
                Rua 2000, 121,Edif La Belle Tour Resid., Centro - Balneário
                Camboriú / SC
              </Typography>
            </Box>

            <Link href="https://api.whatsapp.com/send?phone=5547988163739">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsappLogo size={20} weight="fill" />
                <Typography variant="body2">(47) 98816-3739</Typography>
              </Box>
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              color: 'white',
              width: '100%',
              alignItems: { xs: 'center', sm: 'center', md: 'flex-start' },
              justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
              mb: { xs: 2, sm: 2 },
              a: {
                textDecoration: 'none',
                color: 'white',
              },
              'a:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography variant="body1" sx={{ borderBottom: '1px solid #fff' }}>
              Contato
            </Typography>
            <Link href="https://www.instagram.com/auroscorretoraimobiliaria/">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InstagramLogo size={20} weight="fill" />
                <Typography variant="body2">
                  @auroscorretoraimobiliaria
                </Typography>
              </Box>
            </Link>

            <Link href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FacebookLogo size={20} weight="fill" />
                <Typography variant="body2">
                  @auroscorretoraimobiliaria
                </Typography>
              </Box>
            </Link>

            <Link href="mailto:aurosimobiliaria@gmail.com">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EnvelopeOpen size={20} weight="fill" />
                <Typography variant="body2">
                  aurosimobiliaria@gmail.com
                </Typography>
              </Box>
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              color: 'white',
              width: '100%',
              alignItems: { xs: 'center', sm: 'center', md: 'flex-start' },
              justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
              mb: { xs: 2, sm: 2 },
            }}
          >
            <Typography variant="body1" sx={{ borderBottom: '1px solid #fff' }}>
              Tabela do CUB SC
            </Typography>

            <Typography variant="body2">
              Mês/Ano : {cubInformation?.monthYear}
            </Typography>
            <Typography variant="body2">
              CUB SC (R$/m²) : {cubInformation?.cubValue}
            </Typography>
            <Typography variant="body2">
              Mês (%) : {cubInformation?.monthPercentage}
            </Typography>
            <Typography variant="body2">
              Ano (%) : {cubInformation?.yearPercentage}
            </Typography>
            <Typography variant="body2">
              12 meses(%) : {cubInformation?.twelveMonthsPercentage}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          background: '#153358',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 2,
        }}
      >
        <Typography variant="caption">
          {`Auros corretora imobiliária - CRECI-SC 7018-J (Rio do Sul ) CRECI-SC 8732-J (Balneário Camboriú)`}
        </Typography>
      </Box>
    </>
  )
}
