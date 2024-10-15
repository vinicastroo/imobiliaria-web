import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import Link from 'next/link'
import { Bathtub, Bed, Car, Ruler, Toilet } from 'phosphor-react'
import { MenubarHome } from '@/components/MenubarHome'
import { useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { z, infer as Infer } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import logo from '@/assets/logo-auros-minimalist.svg'
import Image from 'next/image'
import { BiArea } from 'react-icons/bi'
import { LiaRulerCombinedSolid } from 'react-icons/lia'
import square from '@/assets/square.svg'
import Footer from '@/components/Footer'
import { useQuery } from '@tanstack/react-query'
import { getNeighborhoods } from '../api/get-neighborhoods'
import { getTypes } from '../api/get-types'
import { getCities } from '../api/get-cities'
import { usePathname, useSearchParams } from 'next/navigation'
import { getProperties } from '../api/get-properties'

function Filter() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const type = searchParams.get('tipoImovel')
  const cityUrl = searchParams.get('cidade')
  const neighborhood = searchParams.get('bairro')
  const bedrooms = searchParams.get('quartos')
  const bathrooms = searchParams.get('banheiros')
  const suites = searchParams.get('suites')
  const parkingSpots = searchParams.get('garagem')
  const totalArea = searchParams.get('areaTotal')
  const privateArea = searchParams.get('areaTerreno')

  const pathname = usePathname()

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

  const {
    watch,
    handleSubmit,
    reset,
    control,
    formState: { isLoading },
  } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      type: type ?? '',
      city: cityUrl ?? '',
      neighborhood: neighborhood ?? '',
      bedrooms: bedrooms ?? '',
      bathrooms: bathrooms ?? '',
      suites: suites ?? '',
      parkingSpots: parkingSpots ?? '',
      totalArea: totalArea ?? '',
      privateArea: privateArea ?? '',
    },
  })

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      const params = new URLSearchParams(searchParams)
      if (data.type && data.type !== 'undefined') {
        params.set('tipoImovel', data.type)
      } else {
        params.delete('tipoImovel')
      }

      if (data.city && data.city !== 'undefined') {
        params.set('cidade', data.city)
      } else {
        params.delete('cidade')
      }

      if (data.neighborhood && data.neighborhood !== 'undefined') {
        params.set('bairro', data.neighborhood)
      } else {
        params.delete('bairro')
      }

      if (data.bedrooms) {
        params.set('quartos', data.bedrooms)
      } else {
        params.delete('quartos')
      }

      if (data.bathrooms) {
        params.set('banheiros', data.bathrooms)
      } else {
        params.delete('banheiros')
      }

      if (data.suites) {
        params.set('suites', data.suites)
      } else {
        params.delete('suites')
      }

      if (data.parkingSpots) {
        params.set('garagem', data.parkingSpots)
      } else {
        params.delete('garagem')
      }

      if (data.totalArea) {
        params.set('areaTotal', data.totalArea)
      } else {
        params.delete('areaTotal')
      }

      if (data.privateArea) {
        params.set('areaTerreno', data.privateArea)
      } else {
        params.delete('areaTerreno')
      }

      params.set('page', '1')

      const search = params.toString()
      const query = search ? `?${search}` : ''
      router.push(`${pathname}${query}`)
    },
    [pathname, router, searchParams],
  )

  const city = watch('city')

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities(),
  })

  const { data: types } = useQuery({
    queryKey: ['types'],
    queryFn: () => getTypes(),
  })

  const { data: neighborhoods } = useQuery({
    queryKey: ['neighborhoods', city],
    queryFn: () => getNeighborhoods({ city }),
  })

  function handleClearFilter() {
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
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        variant="outlined"
        sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
      >
        <Controller
          name="type"
          control={control}
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
                  <MenuItem value="">Selecione</MenuItem>
                  {types &&
                    types.length > 0 &&
                    types.map((type) => (
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
                  <MenuItem value="">Selecione</MenuItem>
                  {cities &&
                    cities.length > 0 &&
                    cities.map((city) => (
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
                  <MenuItem value="">Selecione</MenuItem>
                  {neighborhoods &&
                    neighborhoods.length > 0 &&
                    neighborhoods.map((neighborhood) => (
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
            <Bed size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />
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
            <Bathtub size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

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
            disabled={isLoading}
          >
            Filtrar
          </Button>

          <Button color="primary" onClick={handleClearFilter}>
            Limpar Filtros
          </Button>
        </Box>
      </Card>
    </form>
  )
}

function Properties() {
  const searchParams = useSearchParams()
  const type = searchParams.get('tipoImovel')
  const city = searchParams.get('cidade')
  const neighborhood = searchParams.get('bairro')
  const bedrooms = searchParams.get('quartos')
  const bathrooms = searchParams.get('banheiros')
  const suites = searchParams.get('suites')
  const parkingSpots = searchParams.get('garagem')
  const totalArea = searchParams.get('areaTotal')
  const privateArea = searchParams.get('areaTerreno')
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', value.toString())
    const search = params.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  const { data: result, isLoading } = useQuery({
    queryKey: [
      'properties',
      type,
      city,
      neighborhood,
      bedrooms,
      bathrooms,
      suites,
      parkingSpots,
      totalArea,
      privateArea,
      page,
    ],
    queryFn: () =>
      getProperties({
        page,
        type,
        city,
        neighborhood,
        bedrooms,
        bathrooms,
        suites,
        parkingSpots,
        totalArea,
        privateArea,
      }),
  })

  const totalPages = result ? Math.ceil(result.totalPages / 12) || 1 : 1

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        p: 2,
        zIndex: 999,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h1"
          color="#333"
          fontWeight="bold"
          style={{ fontSize: ' 0.875rem' }}
        >
          {result &&
            `${result.totalPages} ${result.totalPages === 1 ? 'Imóvel encontrado' : 'Imóveis encontrados'}`}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item md={3} sm={12} xs={12}>
          <Filter />
        </Grid>
        <Grid item md={9} sm={12} xs={12}>
          <Grid container spacing={2}>
            {result &&
              !isLoading &&
              result.properties.map((property) => (
                <Grid
                  key={property.id}
                  item
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{
                    transition: '0.5s',
                    a: { textDecoration: 'none' },
                    ':hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Link href={`/imoveis/${property.id}`} target="_blank">
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
                          sx={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '250px',
                          }}
                        >
                          <Image
                            src={property.files[0].path}
                            width={350}
                            height={250}
                            alt="Foto do imóvel"
                            quality={80}
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '250px',
                            }}
                          />
                        </CardMedia>
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
                          <Image
                            src={logo}
                            alt="logo"
                            width={120}
                            height={120}
                          />
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
                              variant="h2"
                              color="#333"
                              fontWeight="bold"
                              style={{
                                fontSize: '1rem',
                              }}
                            >
                              {property.name}
                            </Typography>
                            <Typography
                              variant="h3"
                              style={{
                                fontSize: '0.75rem',
                              }}
                            >
                              {property.city} - {property.neighborhood}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ wordBreak: 'break-word' }}
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
                          <Box
                            display="flex"
                            gap={1}
                            mb={1}
                            rowGap={0.5}
                            flexWrap="wrap"
                          >
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
                                  <Bed size={16} weight="bold" />
                                  <Typography variant="body1">
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
                                  <Bathtub size={16} weight="bold" />
                                  <Typography variant="body1">
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
                                  <Typography variant="body1">
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
                                  <Typography variant="body1">
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
                                  <Typography variant="body1">
                                    {property.totalArea} M²
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
                                  <Typography variant="body1">
                                    {property.privateArea} M²
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
                              variant="h4"
                              fontWeight="bold"
                              sx={{ color: '#17375F', fontSize: '1rem' }}
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
            {isLoading &&
              Array.from({ length: 12 }).map(() => {
                return (
                  <Grid key={Math.random()} item md={4} sm={12} xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Skeleton variant="rectangular" height={250} />

                      <Box>
                        <Skeleton
                          variant="text"
                          width="70%"
                          sx={{ fontSize: '1rem' }}
                        />
                        <Skeleton
                          variant="text"
                          width="50%"
                          sx={{ fontSize: '1rem' }}
                        />

                        <Skeleton
                          variant="rectangular"
                          height={50}
                          sx={{ my: 2 }}
                        />

                        <Skeleton variant="text" width="20%" />

                        <Skeleton variant="text" />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Skeleton variant="text" width="20%" />
                          <Skeleton variant="text" width="40%" />
                        </Box>

                        <Box
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Skeleton
                            variant="text"
                            width="70%"
                            sx={{ mt: 1, justifySelf: 'flex-end' }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )
              })}
            {result && !isLoading && result.properties.length === 0 && (
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                sx={{ a: { textDecoration: 'none' } }}
              >
                <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                  Nenhum imóvel encontrado
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChange}
            shape="rounded"
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Auros Corretora Imobiliária | Imóveis em Rio do Sul e Balneário
          Camboriú
        </title>

        <meta
          property="og:image"
          content="https://www.aurosimobiliaria.com.br/logo.png"
        />
      </Head>

      <Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            position: 'relative',
            backgroundColor: '#fff',
            backgroundImage: { md: `url(${square.src}), url(${square.src})` },
            backgroundPosition: {
              xs: '170% 0%,-70% 100%',
              sm: '170% 0%,-70% 100%',
              md: '110% 0%, -10% 100%',
            },
            backgroundSize: 'auto, auto',
            backgroundRepeat: 'no-repeat, no-repeat',
          }}
        >
          <MenubarHome />
          <Properties />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }} />
      <Footer />
    </>
  )
}
