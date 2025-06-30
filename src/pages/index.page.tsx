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
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  Skeleton,
} from '@mui/material'
import bg from '@/assets/background.jpg'
import logo from '@/assets/logo-auros-minimalist.svg'

import square from '@/assets/square.svg'
import cityBackground from '@/assets/city-background.svg'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bed,
  Car,
  FacebookLogo,
  InstagramLogo,
  Toilet,
  WhatsappLogo,
  Bathtub,
} from 'phosphor-react'
import { useCallback } from 'react'
import api from '@/services/api'
import { useForm } from 'react-hook-form'
import { z, infer as Infer } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Search } from '@mui/icons-material'
import { BiArea } from 'react-icons/bi'
import { LiaRulerCombinedSolid } from 'react-icons/lia'
import Footer from '@/components/Footer'
import { getTypes } from './api/get-types'
import { useQuery } from '@tanstack/react-query'
import { getNeighborhoods } from './api/get-neighborhoods'
import { getCities } from './api/get-cities'
import { getRecentProperties } from './api/get-recent-properties'

function BannerHome() {
  const createSchema = z.object({
    type_id: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
  })

  type SchemaQuestion = Infer<typeof createSchema>
  const router = useRouter()

  const {
    register,
    watch,
    handleSubmit,
    formState: { isLoading },
  } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('sm'),
  )

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      router.push({
        pathname: 'imoveis',
        query: {
          tipoImovel: data.type_id ? data.type_id : undefined,
          cidade: data.city ? data.city : undefined,
          bairro: data.neighborhood ? data.neighborhood : undefined,
        },
      })
    },
    [router],
  )

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities(),
  })

  const { data: types } = useQuery({
    queryKey: ['types'],
    queryFn: () => getTypes(),
  })

  const city = watch('city')

  const { data: neighborhoods } = useQuery({
    queryKey: ['neighborhoods', city],
    queryFn: () => getNeighborhoods({ city }),
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: '100%',
            height: '100vh',
            backgroundSize: 'cover',
            position: 'relative',
            backgroundRepeat: 'no-repeat',
            backgroundPositionY: '-80px',
            p: 2,
          }}
        >
          <Box>
            <Image
              src={bg}
              alt=""
              height={isSmallScreen ? 650 : 950}
              quality={100}
              style={{
                position: 'absolute',
                zIndex: -1,
                top: 0,
                left: 0,
                height: '100vh',
                width: '100%',
                backgroundSize: 'cover',
                objectFit: 'cover',
              }}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              py: 1,
              gap: 2,
              flexDirection: { xs: 'column', sm: 'column', md: 'row' },
              px: { xs: 2, sm: 1, md: 0 },
              a: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          >
            <Link href="/">
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
                gap: 3,
                a: { color: 'white', textDecoration: 'none' },
                'a:hover': { opacity: 0.7 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Link
                  href="https://api.whatsapp.com/send?phone=5547988163739&text=Olá, vim pelo site, gostaria de mais informações"
                  aria-label="Link para o WhatsApp"
                  title="Link para o WhatsApp"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WhatsappLogo size={20} weight="fill" />
                  </Box>
                </Link>

                <Link
                  href="https://www.instagram.com/auroscorretoraimobiliaria/"
                  aria-label="Link para o Instagram"
                  title="Link para o Instagram"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InstagramLogo size={20} weight="fill" />
                  </Box>
                </Link>

                <Link
                  href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR"
                  aria-label="Link para o Facebook"
                  title="Link para o Facebook"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FacebookLogo size={20} weight="fill" />
                  </Box>
                </Link>
              </Box>

              <Link href="/imoveis">
                <Typography variant="body1">Imóveis</Typography>
              </Link>
              <Link href="#contact">
                <Typography variant="body1">Entre em contato</Typography>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                margin: 'auto 0',
                maxWidth: '1200px',
                width: '100%',
              }}
            >
              <Typography
                variant="h1"
                textAlign="center"
                color="#fff"
                fontWeight="400"
                style={{
                  fontSize: isSmallScreen ? '1.5rem' : '3rem',
                }}
              >
                Assim como o ouro é valioso, seu novo lar será um tesouro
                inestimável
              </Typography>

              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  width: '100%',

                  background: {
                    md: 'rgba(255, 255, 255,0.1)',
                  },
                  boxShadow: {
                    md: '0 1px 30px rgba(0, 0, 0, 0.5)',
                  },
                  backdropFilter: {
                    md: 'blur(3px)',
                  },
                  '-webkit-backdrop-filter': {
                    md: 'blur(3px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                  }}
                  gap={3}
                >
                  <FormControl
                    sx={{ background: '#fff', borderRadius: 1 }}
                    size={isSmallScreen ? 'small' : 'medium'}
                    fullWidth
                  >
                    <InputLabel id="neightboor-select-label">
                      Tipo Imóvel
                    </InputLabel>
                    <Select
                      // error={Boolean(errors.type_id)}
                      labelId="neightboor-select-label"
                      label="Tipo Imóvel"
                      {...register('type_id')}
                    >
                      <MenuItem>Selecione</MenuItem>
                      {types &&
                        types.length > 0 &&
                        types.map((type) => (
                          <MenuItem key={type.id} value={type.description}>
                            {type.description}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size={isSmallScreen ? 'small' : 'medium'}
                    sx={{ background: '#fff', borderRadius: 1 }}
                    fullWidth
                  >
                    <InputLabel id="neightboor-select-label">Cidade</InputLabel>
                    <Select
                      // error={Boolean(errors.type_id)}
                      labelId="neightboor-select-label"
                      label="Cidade"
                      {...register('city')}
                    >
                      <MenuItem>Selecione</MenuItem>
                      {cities &&
                        cities.length > 0 &&
                        cities.map((city) => (
                          <MenuItem key={city.city} value={city.city}>
                            {city.city}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size={isSmallScreen ? 'small' : 'medium'}
                    sx={{ background: '#fff', borderRadius: 1 }}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label">
                      Bairro
                    </InputLabel>
                    <Select
                      // error={Boolean(errors.type_id)}
                      label="Bairros"
                      title="Bairros"
                      aria-labelledby="Bairros"
                      {...register('neighborhood')}
                    >
                      <MenuItem>Selecione</MenuItem>
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
                  <Button
                    variant="contained"
                    sx={{
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                    color="primary"
                    size={isSmallScreen ? 'medium' : 'large'}
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    <Search />
                    Buscar
                  </Button>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </form>
    </>
  )
}

function Recent() {
  const { data, isLoading: loading } = useQuery({
    queryKey: ['recent-properties'],
    queryFn: () => getRecentProperties(),
  })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        p: 2,
        py: 4,
        background: '#fafafa',
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
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Typography variant="h2" color="#000" style={{ fontSize: 24 }}>
          Propriedades
        </Typography>
        <Typography
          variant="h2"
          color="primary"
          fontWeight="bold"
          style={{ fontSize: 24 }}
        >
          Recentes
        </Typography>
      </Box>

      <Grid
        container
        sx={{
          maxWidth: '1200px',
        }}
        spacing={2}
      >
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} item md={4} sm={12} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Skeleton variant="rectangular" width={384} height={250} />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              </Box>
            </Grid>
          ))}
        {data &&
          data.properties.map((property) => (
            <Grid
              key={property.id}
              item
              md={4}
              sm={12}
              xs={12}
              sx={{
                a: {
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 0.8,
                  },
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
                  }}
                >
                  {property.files.length > 0 ? (
                    <CardMedia>
                      <Image
                        src={property.files[0].path}
                        width={400}
                        height={250}
                        alt="Foto do imóvel"
                        quality={100}
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
                          variant="h3"
                          color="#333"
                          fontWeight="bold"
                          style={{ fontSize: '1rem' }}
                        >
                          {property.name}
                        </Typography>
                        <Typography
                          variant="h3"
                          style={{ fontSize: '0.875rem' }}
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
                        overflowX: 'auto',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.primary"
                        mt={2}
                        fontWeight="bold"
                      >
                        Informações
                      </Typography>

                      <Box
                        display="flex"
                        gap={2}
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
                              <Bed size={24} weight="bold" />
                              <Typography variant="body2" fontWeight="bold">
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
                              <Bathtub size={24} weight="bold" />
                              <Typography variant="body2" fontWeight="bold">
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
                              <Toilet size={24} weight="bold" />
                              <Typography variant="body2" fontWeight="bold">
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
                              <Car size={24} weight="bold" />
                              <Typography variant="body2" fontWeight="bold">
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
                              <LiaRulerCombinedSolid size={24} />
                              <Typography variant="body2" fontWeight="bold">
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
                              <BiArea size={24} />
                              <Typography variant="body2" fontWeight="bold">
                                {property.privateArea} M²
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
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

                        <Chip
                          label="Venda"
                          color="primary"
                          sx={{ fontWeight: '600' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))}
      </Grid>
      {data && data.properties.length > 0 && (
        <Link href="/imoveis">
          <Button variant="outlined" size="large" sx={{ mt: 4 }}>
            Ver todos
          </Button>
        </Link>
      )}
    </Box>
  )
}

function Contact() {
  const createSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    description: z.string(),
  })
  type SchemaQuestion = Infer<typeof createSchema>

  const { register, handleSubmit, reset } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  })

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      try {
        await api.post('/clientes', data)
        toast.success('contato enviado com sucesso')
        reset()
      } catch (e) {
        console.error(e)
        toast.error('Ocorreu um erro ao enviar seu contato')
      }
    },
    [reset],
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('sm'),
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        id="contact"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: { xs: 600, sm: 600, md: 700 },
          p: 2,
          position: 'relative',
          background: 'linear-gradient(#fafafa, #D0DEF8)',
          overflow: 'hidden',
        }}
      >
        <Image
          src={cityBackground}
          alt=""
          height={isSmallScreen ? 300 : 450}
          style={{ position: 'absolute', bottom: 0 }}
        />
        <Box
          sx={{
            width: '100%',
            height: '100%',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
          }}
        />
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 3,
            mt: 4,
            maxWidth: '544px',
            width: '100%',
            zIndex: 999,
          }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            style={{ fontSize: '1.25rem' }}
          >
            Entre em contato
          </Typography>

          <TextField label="Nome" size="small" required {...register('name')} />
          <TextField label="Email" size="small" {...register('email')} />
          <TextField
            label="Telefone"
            size="small"
            required
            {...register('phone')}
          />

          <TextField
            label="Observação"
            multiline
            minRows={3}
            inputProps={{ maxLength: 255 }}
            size="small"
            required
            {...register('description')}
          />

          <Button
            variant="contained"
            sx={{ py: 1, fontSize: '0.875rem' }}
            type="submit"
          >
            Enviar Contato
          </Button>
        </Card>
      </Box>
    </form>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Auros Corretora - Imobiliária em Rio do Sul e Balneário Camboriú
        </title>

        <meta
          property="og:image"
          content="https://www.aurosimobiliaria.com.br/logo.png"
        />

        <link rel="canonical" href="https://aurosimobiliaria.com.br" />
      </Head>

      <Box>
        <BannerHome />
        <Recent />
        <Contact />
        <Footer />
      </Box>
    </>
  )
}
