/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menubar } from '@/components/Menubar'
import { Bed, Car, Ruler, Toilet, Door } from 'phosphor-react'

import { Content, EditorStyled, FilePondStyled } from './styles'

import Container from '@/components/Container'
import {
  Button,
  Card,
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Backdrop,
  IconButton,
} from '@mui/material'

import { forwardRef, useCallback, useEffect, useState } from 'react'
import { BackLink } from '@/components/BackLink'
import api from '@/services/api'
import brasilAPi from '@/services/brasilAPi'
import Head from 'next/head'
import MenuBar from '@/components/MenuEditor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Controller, useForm } from 'react-hook-form'

import { registerPlugin } from 'react-filepond'

import 'filepond/dist/filepond.min.css'

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
// import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { z, infer as Infer } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'
import DeleteIcon from '@mui/icons-material/Delete'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  // FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
)
interface TypeProperty {
  id: string
  createdAt: string
  description: string
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
    fileName: string
  }[]
}

export default function EditarImoveis() {
  const [property, setProperty] = useState<Property>()
  const [types, setTypes] = useState<TypeProperty[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const createSchema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }),
    value: z.string({ required_error: 'Valor é obrigatório' }),
    summary: z.string({ required_error: 'Resumo é obrigatório' }),
    type_id: z.string({ required_error: 'Tipo do imóvel é obrigatório' }),
    description: z.string({ required_error: 'Descrição é obrigatório' }),
    bedrooms: z.string(),
    bathrooms: z.string(),
    suites: z.string(),
    parkingSpots: z.string(),
    totalArea: z.string(),
    privateArea: z.string(),
    cep: z.string({ required_error: 'CEP é obrigatório' }),
    state: z.string({ required_error: 'Estado é obrigatório' }),
    city: z.string({ required_error: 'Cidade é obrigatório' }),
    neighborhood: z.string({ required_error: 'Bairro é obrigatório' }),
    street: z.string({ required_error: 'Rua é obrigatório' }),
    number: z.string().optional(),
    latitude: z.string({ required_error: 'Latitude é obrigatório' }),
    longitude: z.string({ required_error: 'Longitude é obrigatório' }),
  })
  type SchemaQuestion = Infer<typeof createSchema>

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
    defaultValues: property,
  })

  const router = useRouter()
  const { status } = useSession()
  const { id } = router.query
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
    onBlur({ editor }) {
      setValue('description', editor.getHTML())
    },
  })

  const loadProperty = useCallback(async () => {
    if (id) {
      const response = await api.get(`/imovel/${id}`)

      if (response && editor) {
        setProperty(response.data)
        editor.commands.setContent(response.data.description)
        setValue('description', response.data.description)
      }
    }
  }, [id, setValue, editor])

  useEffect(() => {
    loadProperty()
  }, [loadProperty])

  const loadTypes = useCallback(async () => {
    const response = await api.get<TypeProperty[]>(`/tipo-imovel`)
    if (response) {
      setTypes([...response.data])
    }
  }, [])

  useEffect(() => {
    loadTypes()
  }, [loadTypes])

  const onFileChange = (files: any) => {
    const newFiles = files.map((fileItem: any) => fileItem.file)

    setFiles(newFiles)
  }

  const onSubmit = async (data: SchemaQuestion) => {
    setLoading(true)

    if (property) {
      try {
        // if (files.length === 0) {
        //   toast.error('Para continuar precisar ter ao menos uma imagem')
        //   return
        // }

        const paths = await Promise.all(
          files.map(async (fileItem) => {
            const formData = new FormData()
            formData.append('files', fileItem)
            const responseFile = await api.post('/files/upload', formData, {
              headers: {
                'Content-Type': `multipart/form-data`,
              },
            })
            return responseFile.data.paths[0]
          }),
        )

        if (paths) {
          const response = await api.put(`/imovel/${property.id}`, {
            ...data,
            files: paths,
          })

          if (response) {
            setLoading(false)
            toast.success('Imóvel alterado com sucesso')
            router.push('/admin/imoveis/')
          }
        }
      } catch (e) {
        setLoading(false)
        console.error(e)
      }
    }
  }

  const cep = watch('cep')

  useEffect(() => {
    async function loadByCEP() {
      if (cep && cep.length >= 8) {
        await brasilAPi.get(`/api/cep/v2/${cep}`).then((response) => {
          setValue('city', response.data.city)
          setValue('neighborhood', response.data.neighborhood)
          setValue('state', response.data.state)
          setValue('street', response.data.street)
          setValue('latitude', response.data.location.coordinates.latitude)
          setValue('longitude', response.data.location.coordinates.longitude)
        })
      }
    }

    loadByCEP()
  }, [cep, setValue])

  useEffect(() => {
    if (property) {
      setValue('type_id', property.type_property.id)
    }
  }, [property, setValue])

  const NumericFormatWithRef = forwardRef((props, ref) => (
    <NumericFormat
      {...props}
      customInput={TextField}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale={true}
      allowNegative={false}
      prefix="R$"
      required
      fullWidth
      size="small"
      inputRef={ref}
      error={Boolean(errors.value)}
      helperText={errors.value?.message}
      placeholder="Digite o valor"
      label="Valor"
    />
  ))
  NumericFormatWithRef.displayName = 'NumericFormatWithRef'

  const handleDeleteImg = useCallback(
    async (fileName: string) => {
      if (fileName) {
        await api.post('/files/delete-images', {
          fileName,
        })
      }

      loadProperty()
    },
    [loadProperty],
  )

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Head>
        <title>Auros | Edição de Imóvel</title>
      </Head>

      <Menubar />

      <Content>
        {property && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <BackLink href="/admin/imoveis" />
            <Typography variant="h6" color="primary">
              Edição de Imóvel
            </Typography>

            <Grid container mt={2} spacing={2}>
              <Grid item md={8}>
                <Card
                  variant="outlined"
                  sx={{ display: 'flex', flexDirection: 'column', p: 3 }}
                >
                  <Typography variant="body2">Imagens</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    {property.files.map((file) => (
                      <Box key={file.id} sx={{ position: 'relative' }}>
                        <Image src={file.path} alt="" width={80} height={80} />

                        <IconButton
                          onClick={() => handleDeleteImg(file.fileName)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: '#fff',
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, maxHeight: '400px' }}>
                    {/* <Typography variant="caption">
                      * Ao cadastrar novas imagens, as atuais serão apagadas
                    </Typography> */}
                    <FilePondStyled
                      allowMultiple={true}
                      allowReorder={true}
                      allowImageCrop={true}
                      // allowFileSizeValidation={true}
                      allowFileTypeValidation={true}
                      imageCropAspectRatio="16:9"
                      onupdatefiles={onFileChange}
                      onreorderfiles={onFileChange}
                      labelFileTypeNotAllowed="Tipo de arquivo não permitido"
                      files={files}
                      // maxFileSize="3.5mb"
                      // labelMaxFileSize="O tamanho maximo toltal dos arquivos permitido é de 5MB"
                      acceptedFileTypes={['image/*']}
                      server={null} // Não usar a opção de servidor interno do FilePond, pois estamos enviando para um backend personalizado
                      labelIdle='Arraste e solte seus arquivos ou <span class="filepond--label-action">Navegue</span>'
                    />
                  </Box>
                </Card>
                <Card variant="outlined" sx={{ p: 3, mt: 2 }}>
                  {/* <FileInput onFileSelect={handleFileSelect} /> */}

                  <Typography variant="body2">Dados Gerais</Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={property.name}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          label="Nome"
                          required
                          size="small"
                          error={Boolean(errors.name)}
                          helperText={errors.name?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Controller
                      name="value"
                      control={control}
                      defaultValue={property.value}
                      render={({ field }) => (
                        <NumericFormatWithRef {...field} />
                      )}
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Tipo Imóvel
                      </InputLabel>
                      <Select
                        error={Boolean(errors.type_id)}
                        labelId="select-type_id"
                        required
                        defaultValue={property.type_property.id}
                        label="Tipo Imóvel"
                        {...register('type_id')}
                      >
                        <MenuItem>Selecione</MenuItem>
                        {types.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.description}
                          </MenuItem>
                        ))}
                      </Select>

                      {Boolean(errors.type_id) && (
                        <FormHelperText error>
                          {errors.type_id?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Controller
                      name="summary"
                      control={control}
                      defaultValue={property.summary}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Resumo"
                          size="small"
                          fullWidth
                          multiline
                          minRows={2}
                          required
                          inputProps={{ maxLength: 255 }}
                          error={Boolean(errors.summary)}
                          helperText={errors.summary?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />
                  </Box>

                  <Box
                    sx={{
                      border: errors.description
                        ? '1px solid red'
                        : '1px solid #c7c7c7',
                      mt: 2,
                    }}
                  >
                    <MenuBar editor={editor} />
                    <EditorStyled editor={editor} />
                  </Box>
                  {Boolean(errors.description) && (
                    <FormHelperText error>
                      {errors.description?.message}
                    </FormHelperText>
                  )}
                </Card>
              </Grid>

              <Grid item md={4}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="body2">Características</Typography>

                  <Grid container spacing={2} mt={2}>
                    <Grid item md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Door
                          size={18}
                          weight="bold"
                          color="rgba(0, 0, 0, 0.6)"
                        />

                        <TextField
                          id="input-with-sx"
                          label="Nº Quartos"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={property.bedrooms}
                          {...register('bedrooms')}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Toilet
                          size={18}
                          weight="bold"
                          color="rgba(0, 0, 0, 0.6)"
                        />

                        <TextField
                          id="input-with-sx"
                          label="Nº banheiros"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={property.bathrooms}
                          {...register('bathrooms')}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Bed
                          size={18}
                          weight="bold"
                          color="rgba(0, 0, 0, 0.6)"
                        />

                        <TextField
                          id="input-with-sx"
                          label="Nº suites"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={property.suites}
                          {...register('suites')}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Car
                          size={18}
                          weight="bold"
                          color="rgba(0, 0, 0, 0.6)"
                        />

                        <TextField
                          id="input-with-sx"
                          label="Nº garagem"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={property.parkingSpots}
                          {...register('parkingSpots')}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Ruler
                          size={18}
                          weight="bold"
                          color="rgba(0, 0, 0, 0.6)"
                        />

                        <TextField
                          id="input-with-sx"
                          label="Area do imóvel"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={property.totalArea}
                          {...register('totalArea')}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Ruler
                          size={18}
                          weight="bold"
                          color="rgba(0, 0, 0, 0.6)"
                        />

                        <TextField
                          id="input-with-sx"
                          label="Area do terreno"
                          variant="outlined"
                          size="small"
                          type="number"
                          defaultValue={property.privateArea}
                          {...register('privateArea')}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                <Card variant="outlined" sx={{ p: 3, mt: 2 }}>
                  <Typography variant="body2">Endereço</Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Controller
                      name="cep"
                      control={control}
                      defaultValue={property.cep}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="CEP"
                          required
                          fullWidth
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.cep)}
                          helperText={errors.cep?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="state"
                      control={control}
                      defaultValue={property.state}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Estado"
                          fullWidth
                          size="small"
                          required
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.state)}
                          helperText={errors.state?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="city"
                      control={control}
                      defaultValue={property.city}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Cidade"
                          fullWidth
                          required
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.city)}
                          helperText={errors.city?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Controller
                      name="neighborhood"
                      control={control}
                      defaultValue={property.neighborhood}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Bairro"
                          size="small"
                          required
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.neighborhood)}
                          helperText={errors.neighborhood?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="street"
                      control={control}
                      defaultValue={property.street}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Rua"
                          fullWidth
                          size="small"
                          required
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.street)}
                          helperText={errors.street?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="number"
                      control={control}
                      defaultValue={property.numberAddress}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Número"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.number)}
                          helperText={errors.number?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Controller
                      name="latitude"
                      control={control}
                      defaultValue={property.latitude}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Latitude"
                          fullWidth
                          required
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.latitude)}
                          helperText={errors.latitude?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="longitude"
                      control={control}
                      defaultValue={property.longitude}
                      render={({ field: { ref, ...field } }) => (
                        <TextField
                          label="Longitude"
                          required
                          fullWidth
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.longitude)}
                          helperText={errors.longitude?.message}
                          inputRef={ref}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="contained" sx={{ mt: 2 }} type="submit">
                Salvar
              </Button>
            </Box>
          </form>
        )}
      </Content>
    </Container>
  )
}
