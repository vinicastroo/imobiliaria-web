import {
  Backdrop,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import Link from "next/link";
import { Bathtub, Bed, Car, Ruler, Toilet } from "phosphor-react";
import { MenubarHome } from "@/components/MenubarHome";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import api from "@/services/api";
import Head from "next/head";
import { useRouter } from "next/router";
import { z, infer as Infer } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps } from "next";
import logo from "@/assets/logo-auros-minimalist.svg";
import Image from "next/image";
import { BiArea } from "react-icons/bi";
import { LiaRulerCombinedSolid } from "react-icons/lia";
import CircularProgress from "@mui/material/CircularProgress";
import square from "@/assets/square.svg";
import Footer from "@/components/Footer";
interface TypeProperty {
  id: string;
  createdAt: string;
  description: string;
  checked: boolean;
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

interface CityProps {
  city: string;
}

interface NeighborhoodProps {
  neighborhood: string;
}

function Filter({
  types,
  cities,
  initialNeighborhood,
  setProperties,
  setLoading,
  page,
  setTotal,
}: {
  types: TypeProperty[];
  cities: CityProps[];
  page: number;
  initialNeighborhood: NeighborhoodProps[];
  setProperties: Dispatch<SetStateAction<Property[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setTotal: Dispatch<SetStateAction<number>>;
}) {
  const [neighborhoods, setNeighborhood] =
    useState<NeighborhoodProps[]>(initialNeighborhood);

  const router = useRouter();

  const {
    tipoImovel,
    cidade,
    bairro,
    quartos,
    banheiros,
    suites,
    garagem,
    areaTotal,
    areaTerreno,
  } = router.query;

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
  });
  type SchemaQuestion = Infer<typeof createSchema>;

  const { watch, handleSubmit, reset, control } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  });

  const city = watch("city");

  const loadNeighboorhood = useCallback(async () => {
    if (city) {
      const response = await api.get<NeighborhoodProps[]>(
        `/imovel/bairro/${city}`
      );
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
      setLoading(true);
      const responseImoveis = await api.get(`/imovel`, {
        params: {
          type: data.type !== "undefined" ? data.type : undefined,
          city: data.city !== "undefined" ? data.city : undefined,
          neighborhood:
            data.neighborhood !== "undefined" ? data.neighborhood : undefined,
          bedrooms: data.bedrooms ? data.bedrooms : undefined,
          bathrooms: data.bathrooms ? data.bathrooms : undefined,
          suites: data.suites ? data.suites : undefined,
          parkingSpots: data.parkingSpots ? data.parkingSpots : undefined,
          totalArea: data.totalArea ? data.totalArea : undefined,
          privateArea: data.privateArea ? data.privateArea : undefined,
          page,
          pageSize: 12,
        },
      });

      router.replace(
        `/imoveis?${
          data.type !== "undefined" ? `tipoImovel=${data.type}&` : ""
        }${data.city !== "undefined" ? `cidade=${data.city}&` : ""}${
          data.neighborhood !== "undefined"
            ? `bairro=${data.neighborhood}&`
            : ""
        }${data.bedrooms ? `quartos=${data.bedrooms}&` : ""}${
          data.bathrooms ? `banheiros=${data.bathrooms}&` : ""
        }${data.suites ? `suites=${data.suites}&` : ""} ${
          data.parkingSpots ? `garagem=${data.parkingSpots}&` : ""
        }${data.totalArea ? `areaTotal=${data.totalArea}&` : ""}${
          data.privateArea ? `areaTerreno=${data.privateArea}&` : ""
        }`
      );
      setProperties([...responseImoveis.data.properties]);
      setTotal(responseImoveis.data.totalPages);
      setLoading(false);
    },
    [page, setProperties, setTotal, setLoading, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        variant="outlined"
        sx={{ display: "flex", flexDirection: "column", p: 2 }}
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
            );
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
            );
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
            );
          }}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="body1" color="rgba(0, 0, 0, 0.6)">
            Características do imóvel:
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
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
                  defaultValue={quartos}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
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
                  defaultValue={suites}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Toilet size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="bathrooms"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Nº Banheiros"
                  size="small"
                  fullWidth
                  defaultValue={banheiros}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Car size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="parkingSpots"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Nº Estacionamento"
                  size="small"
                  fullWidth
                  defaultValue={garagem}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Ruler size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="totalArea"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Area do imóvel"
                  size="small"
                  fullWidth
                  defaultValue={areaTotal}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Ruler size={18} weight="bold" color="rgba(0, 0, 0, 0.6)" />

            <Controller
              name="privateArea"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Area do terreno"
                  fullWidth
                  size="small"
                  defaultValue={areaTerreno}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
              router.replace("/imoveis", undefined, { shallow: true });
              reset({
                city: "",
                type: "",
                neighborhood: "",
                bathrooms: "",
                bedrooms: "",
                parkingSpots: "",
                privateArea: "",
                suites: "",
                totalArea: "",
              });
            }}
          >
            Limpar Filtros
          </Button>
        </Box>
      </Card>
    </form>
  );
}

function Properties({
  properties,
  totalSize,
  page,
  setPage,
  setLoading,
  setProperties,
  types,
  cities,
  initialNeighborhood,
  setTotal,
}: {
  properties: Property[];
  totalSize: number;
  page: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setProperties: Dispatch<SetStateAction<Property[]>>;
  types: TypeProperty[];
  cities: CityProps[];
  initialNeighborhood: NeighborhoodProps[];
  setTotal: Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();
  const {
    tipoImovel,
    cidade,
    bairro,
    quartos,
    banheiros,
    suites,
    garagem,
    areaTotal,
    areaTerreno,
  } = router.query;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    loadProperties(value);
  };

  const loadProperties = useCallback(
    async (page: number) => {
      const responseImoveis = await api.get(`/imovel`, {
        params: {
          type: tipoImovel !== "undefined" ? tipoImovel : undefined,
          city: cidade !== "undefined" ? cidade : undefined,
          neighborhood: bairro !== "undefined" ? bairro : undefined,
          bedrooms: quartos || undefined,
          bathrooms: banheiros || undefined,
          suites: suites || undefined,
          parkingSpots: garagem || undefined,
          totalArea: areaTotal || undefined,
          privateArea: areaTerreno || undefined,
          page,
          pageSize: 12,
        },
      });
      if (responseImoveis) {
        setProperties([...responseImoveis.data.properties]);
      }
    },
    [
      areaTerreno,
      areaTotal,
      bairro,
      banheiros,
      cidade,
      garagem,
      quartos,
      setProperties,
      suites,
      tipoImovel,
    ]
  );
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        p: 2,
        zIndex: 999,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body2" color="#333" fontWeight="bold">
          {`${properties.length}  ${
            properties.length === 1
              ? "Imóvel encontrado"
              : "Imóveis encontrados"
          }`}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item md={3} sm={12} xs={12}>
          <Filter
            page={page}
            types={types}
            cities={cities}
            initialNeighborhood={initialNeighborhood}
            setTotal={setTotal}
            setLoading={setLoading}
            setProperties={setProperties}
          />
        </Grid>
        <Grid item md={9} sm={12} xs={12}>
          <Grid container spacing={2}>
            {properties.map((property) => (
              <Grid
                key={property.id}
                item
                md={4}
                sm={12}
                xs={12}
                sx={{ a: { textDecoration: "none" } }}
              >
                <Link href={`/imoveis/${property.id}`} target="_blank">
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      position: "relative",
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
                          <Typography variant="caption">
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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
                                display: "flex",
                                alignItems: "center",
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

                        <Box sx={{ display: "flex", gap: 1, my: 0.5 }}>
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
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
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {page >= 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalSize}
            page={page}
            onChange={handleChange}
            shape="rounded"
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const {
    tipoImovel,
    cidade,
    bairro,
    quartos,
    banheiros,
    suites,
    garagem,
    areaTotal,
    areaTerreno,
  } = context.query;

  const responseImoveis = await api.get(`/imovel?visible=true`, {
    params: {
      type: tipoImovel,
      city: cidade,
      neighborhood: bairro,
      bedrooms: quartos,
      bathrooms: banheiros,
      suites,
      parkingSpots: garagem,
      totalArea: areaTotal,
      privateArea: areaTerreno,
      page: 1,
      pageSize: 12,
    },
  });
  const responseTipo = await api.get<TypeProperty[]>(`/tipo-imovel`);
  const responseCities = await api.get<CityProps[]>(`/imovel/cidades`);

  const responseNeighborhood = await api.get<NeighborhoodProps[]>(
    `/imovel/bairro/${cidade}`
  );

  return {
    props: {
      properties: responseImoveis.data.properties,
      totalPropertiesSize: Math.round(responseImoveis.data.totalPages / 12),
      types: responseTipo.data,
      cities: responseCities.data,
      neighborhoods: responseNeighborhood.data,
    },
  };
};

export const revalidate = 3600; // revalidate every hour

export default function Home({
  properties: initialProperties,
  types,
  cities,
  neighborhoods,
  totalPropertiesSize,
}: {
  properties: Property[];
  types: TypeProperty[];
  cities: CityProps[];
  totalPropertiesSize: number;
  neighborhoods: NeighborhoodProps[];
}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(totalPropertiesSize);
  const [page, setPage] = useState(1);

  return (
    <>
      <Head>
        <title>Auros | Imóveis</title>
      </Head>
      <Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            position: "relative",
            backgroundColor: "#fff",
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
          <MenubarHome />
          <Properties
            page={page}
            setPage={setPage}
            totalSize={total}
            properties={properties}
            setProperties={setProperties}
            setLoading={setLoading}
            types={types}
            cities={cities}
            initialNeighborhood={neighborhoods}
            setTotal={setTotal}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }} />
      <Footer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
