"use client"

import { FilePond, registerPlugin } from 'react-filepond'
import type { FilePondFile, FilePondInitialFile } from 'filepond'

// Importação dos estilos do FilePond
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Importação dos Plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginFileValidateType
)

interface MultiFileInputProps {
  files: FilePondFile[]
  onUpdateFiles: (files: FilePondFile[]) => void
  label?: string
}

export function MultiFileInput({ files, onUpdateFiles, label }: MultiFileInputProps) {
  return (
    <div className="filepond-grid-wrapper w-full">
      <style jsx global>{`
        /* Remove a margem padrão inferior */
        .filepond-grid-wrapper .filepond--root {
          margin-bottom: 0;
        }

        /* Mobile: 1 item por linha (100%) */
        .filepond-grid-wrapper .filepond--item {
          width: 100%;
        }

        /* Tablet (sm/md): 2 itens por linha */
        @media (min-width: 640px) {
          .filepond-grid-wrapper .filepond--item {
            width: calc(50% - 0.5em) !important;
          }
        }

        /* Desktop (lg): 3 itens por linha */
        @media (min-width: 1024px) {
          .filepond-grid-wrapper .filepond--item {
            width: calc(33.33% - 0.5em) !important;
          }
        }
        
        /* Ajustes visuais para ficar igual à Imagem 1 */
        .filepond-grid-wrapper .filepond--label-action {
            text-decoration: none;
            font-weight: 600;
        }
      `}</style>

      <FilePond
        files={files as unknown as FilePondInitialFile[]}
        onupdatefiles={onUpdateFiles}
        allowMultiple={true}
        allowReorder={true}
        name="files"
        labelIdle={label || 'Arraste fotos ou <span class="filepond--label-action">Navegue</span>'}
        acceptedFileTypes={['image/*']}
        labelFileTypeNotAllowed="Tipo de arquivo não permitido"

        /* Props para garantir o visual de "Card" quadrado */
        stylePanelLayout="compact"
        imagePreviewHeight={160}
        imageCropAspectRatio="16:9"

        styleLoadIndicatorPosition="center-bottom"
        styleProgressIndicatorPosition="right-bottom"
        styleButtonProcessItemPosition="right-bottom"

        server={{
          process: async (fieldName, file, metadata, load, error, progress, abort) => {
            const formData = new FormData();
            formData.append(fieldName, file);

            try {
              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                error("Erro ao enviar");
                return;
              }

              const data = await res.json();
              load(data.fileId);
            } catch (err) {
              error("Erro de conexão");
            }
          },
        }}
      />
    </div>
  )
}