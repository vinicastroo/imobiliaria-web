import { Menubar } from '@/components/Menubar'
import { Plus } from 'phosphor-react'

import { Content } from './styles'

import Container from '@/components/Container'
import { Button, Card, Grid, Typography, Box, IconButton } from '@mui/material'

import { DataGrid, GridColDef, ptBR } from '@mui/x-data-grid'

import DeleteIcon from '@mui/icons-material/Delete'

import { useCallback, useEffect, useState } from 'react'
import { ModalCreateType } from './ModalCreateType'
import { ModalDeleteType } from './ModalDeleteType'
import { BackLink } from '@/components/BackLink'
import api from '@/services/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface TypeProps {
  id: string
  createdAt: string
  description: string
}

export default function TipoImovel() {
  const [typeIdSelected, setTypeIdSelected] = useState('')
  const [openCreatePromotion, setOpenCreatePromotion] = useState(false)
  const [openDeletePromotion, setOpenDeletePromotion] = useState(false)

  const [types, setTypes] = useState<TypeProps[]>([])
  const router = useRouter()
  const { status } = useSession()

  const loadTypes = useCallback(async () => {
    const response = await api.get(`/tipo-imovel`)
    if (response) {
      setTypes([...response.data])
    }
  }, [])

  useEffect(() => {
    loadTypes()
  }, [loadTypes])

  const handleOpenCreateType = () => setOpenCreatePromotion(true)
  const handleCloseCreateType = () => {
    setOpenCreatePromotion(false)
    loadTypes()
  }

  const handleOpenDeleteType = (id: string) => {
    setTypeIdSelected(id)
    setOpenDeletePromotion(true)
  }

  const handleCloseDeleteType = () => {
    setOpenDeletePromotion(false)
    loadTypes()
  }

  // if (status === 'unauthenticated') {
  //   router.push('/login')
  //   return null
  // }

  // if (session && !session?.user.isCompany) {
  //   router.push('/login')
  //   return null
  // }

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Descrição',
      flex: 1,
    },
    {
      field: 'action',
      headerName: '',
      align: 'right',
      renderCell: (row) => {
        return (
          <IconButton
            title="Excluir tipo imóvel"
            onClick={() => {
              handleOpenDeleteType(String(row.id))
            }}
          >
            <DeleteIcon />
          </IconButton>
        )
      },
    },
  ]

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <Container>
      <Head>
        <title>Auros | Tipo Imóveis</title>
      </Head>

      <Menubar />
      <Content>
        <BackLink />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Gerenciamento de Tipo Imóveis
          </Typography>

          <Button
            variant="contained"
            onClick={handleOpenCreateType}
            sx={{ color: '#fff' }}
            endIcon={<Plus weight="fill" />}
            size="small"
          >
            Criar Tipo do imóvel
          </Button>
        </Box>

        <Grid container mt={2} spacing={2}>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12}>
                <Card variant="outlined" sx={{ height: 'auto', width: '100%' }}>
                  <DataGrid
                    autoHeight
                    rows={types}
                    columns={columns}
                    sx={{ borderColor: 'transparent' }}
                    localeText={
                      ptBR.components.MuiDataGrid.defaultProps.localeText
                    }
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Content>

      <ModalCreateType
        open={openCreatePromotion}
        handleClose={handleCloseCreateType}
      />
      <ModalDeleteType
        id={typeIdSelected}
        open={openDeletePromotion}
        handleClose={handleCloseDeleteType}
      />
    </Container>
  )
}
