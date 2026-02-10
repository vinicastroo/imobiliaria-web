"use client"

import { useState, useCallback } from 'react'
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
import { cropImage } from '@/lib/crop-image'

interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  processedCount: number
  totalCount: number
  onConfirm: (croppedBlob: Blob) => void
  onSkip: () => void
  onDismiss: () => void
}

const ASPECT_RATIO = 16 / 9
const MIN_ZOOM = 1
const MAX_ZOOM = 3

export function ImageCropModal({
  isOpen,
  imageSrc,
  processedCount,
  totalCount,
  onConfirm,
  onSkip,
  onDismiss,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const blob = await cropImage(imageSrc, croppedAreaPixels)
      onConfirm(blob)
    } finally {
      setIsProcessing(false)
      resetState()
    }
  }

  const handleSkip = () => {
    onSkip()
    resetState()
  }

  const handleDismiss = () => {
    onDismiss()
    resetState()
  }

  const resetState = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  if (!imageSrc) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleDismiss() }}>
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
            step={0.1}
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
