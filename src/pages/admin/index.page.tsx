import { Menubar } from '@/components/Menubar'

import { Content } from './styles'

import Container from '@/components/Container'

import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import api from '@/services/api'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface ClientProps {
  id: string
  name: string
  phone: string
  email: string
  description: string
}

export default function Home() {
  const router = useRouter()
  const { status } = useSession()
  const [clients, setClients] = useState<ClientProps[]>([])

  const [loading, setLoading] = useState(false)

  const loadClients = useCallback(async () => {
    setLoading(true)

    const response = await api.get(`/clientes`)

    if (response) {
      setClients(response.data)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <Container>
      <Head>
        <title>Auros | Dashboard</title>
      </Head>

      <Menubar />

      <Content>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Seja bem vindo ao sistema interno da auros!
        </Typography>

        <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
          Clientes
        </Typography>

        {clients.map((client) => (
          <Accordion key={client.id} variant="outlined">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, .05)',
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: 'rotate(90deg)',
                },
                '& .MuiAccordionSummary-content': {
                  marginLeft: (theme) => theme.spacing(1),
                },
              }}
            >
              <Typography variant="body1">
                {`${client.name} (${client.email} - ${client.phone})`}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                borderTop: '1px solid rgba(0, 0, 0, .125)',
              }}
            >
              <Typography variant="body2">{client.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Content>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}
