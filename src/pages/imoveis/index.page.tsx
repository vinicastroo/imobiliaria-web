import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import Link from 'next/link'
import { Bed, Car, Door, Ruler, Toilet } from 'phosphor-react'
import { MenubarHome } from '@/components/MenubarHome'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import api from '@/services/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { z, infer as Infer } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSideProps } from 'next'
import logo from '@/assets/logo-auros-minimalist.svg'
import Image from 'next/image'
import { BiArea } from 'react-icons/bi'
import { LiaRulerCombinedSolid } from 'react-icons/lia'
interface TypeProperty {
  id: string
  createdAt: string
  description: string
  checked: boolean
}

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
  type_property: {
    id: string
    description: string
    createdAt: string
  }
  files: {
    id: string
    path: string
  }[]
}

interface CityProps {
  city: string
}

interface NeighborhoodProps {
  neighborhood: string
}

function Filter({
  types,
  cities,
  initialNeighborhood,
  setProperties,
}: {
  types: TypeProperty[]
  cities: CityProps[]
  initialNeighborhood: NeighborhoodProps[]
  setProperties: Dispatch<SetStateAction<Property[]>>
}) {
  const [neighborhoods, setNeighborhood] =
    useState<NeighborhoodProps[]>(initialNeighborhood)

  const router = useRouter()

  const { tipoImovel, cidade, bairro } = router.query

  const createSchema = z.object({
    type: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    suites: z.string().optional(),
    parkingSpots: z.string().optional(),
    totalArea: z.string().optional(),
    privateArea: z.string().optional(),
  })
  type SchemaQuestion = Infer<typeof createSchema>

  const { watch, handleSubmit, reset, control } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  })

  const city = watch('city')

  const loadNeighboorhood = useCallback(async () => {
    if (city) {
      const response = await api.get<NeighborhoodProps[]>(
        `/imovel/bairro/${city}`,
      )
      if (response) {
        setNeighborhood([...response.data])
      }
    }
  }, [city])

  useEffect(() => {
    loadNeighboorhood()
  }, [loadNeighboorhood])

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      const responseImoveis = await api.get(`/imovel`, {
        params: {
          type: data.type !== 'undefined' ? data.type : undefined,
          city: data.city !== 'undefined' ? data.city : undefined,
          neighborhood:
            data.neighborhood !== 'undefined' ? data.neighborhood : undefined,
          bedrooms: data.bedrooms ? data.bedrooms : undefined,
          bathrooms: data.bathrooms ? data.bathrooms : undefined,
          suites: data.suites ? data.suites : undefined,
          parkingSpots: data.parkingSpots ? data.parkingSpots : undefined,
          totalArea: data.totalArea ? data.totalArea : undefined,
          privateArea: data.privateArea ? data.privateArea : undefined,
        },
      })

      setProperties([...responseImoveis.data])
    },
    [setProperties],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        variant="outlined"
        sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
      >
        <Controller
          name="type"
          control={control}
          defaultValue={String(tipoImovel)}
          render={({ field: { ref, ...field } }) => {
            return (
              <FormControl sx={{ mt: 1, mb: 1 }} fullWidth size="small">
                <InputLabel id="type-select-label">Tipo imóvel</InputLabel>

                <Select
                  labelId="type-select-label"
                  inputRef={ref}
                  label="Tipo Imóvel"
                  {...field}
                >
                  <MenuItem value={undefined}>Selecione</MenuItem>
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.description}>
                      {type.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }}
        />

        <Controller
          name="city"
          control={control}
          defaultValue={String(cidade)}
          render={({ field: { ref, ...field } }) => {
            return (
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1 }}>
                <InputLabel id="city-select-label">Cidade</InputLabel>

                <Select
                  labelId="city-select-label"
                  inputRef={ref}
                  label="Cidade"
                  {...field}
                >
                  <MenuItem value={undefined}>Selecione</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city.city} value={city.city}>
                      {city.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }}
        />
        <Controller
          name="neighborhood"
          control={control}
          defaultValue={String(bairro)}
          render={({ field: { ref, ...field } }) => {
            return (
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1 }}>
                <InputLabel id="neightboor-select-label">Bairro</InputLabel>

                <Select
                  labelId="neightboor-select-label"
                  inputRef={ref}
                  label="Bairro"
                  {...field}
                >
                  <MenuItem value={undefined}>Selecione</MenuItem>
                  {neighborhoods.map((neighborhood) => (
                    <MenuItem
                      key={neighborhood.neighborhood}
                      value={neighborhood.neighborhood}
                    >
                      {neighborhood.neighborhood}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="body1" color="rgba(0, 0, 0, 0.6)">
            Características do imóvel:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1.5,
              mt: 2,
            }}
          >
            <Door size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />
            <Controller
              name="bedrooms"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Nº Quartos"
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1.5,
              mt: 2,
            }}
          >
            <Bed size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="suites"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Nº Suites"
                  size="small"
                  fullWidth
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Toilet size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="bathrooms"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Nº Banheiros"
                  size="small"
                  fullWidth
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Car size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="parkingSpots"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Nº Estacionamento"
                  size="small"
                  fullWidth
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Ruler size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="totalArea"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Area do imóvel"
                  size="small"
                  fullWidth
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Ruler size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="privateArea"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Area do terreno"
                  fullWidth
                  size="small"
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Button
            color="primary"
            type="submit"
            variant="contained"
            sx={{ mt: 1 }}
          >
            Filtrar
          </Button>

          <Button
            color="primary"
            onClick={() => {
              router.replace('/imoveis', undefined, { shallow: true })
              reset({
                city: '',
                type: '',
                neighborhood: '',
                bathrooms: '',
                bedrooms: '',
                parkingSpots: '',
                privateArea: '',
                suites: '',
                totalArea: '',
              })
            }}
          >
            Limpar Filtros
          </Button>
        </Box>
      </Card>
    </form>
  )
}

function Properties({
  properties,
  handleOpenFilter,
}: {
  properties: Property[]
  handleOpenFilter: () => void
}) {
  return (
    <Box
      sx={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" onClick={handleOpenFilter}>
          Filtros
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body1" color="#333" fontWeight="bold">
          {properties.length}{' '}
          {properties.length === 1
            ? 'Imóvel encontrado'
            : 'Imóveis encontrados'}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {properties.map((property) => (
          <Grid
            key={property.id}
            item
            md={3}
            sm={12}
            xs={12}
            sx={{ a: { textDecoration: 'none' } }}
          >
            <Link href={`/imoveis/${property.id}`}>
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative',
                }}
              >
                {property.files.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="250"
                    image={property.files[0].path}
                    alt="Foto do imóvel"
                  />
                ) : (
                  <Box
                    sx={{
                      height: '250px',
                      background: '#17375F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image src={logo} alt="logo" width={120} height={120} />
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      px: 2,
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        py: 1,
                        width: '100%',
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="#333"
                        fontWeight="bold"
                      >
                        {property.name}
                      </Typography>
                      <Typography variant="caption">
                        {property.city} - {property.neighborhood}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {property.summary}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      Informações
                    </Typography>
                    <Box display="flex" gap={1} mb={1}>
                      {Number(property.bedrooms) > 0 && (
                        <Tooltip
                          title="Quartos"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Door size={16} weight="bold" />
                            <Typography variant="caption">
                              {property.bedrooms}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}

                      {Number(property.suites) > 0 && (
                        <Tooltip
                          title="Suites"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Bed size={16} weight="bold" />
                            <Typography variant="caption">
                              {property.suites}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}

                      {Number(property.bathrooms) > 0 && (
                        <Tooltip
                          title="Banheiros"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Toilet size={16} weight="bold" />
                            <Typography variant="caption">
                              {property.bathrooms}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}

                      {Number(property.parkingSpots) > 0 && (
                        <Tooltip
                          title="Garagem"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Car size={16} weight="bold" />
                            <Typography variant="caption">
                              {property.parkingSpots}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}

                      {Number(property.totalArea) > 0 && (
                        <Tooltip
                          title="Area total"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <LiaRulerCombinedSolid size={16} />
                            <Typography variant="caption">
                              {property.totalArea}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}

                      {Number(property.privateArea) > 0 && (
                        <Tooltip
                          title="Area do terreno"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <BiArea size={16} />
                            <Typography variant="caption">
                              {property.privateArea}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, my: 0.5 }}>
                      <Chip
                        label="Venda"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 400 }}
                      />

                      <Chip
                        label={property.type_property.description}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 400 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '100%',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: '#17375F' }}
                      >
                        {property.value}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          variant="outlined"
          color="primary"
        />
      </Box> */}
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )

  const { tipoImovel, cidade, bairro } = context.query
  const responseImoveis = await api.get(`/imovel?visible=true`, {
    params: {
      type: tipoImovel,
      city: cidade,
      neighborhood: bairro,
    },
  })
  const responseTipo = await api.get<TypeProperty[]>(`/tipo-imovel`)
  const responseCities = await api.get<CityProps[]>(`/imovel/cidades`)

  const responseNeighborhood = await api.get<NeighborhoodProps[]>(
    `/imovel/bairro/${cidade}`,
  )

  return {
    props: {
      properties: responseImoveis.data,
      types: responseTipo.data,
      cities: responseCities.data,
      neighborhoods: responseNeighborhood.data,
    },
  }
}

export default function Home({
  properties: initialProperties,
  types,
  cities,
  neighborhoods,
}: {
  properties: Property[]
  types: TypeProperty[]
  cities: CityProps[]
  neighborhoods: NeighborhoodProps[]
}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [openFilter, setOpenFilter] = useState(false)

  const handleOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }
  return (
    <>
      <Head>
        <title>Auros | Imóveis</title>
      </Head>
      <Box>
        <MenubarHome />

        <Properties
          properties={properties}
          handleOpenFilter={handleOpenFilter}
        />

        <Drawer
          open={openFilter}
          onClose={handleCloseFilter}
          anchor="right"
          sx={{ p: 2 }}
        >
          <Filter
            types={types}
            cities={cities}
            initialNeighborhood={neighborhoods}
            setProperties={setProperties}
          />
        </Drawer>
      </Box>
    </>
  )
}
