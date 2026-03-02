"use client"

import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Crop, SkipForward } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { cropImage } from '@/lib/crop-image'
import { applyWatermarkToBlob } from '@/utils/applyWatermark'

interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  processedCount: number
  totalCount: number
  onConfirm: (croppedBlob: Blob) => void
  onSkip: () => void
  onDismiss: () => void
  applyWatermark?: boolean
  watermarkUrl?: string | null
}

const ASPECT_RATIO = 16 / 9
const MIN_ZOOM = 0.2
const MAX_ZOOM = 3

export function ImageCropModal({
  isOpen,
  imageSrc,
  processedCount,
  totalCount,
  onConfirm,
  onSkip,
  onDismiss,
  applyWatermark,
  watermarkUrl,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  // Tracks whether the dialog was closed by an explicit user action (X button)
  // vs. programmatically advancing to the next image in the queue.
  const closedByActionRef = useRef(false)

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    closedByActionRef.current = true
    setIsProcessing(true)
    try {
      let blob = await cropImage(imageSrc, croppedAreaPixels)
      if (applyWatermark && watermarkUrl) {
        blob = await applyWatermarkToBlob(blob, watermarkUrl)
      }
      onConfirm(blob)
    } catch (err) {
      console.error('Erro ao processar imagem:', err)
      toast.error('Erro ao processar imagem. Tente novamente.')
    } finally {
      setIsProcessing(false)
      resetState()
    }
  }

  const handleSkip = () => {
    closedByActionRef.current = true
    onSkip()
    resetState()
  }

  const handleDismiss = () => {
    closedByActionRef.current = true
    onDismiss()
    resetState()
  }

  const resetState = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) return
    // Only propagate the close event to the queue when the user explicitly
    // dismissed (clicked X / pressed Escape) — not when we programmatically
    // advanced to the next item (which also triggers an onOpenChange cycle).
    if (!closedByActionRef.current) {
      handleDismiss()
    }
    closedByActionRef.current = false
  }

  if (!imageSrc) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recortar imagem</DialogTitle>
          <DialogDescription>
            Ajuste o recorte para o formato 16:9. Imagem {processedCount} de{' '}
            {totalCount}.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT_RATIO}
            restrictPosition={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Zoom
          </span>
          <Slider
            value={[zoom]}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            onValueChange={(values) => setZoom(values[0])}
            className="flex-1"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isProcessing}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Pular recorte
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            <Crop className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processando...' : 'Confirmar recorte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
