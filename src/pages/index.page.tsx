/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Backdrop,
} from "@mui/material";
import bg from "@/assets/background.jpg";
import logo from "@/assets/logo-auros-minimalist.svg";

import square from "@/assets/square.svg";
import cityBackground from "@/assets/city-background.svg";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Car,
  FacebookLogo,
  InstagramLogo,
  Toilet,
  WhatsappLogo,
  Bathtub,
} from "phosphor-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import api from "@/services/api";
import { useForm } from "react-hook-form";
import { z, infer as Infer } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Search } from "@mui/icons-material";
import { BiArea } from "react-icons/bi";
import { LiaRulerCombinedSolid } from "react-icons/lia";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "@/components/Footer";
interface TypeProperty {
  id: string;
  createdAt: string;
  description: string;
}

interface CityProps {
  city: string;
}

interface NeighborhoodProps {
  neighborhood: string;
}

interface Property {
  id: string;
  name: string;
  summary: string;
  description: string;
  value: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpots: string;
  suites: string;
  totalArea: string;
  privateArea: string;
  createdAt: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  numberAddress: string;
  longitude: string;
  latitude: string;
  type_property: {
    id: string;
    description: string;
    createdAt: string;
  };
  files: {
    id: string;
    path: string;
  }[];
}

function BannerHome({
  types,
  cities,
}: {
  types: TypeProperty[];
  cities: CityProps[];
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [neighborhoods, setNeighborhood] = useState<NeighborhoodProps[]>([]);

  const createSchema = z.object({
    type_id: z.string(),
    neighborhood: z.string(),
    city: z.string(),
  });
  type SchemaQuestion = Infer<typeof createSchema>;
  const router = useRouter();

  const { register, watch, handleSubmit } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  });

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

  const city = watch("city");

  const loadNeighboorhood = useCallback(async () => {
    if (city) {
      const response = await api.get(`/imovel/bairro/${city}`);
      if (response) {
        setNeighborhood([...response.data]);
      }
    }
  }, [city]);

  useEffect(() => {
    loadNeighboorhood();
  }, [loadNeighboorhood]);

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      router.push(
        `/imoveis?${data.type_id ? `tipoImovel=${data.type_id}&` : ""}${
          data.city ? `cidade=${data.city}&` : ""
        }${data.neighborhood ? `bairro=${data.neighborhood}` : ""}`
      );
    },
    [router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          backgroundSize: "cover",
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "-80px",
          p: 2,
        }}
      >
        <Box>
          <Image
            src={bg}
            alt=""
            height={950}
            quality={100}
            style={{
              position: "absolute",
              zIndex: -1,
              top: 0,
              left: 0,
              height: "100vh",
              width: "100%",
              backgroundSize: "cover",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            py: 1,
            gap: 2,
            flexDirection: { xs: "column", sm: "column", md: "row" },
            px: { xs: 2, sm: 1, md: 0 },
            a: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              display: "flex",
              gap: 3,
              a: { color: "white", textDecoration: "none" },
              "a:hover": { opacity: 0.7 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Link href="https://api.whatsapp.com/send?phone=5547988163739">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WhatsappLogo size={20} weight="fill" />
                </Box>
              </Link>

              <Link href="https://www.instagram.com/auroscorretoraimobiliaria/">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InstagramLogo size={20} weight="fill" />
                </Box>
              </Link>

              <Link href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              margin: "auto 0",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            <Typography
              variant={isSmallScreen ? "h5" : "h3"}
              textAlign="center"
              color="#fff"
            >
              Assim como o ouro é valioso, seu novo lar será um tesouro
              inestimável
            </Typography>

            <Card
              variant="outlined"
              sx={{
                p: 3,
                width: "100%",

                background: {
                  md: "rgba(255, 255, 255,0.1)",
                },
                boxShadow: {
                  md: "0 1px 30px rgba(0, 0, 0, 0.5)",
                },
                backdropFilter: {
                  md: "blur(3px)",
                },
                "-webkit-backdrop-filter": {
                  md: "blur(3px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                }}
                gap={3}
              >
                <FormControl
                  sx={{ background: "#fff", borderRadius: 1 }}
                  size={isSmallScreen ? "small" : "medium"}
                  fullWidth
                >
                  <InputLabel id="neightboor-select-label">
                    Tipo Imóvel
                  </InputLabel>
                  <Select
                    // error={Boolean(errors.type_id)}
                    labelId="neightboor-select-label"
                    label="Tipo Imóvel"
                    {...register("type_id")}
                  >
                    <MenuItem>Selecione</MenuItem>
                    {types.map((type) => (
                      <MenuItem key={type.id} value={type.description}>
                        {type.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  size={isSmallScreen ? "small" : "medium"}
                  sx={{ background: "#fff", borderRadius: 1 }}
                  fullWidth
                >
                  <InputLabel id="neightboor-select-label">Cidade</InputLabel>
                  <Select
                    // error={Boolean(errors.type_id)}
                    labelId="neightboor-select-label"
                    label="Cidade"
                    {...register("city")}
                  >
                    <MenuItem>Selecione</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.city} value={city.city}>
                        {city.city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  size={isSmallScreen ? "small" : "medium"}
                  sx={{ background: "#fff", borderRadius: 1 }}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-label">Bairro</InputLabel>
                  <Select
                    // error={Boolean(errors.type_id)}
                    label="Bairro"
                    {...register("neighborhood")}
                  >
                    <MenuItem>Selecione</MenuItem>
                    {neighborhoods.map((neighborhood) => (
                      <MenuItem
                        key={neighborhood.neighborhood}
                        value={neighborhood.neighborhood}
                      >
                        {neighborhood.neighborhood}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* {Boolean(errors.type_id) && (
                        <FormHelperText error>
                          {errors.type_id?.message}
                        </FormHelperText>
                      )} */}
                </FormControl>
                <Button
                  variant="contained"
                  sx={{
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  color="primary"
                  size={isSmallScreen ? "medium" : "large"}
                  type="submit"
                  fullWidth
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
  );
}

function Recent({
  properties,
}: {
  properties: Property[];
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        p: 2,
        background: "#fafafa",
        backgroundImage: { md: `url(${square.src}), url(${square.src})` },
        backgroundPosition: {
          xs: "170% 0%,-70% 100%",
          sm: "170% 0%,-70% 100%",
          md: "110% 0%, -10% 100%",
        },

        backgroundSize: "auto, auto",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      {properties.length > 0 && (
        <>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Typography variant="h5" color="#000">
              Propriedades
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Recentes
            </Typography>
          </Box>

          <Grid
            container
            sx={{
              maxWidth: "1200px",
            }}
            spacing={2}
          >
            {properties.map((property) => (
              <Grid
                key={property.id}
                item
                md={4}
                sm={12}
                xs={12}
                sx={{
                  a: {
                    textDecoration: "none",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  },
                }}
              >
                <Link href={`/imoveis/${property.id}`} target="_blank">
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
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
                          height: "250px",
                          background: "#17375F",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image src={logo} alt="logo" width={120} height={120} />
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          px: 2,
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            py: 1,
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="#333"
                            fontWeight="bold"
                          >
                            {property.name}
                          </Typography>
                          <Typography variant="body2">
                            {property.city} - {property.neighborhood}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {property.summary}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          width: "100%",
                          p: 2,
                          overflowX: "auto",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ color: "#17375F" }}
                          >
                            {property.value}
                          </Typography>

                          <Chip
                            label="Venda"
                            color="primary"
                            sx={{ fontWeight: "600" }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>

          <Link href="/imoveis">
            <Button variant="outlined" size="large" sx={{ mt: 4 }}>
              Ver todos
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
}

function Contact() {
  const createSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    description: z.string(),
  });
  type SchemaQuestion = Infer<typeof createSchema>;

  const { register, handleSubmit, reset } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  });

  const onSubmit = useCallback(
    async (data: SchemaQuestion) => {
      try {
        await api.post("/clientes", data);
        toast.success("contato enviado com sucesso");
        reset();
      } catch (e) {
        console.error(e);
        toast.error("Ocorreu um erro ao enviar seu contato");
      }
    },
    [reset]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        id="contact"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: { xs: 600, sm: 600, md: 700 },
          p: 2,
          position: "relative",
          background: "linear-gradient(#fafafa, #D0DEF8)",
        }}
      >
        <Box
          sx={{
            background: `url(${cityBackground.src})`,
            backgroundPosition: "50% 95%",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: 3,
            mt: 4,
            maxWidth: "544px",
            width: "100%",
            zIndex: 999,
          }}
        >
          <Typography variant="h6" textAlign="center">
            Entre em contato
          </Typography>

          <TextField label="Nome" size="small" required {...register("name")} />
          <TextField label="Email" size="small" {...register("email")} />
          <TextField
            label="Telefone"
            size="small"
            required
            {...register("phone")}
          />

          <TextField
            label="Observação"
            multiline
            minRows={3}
            inputProps={{ maxLength: 255 }}
            size="small"
            required
            {...register("description")}
          />

          <Button variant="contained" sx={{ py: 1 }} type="submit">
            Enviar Contato
          </Button>
        </Card>
      </Box>
    </form>
  );
}

export const revalidate = 3600;

export default function Home() {
  const [types, setTypes] = useState<TypeProperty[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCities = useCallback(async () => {
    setLoading(true);
    const responseCities = await api.get<CityProps[]>(`/imovel/cidades`);

    setLoading(false);
    if (responseCities) {
      setCities([...responseCities.data]);
    }
  }, []);

  const loadTypes = useCallback(async () => {
    setLoading(true);
    const responseTipo = await api.get<TypeProperty[]>(`/tipo-imovel`);
    setLoading(false);
    if (responseTipo) {
      setTypes([...responseTipo.data]);
    }
  }, []);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    const responseImoveis = await api.get(`/imovel?limit=6&visible=true`);
    setLoading(false);
    if (responseImoveis) {
      setProperties([...responseImoveis.data.properties]);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  return (
    <>
      <Head>
        <title>
          Auros Corretora Imobiliária - Encontre o Imóvel Ideal em Rio do Sul e
          Balneário Camboriú
        </title>
      </Head>

      <Box>
        <BannerHome cities={cities} types={types} setLoading={setLoading} />
        <Recent properties={properties} setLoading={setLoading} />
        <Contact />
        <Footer />
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
