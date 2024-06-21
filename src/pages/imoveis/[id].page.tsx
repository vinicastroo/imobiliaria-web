import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material'

import rodrigoAvatar from '@/assets/digo.jpeg'
import jonathanAvatar from '@/assets/jonathan.jpeg'
import renatoAvatar from '@/assets/renato.jpeg'
import adrianaAvatar from '@/assets/adriana.jpeg'

import Image from 'next/image'
import {
  Bathtub,
  Bed,
  Car,
  CaretLeft,
  CaretRight,
  Toilet,
  WhatsappLogo,
} from 'phosphor-react'
import { MenubarHome } from '@/components/MenubarHome'
import Carousel from 'react-material-ui-carousel'
import { useMemo } from 'react'
import api from '@/services/api'
import Head from 'next/head'
import logo from '@/assets/logo-auros-minimalist.svg'
import { BiArea } from 'react-icons/bi'
import { LiaRulerCombinedSolid } from 'react-icons/lia'
import Footer from '@/components/Footer'

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

function Property({ property }: { property: Property }) {
  const items = useMemo(() => {
    const condition = property && property.files.length > 0

    return condition ? property?.files.map((file) => ({ img: file.path })) : []
  }, [property])

  return (
    <Box>
      <Head>
        <title>
          {`Auros | ${property.name}  (${property?.city} - ${property?.neighborhood} / ${property?.street}, ${property?.numberAddress})`}
        </title>

        <meta name="description" content={property?.description} />
      </Head>

      <MenubarHome />

      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          mt: { xs: 0, sm: 0, md: 4, mb: 4 },
        }}
      >
        <Box>
          <Carousel
            navButtonsAlwaysVisible
            PrevIcon={<CaretLeft />}
            NextIcon={<CaretRight />}
            height={600}
          >
            {items.length > 0 ? (
              items.map((item, i) => (
                <Image
                  key={i}
                  src={item.img}
                  alt="foto do imovel"
                  width={1920}
                  height={1080}
                  loading="lazy"
                  style={{
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ))
            ) : (
              <Box
                sx={{
                  background: '#17375F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Image src={logo} alt="logo" width={200} height={200} />
              </Box>
            )}
          </Carousel>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1, px: { xs: 2, sm: 2, md: 0 } }}>
          <Grid item md={8.5} sm={12} xs={12}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box display="flex" flexDirection="column">
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {property?.name}
                </Typography>
                <Typography variant="body2">
                  {`${property?.city} - ${property?.neighborhood} / ${property?.street}, ${property?.numberAddress}`}
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                mt={2}
                fontWeight="bold"
                color="primary"
              >
                Informações
              </Typography>

              <Box display="flex" mb={2} gap={2} rowGap={0.5} flexWrap="wrap">
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
                      <Bed size={25} weight="bold" />
                      <Typography variant="h6">{property.bedrooms}</Typography>
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
                      <Bathtub size={25} weight="bold" />
                      <Typography variant="h6">{property.suites}</Typography>
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
                      <Toilet size={25} weight="bold" />
                      <Typography variant="h6">{property.bathrooms}</Typography>
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
                      <Car size={25} weight="bold" />
                      <Typography variant="h6">
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
                      <LiaRulerCombinedSolid size={25} />
                      <Typography variant="h6">
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
                      <BiArea size={25} />
                      <Typography variant="h6">
                        {property.privateArea} M²
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </Box>

              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                Resumo
              </Typography>

              <Typography
                variant="body1"
                mb={2}
                sx={{ wordBreak: 'break-word' }}
              >
                {property?.summary}
              </Typography>

              {/* <Typography variant="subtitle2" fontWeight="bold" color="primary">
                Saiba mais
              </Typography> */}

              <Box mb={2}>
                {property && (
                  <Box
                    className="ql-editor"
                    sx={{
                      ul: {
                        paddingLeft: '20px',
                      },
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: property?.description,
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item md={3.5} sm={12} xs={12}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: '1px solid #eee', pb: 2 }}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Venda
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {property.value}
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Corretores
              </Typography>

              <Box display="flex" flexDirection="column" gap={2} mt={1}>
                {['Rio do Sul'].includes(property.city) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ borderBottom: '1px solid #eee', pb: 2 }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{ width: '50px', height: '50px' }}
                        variant="square"
                        src={adrianaAvatar.src}
                      />

                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">Adriana</Typography>
                        <Typography variant="caption">CRECI: 48879</Typography>
                      </Box>
                    </Box>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() =>
                        window.open(
                          `https://api.whatsapp.com/send?phone=5547997798081&&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                        )
                      }
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      <Typography variant="caption" ml={1}>
                        Whatsapp
                      </Typography>
                    </Button>
                  </Box>
                )}

                {['Rio do Sul', 'Aurora'].includes(property.city) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ borderBottom: '1px solid #eee', pb: 2 }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{ width: '50px', height: '50px' }}
                        variant="square"
                        src={renatoAvatar.src}
                      />
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">Renato</Typography>
                        <Typography variant="caption">CRECI: 37802</Typography>
                      </Box>
                    </Box>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() =>
                        window.open(
                          `https://api.whatsapp.com/send?phone=5547999008090&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                        )
                      }
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      <Typography variant="caption" ml={1}>
                        Whatsapp
                      </Typography>
                    </Button>
                  </Box>
                )}

                {['Aurora', 'Balneário Camboriú'].includes(property.city) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ borderBottom: '1px solid #eee', pb: 2 }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{ width: '50px', height: '50px' }}
                        variant="square"
                        src={rodrigoAvatar.src}
                      />
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">Rodrigo</Typography>
                        <Typography variant="caption">CRECI: 52831</Typography>
                      </Box>
                    </Box>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() =>
                        window.open(
                          `https://api.whatsapp.com/send?phone=5547999990607&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                        )
                      }
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      <Typography variant="caption" ml={1}>
                        Whatsapp
                      </Typography>
                    </Button>
                  </Box>
                )}

                {['Balneário Camboriú'].includes(property.city) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{ width: '50px', height: '50px' }}
                        variant="square"
                        src={jonathanAvatar.src}
                      />
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body1">Jonathan</Typography>
                        <Typography variant="caption">CRECI: 27584</Typography>
                      </Box>
                    </Box>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() =>
                        window.open(
                          `https://api.whatsapp.com/send?phone=5547988163739&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                        )
                      }
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      <Typography variant="caption" ml={1}>
                        Whatsapp
                      </Typography>
                    </Button>
                  </Box>
                )}

                {property.city !== 'Balneário Camboriú' &&
                  property.city !== 'Aurora' &&
                  property.city !== 'Rio do Sul' && (
                    <>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ borderBottom: '1px solid #eee', pb: 2 }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{ width: '50px', height: '50px' }}
                            variant="square"
                            src={adrianaAvatar.src}
                          />

                          <Box display="flex" flexDirection="column">
                            <Typography variant="body1">Adriana</Typography>
                            <Typography variant="caption">
                              CRECI: 48879
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          color="success"
                          variant="contained"
                          onClick={() =>
                            window.open(
                              `https://api.whatsapp.com/send?phone=5547997798081&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                            )
                          }
                        >
                          <WhatsappLogo size={20} weight="fill" />
                          <Typography variant="caption" ml={1}>
                            Whatsapp
                          </Typography>
                        </Button>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ borderBottom: '1px solid #eee', pb: 2 }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{ width: '50px', height: '50px' }}
                            variant="square"
                            src={renatoAvatar.src}
                          />
                          <Box display="flex" flexDirection="column">
                            <Typography variant="body1">Renato</Typography>
                            <Typography variant="caption">
                              CRECI: 37802
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          color="success"
                          variant="contained"
                          onClick={() =>
                            window.open(
                              `https://api.whatsapp.com/send?phone=5547999008090&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                            )
                          }
                        >
                          <WhatsappLogo size={20} weight="fill" />
                          <Typography variant="caption" ml={1}>
                            Whatsapp
                          </Typography>
                        </Button>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ borderBottom: '1px solid #eee', pb: 2 }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{ width: '50px', height: '50px' }}
                            variant="square"
                            src={rodrigoAvatar.src}
                          />
                          <Box display="flex" flexDirection="column">
                            <Typography variant="body1">Rodrigo</Typography>
                            <Typography variant="caption">
                              CRECI: 52831
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          color="success"
                          variant="contained"
                          onClick={() =>
                            window.open(
                              `https://api.whatsapp.com/send?phone=5547999990607&&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                            )
                          }
                        >
                          <WhatsappLogo size={20} weight="fill" />
                          <Typography variant="caption" ml={1}>
                            Whatsapp
                          </Typography>
                        </Button>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{ width: '50px', height: '50px' }}
                            variant="square"
                            src={jonathanAvatar.src}
                          />
                          <Box display="flex" flexDirection="column">
                            <Typography variant="body1">Jonathan</Typography>
                            <Typography variant="caption">
                              CRECI: 27584
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          color="success"
                          variant="contained"
                          onClick={() =>
                            window.open(
                              `https://api.whatsapp.com/send?phone=5547988163739&text=Olá, vim pelo site, gostaria de mais informações, do imóvel (${property.id})`,
                            )
                          }
                        >
                          <WhatsappLogo size={20} weight="fill" />
                          <Typography variant="caption" ml={1}>
                            Whatsapp
                          </Typography>
                        </Button>
                      </Box>
                    </>
                  )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  )
}

interface GetImovelId {
  ids: { id: string }[]
}

export async function getStaticPaths() {
  const response = await api.get<GetImovelId>('imovel/all')
  const imoveis = response.data.ids

  const paths = imoveis.map((item) => ({
    params: { id: item.id },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const response = await api.get(`/imovel/${params.id}`)

  return {
    props: {
      property: response.data,
    },
  }
}

export default Property
