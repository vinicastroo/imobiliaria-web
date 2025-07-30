/* eslint-disable @typescript-eslint/no-explicit-any */

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
  Backdrop,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridFilterModel,
  ptBR,
} from '@mui/x-data-grid'
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
  slug: string
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
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [propertyIdSelected, setPropertySelected] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'createdAt',
      sort: 'desc',
    },
  ])

  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] })

  const loadProperties = useCallback(async () => {
    setLoading(true)
    const params: any = {
      page: page + 1,
      pageSize: 10,
    }
    // Ordenação
    if (sortModel[0]?.field && sortModel[0]?.sort) {
      params.orderBy = sortModel[0].field
      params.order = sortModel[0].sort
    }
    // Filtros
    filterModel.items.forEach((item: any) => {
      if (item.value) {
        params[item.columnField] = item.value
      }
    })
    const response = await api.get('/imovel', { params })
    if (response) {
      setProperties(response.data.properties)
      setTotal(response.data.totalPages)
    }
    setLoading(false)
  }, [page, sortModel, filterModel])

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
      field: 'slug', // Nova coluna de slug
      headerName: 'Slug',
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
            <Card variant="outlined" sx={{ width: '100%' }}>
              <DataGrid
                autoHeight
                rows={properties}
                columns={columns}
                pageSize={10}
                rowCount={total}
                page={page}
                onPageChange={(newPage) => setPage(newPage)}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={(model) => {
                  setSortModel(model)
                  setPage(0)
                }}
                filterMode="server"
                filterModel={filterModel}
                onFilterModelChange={(model) => {
                  setFilterModel(model)
                  setPage(0)
                }}
                sx={{ borderColor: 'transparent' }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </Card>
          </Grid>
        </Grid>
      </Content>
      <ModalDeleteProperty
        open={openModalDelete}
        handleClose={() => {
          setOpenModalDelete(false)
          loadProperties()
        }}
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
