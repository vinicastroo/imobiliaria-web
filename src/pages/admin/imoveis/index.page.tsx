import { Menubar } from '@/components/Menubar'
import { Eye, EyeSlash, PencilSimple, Plus, TrashSimple } from 'phosphor-react'

import { Content } from './styles'

import Container from '@/components/Container'
import {
  Button,
  Card,
  Grid,
  Typography,
  Box,
  // IconButton,
  Backdrop,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'

import { DataGrid, GridColDef, ptBR } from '@mui/x-data-grid'

// import DeleteIcon from '@mui/icons-material/Delete'

import { useCallback, useEffect, useState } from 'react'
import { BackLink } from '@/components/BackLink'
import api from '@/services/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toast } from 'react-toastify'
import { ModalDeleteProperty } from './ModalDeleteProperty'

interface Property {
  id: string
  name: string
  summary: string
  description: string
  value: string
  bedrooms: string
  bathrooms: string
  parkingSpots: string
  suites: string
  totalArea: string
  privateArea: string
  createdAt: string
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  numberAddress: string
  longitude: string
  latitude: string
  visible: boolean
  type_property: {
    id: string
    description: string
    createdAt: string
  }
}

export default function Property() {
  const route = useRouter()
  const { status } = useSession()
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [total, setTotal] = useState()
  const [loading, setLoading] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [propertyIdSelected, setPropertySelected] = useState('')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const loadProperties = useCallback(async () => {
    setLoading(true)

    const response = await api.get(`/imovel`, {
      params: {
        page: page + 1,
        pageSize: 10,
      },
    })
    if (response) {
      setProperties(response.data.properties)
      setTotal(response.data.totalPages)
    }
    setLoading(false)
  }, [page])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const handleClickMenu = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
  ) => {
    setPropertySelected(id)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setPropertySelected('')
    setAnchorEl(null)
  }

  const handleActivePromotion = useCallback(async () => {
    if (propertyIdSelected) {
      try {
        await api
          .patch(`/imovel/${propertyIdSelected}`, {
            visible: true,
          })
          .then(() => {
            toast.success('Imóvel ativado com sucesso!')
            loadProperties()
          })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }, [loadProperties, propertyIdSelected])

  const handleDesactivePromotion = useCallback(async () => {
    if (propertyIdSelected) {
      try {
        await api
          .patch(`/imovel/${propertyIdSelected}`, {
            visible: false,
          })
          .then(() => {
            toast.success('Imóvel desativado com sucesso!')
            loadProperties()
          })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }, [loadProperties, propertyIdSelected])

  const handleOpenDeleteProperty = (id: string) => {
    setPropertySelected(id)
    setOpenModalDelete(true)
  }

  const handleCloseDeleteType = () => {
    setOpenModalDelete(false)
    loadProperties()
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        return params.row.id
      },
    },
    {
      field: 'type_property',
      headerName: 'Tipo de Imóvel',
      flex: 1,
      renderCell: (params) => {
        const typeProperty = params.row.type_property
        return typeProperty ? typeProperty.description : '-'
      },
    },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
    },
    {
      field: 'value',
      headerName: 'Valor',
      flex: 1,
    },
    {
      field: 'city',
      headerName: 'Cidade',
    },
    {
      field: 'neighborhood',
      headerName: 'Bairro',
    },
    {
      field: 'street',
      headerName: 'Rua',
      flex: 1,
    },
    {
      field: 'visible',
      headerName: 'Situação',
      renderCell: ({ row }) => {
        return row.visible ? 'Ativo' : 'Desativo'
      },
    },
    {
      field: 'action',
      headerName: '',
      align: 'right',
      renderCell: ({ row }) => {
        return (
          <div>
            <IconButton
              id="long-button"
              onClick={(event) => handleClickMenu(event, row.id)}
            >
              <MoreVertIcon />
            </IconButton>
            {propertyIdSelected === row.id && (
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={propertyIdSelected === row.id}
                onClose={handleClose}
                sx={{ width: '100%' }}
              >
                <MenuItem
                  onClick={() => {
                    router.push(`/admin/imoveis/editar/${row.id}`)
                  }}
                  sx={{ color: '#333', width: '100%' }}
                >
                  <PencilSimple />
                  <Typography ml={1}>Editar</Typography>
                </MenuItem>
                {row.visible && (
                  <MenuItem
                    onClick={() => {
                      handleDesactivePromotion()
                    }}
                    sx={{ color: '#333', width: '100%' }}
                  >
                    <EyeSlash />
                    <Typography ml={1}>Desativar</Typography>
                  </MenuItem>
                )}
                {!row.visible && (
                  <MenuItem
                    onClick={() => {
                      handleActivePromotion()
                    }}
                    sx={{ color: '#333', width: '100%' }}
                  >
                    <Eye />
                    <Typography ml={1}>Ativar</Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handleOpenDeleteProperty(String(row.id))
                  }}
                  sx={{ color: '#333', width: '100%' }}
                >
                  <TrashSimple />
                  <Typography ml={1}>Excluir</Typography>
                </MenuItem>
              </Menu>
            )}
          </div>
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
        <title>Auros | Imóveis</title>
      </Head>

      <Menubar />
      <Content>
        <BackLink />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Gerenciamento de Imóveis
          </Typography>

          <Button
            variant="contained"
            sx={{ color: '#fff' }}
            endIcon={<Plus />}
            onClick={() => route.push('/admin/imoveis/criar')}
          >
            Criar Imóvel
          </Button>
        </Box>

        <Grid container mt={2} spacing={2}>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12}>
                <Card variant="outlined" sx={{ height: 'auto', width: '100%' }}>
                  <DataGrid
                    autoHeight
                    rows={properties}
                    columns={columns}
                    pageSize={10}
                    rowCount={total}
                    onPageChange={(newPage) => setPage(newPage)}
                    page={page}
                    paginationMode="server"
                    pagination
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

      <ModalDeleteProperty
        open={openModalDelete}
        handleClose={handleCloseDeleteType}
        id={propertyIdSelected}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}
