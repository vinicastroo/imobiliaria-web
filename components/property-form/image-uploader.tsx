"use client"

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Upload, X, Star, GripVertical, Download } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ImageItem } from './types'
import { useImageCropQueue } from './use-image-crop-queue'
import { ImageCropModal } from './image-crop-modal'

interface ImageUploaderProps {
  images: ImageItem[]
  onImagesChange: (images: ImageItem[]) => void
  onDeleteExisting?: (fileName: string) => Promise<void>
  onSetThumb?: (fileId: string) => Promise<void>
}

function getImageId(item: ImageItem) {
  return item.id
}

function getImageSrc(item: ImageItem) {
  return item.type === 'existing' ? item.path : item.preview
}

async function downloadImage(item: ImageItem) {
  const src = item.type === 'existing' ? item.path : item.preview
  const fileName =
    item.type === 'existing' ? item.fileName : item.file.name

  try {
    const response = await fetch(src)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    window.open(src, '_blank')
  }
}

function SortableImageItem({
  item,
  index,
  onRemove,
  onSetCover,
}: {
  item: ImageItem
  index: number
  onRemove: () => void
  onSetCover: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getImageId(item) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isCover = index === 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group aspect-square rounded-lg overflow-hidden border bg-gray-100',
        isDragging && 'opacity-50 z-50',
        isCover && 'ring-2 ring-yellow-400',
      )}
    >
      <Image
        src={getImageSrc(item)}
        alt={`Imagem ${index + 1}`}
        fill
        className="object-cover"
      />

      {isCover && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          Capa
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reordenar</TooltipContent>
        </Tooltip>

        {!isCover && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 hover:bg-yellow-500 hover:text-white"
                onClick={onSetCover}
              >
                <Star size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Definir como capa</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 hover:bg-blue-500 hover:text-white"
              onClick={() => downloadImage(item)}
            >
              <Download size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Baixar imagem</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={onRemove}
            >
              <X size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remover</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export function ImageUploader({
  images,
  onImagesChange,
  onDeleteExisting,
  onSetThumb,
}: ImageUploaderProps) {
  const {
    isOpen,
    currentItem,
    processedCount,
    totalCount,
    enqueueFiles,
    confirmCrop,
    skipCrop,
    dismissCrop,
  } = useImageCropQueue(images, onImagesChange)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      enqueueFiles(acceptedFiles)
    },
    [enqueueFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => getImageId(img) === active.id)
    const newIndex = images.findIndex((img) => getImageId(img) === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex)
    onImagesChange(reordered)

    if (onSetThumb && newIndex === 0) {
      const movedItem = reordered[0]
      if (movedItem.type === 'existing') {
        onSetThumb(movedItem.id)
      }
    }
  }

  const handleRemove = async (index: number) => {
    const item = images[index]
    if (item.type === 'existing' && onDeleteExisting) {
      await onDeleteExisting(item.fileName)
    }
    if (item.type === 'new') {
      URL.revokeObjectURL(item.preview)
    }
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleSetCover = (index: number) => {
    const reordered = arrayMove(images, index, 0)
    onImagesChange(reordered)

    const item = reordered[0]
    if (item.type === 'existing' && onSetThumb) {
      onSetThumb(item.id)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-[#17375F] bg-blue-50/50'
            : 'border-gray-300 hover:border-gray-400',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Solte as imagens aqui...'
            : 'Arraste imagens aqui ou clique para selecionar'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
      </div>

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map(getImageId)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((item, index) => (
                <SortableImageItem
                  key={getImageId(item)}
                  item={item}
                  index={index}
                  onRemove={() => handleRemove(index)}
                  onSetCover={() => handleSetCover(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          A primeira imagem da lista será a capa. Arraste para reordenar.
        </p>
      )}

      <ImageCropModal
        isOpen={isOpen}
        imageSrc={currentItem?.previewUrl ?? null}
        processedCount={processedCount}
        totalCount={totalCount}
        onConfirm={confirmCrop}
        onSkip={skipCrop}
        onDismiss={dismissCrop}
      />
    </div>
  )
}
