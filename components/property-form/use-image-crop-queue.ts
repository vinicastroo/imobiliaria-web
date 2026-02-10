"use client"

import { useState, useCallback, useRef } from 'react'
import type { ImageItem } from './types'

interface QueueItem {
  file: File
  previewUrl: string
}

let imageIdCounter = 0
function generateImageId() {
  return `img-${Date.now()}-${++imageIdCounter}`
}

export function useImageCropQueue(
  images: ImageItem[],
  onImagesChange: (images: ImageItem[]) => void,
) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const previewUrlsRef = useRef<string[]>([])
  const pendingImagesRef = useRef<ImageItem[]>([])

  const totalInBatch = useRef(0)

  const currentItem = queue.length > 0 ? queue[currentIndex] : null
  const isOpen = currentItem !== null

  const enqueueFiles = useCallback((files: File[]) => {
    const items: QueueItem[] = files.map((file) => {
      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.push(previewUrl)
      return { file, previewUrl }
    })

    pendingImagesRef.current = []
    totalInBatch.current = items.length
    setCurrentIndex(0)
    setQueue(items)
  }, [])

  const processedCount = currentIndex + 1

  const advanceOrFinish = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex < queue.length) {
      setCurrentIndex(nextIndex)
    } else {
      onImagesChange([...images, ...pendingImagesRef.current])
      pendingImagesRef.current = []
      setQueue([])
      setCurrentIndex(0)
    }
  }, [currentIndex, queue.length, images, onImagesChange])

  const confirmCrop = useCallback(
    (croppedBlob: Blob) => {
      if (!currentItem) return

      const croppedFile = new File([croppedBlob], currentItem.file.name, {
        type: 'image/jpeg',
      })
      const croppedPreview = URL.createObjectURL(croppedFile)
      previewUrlsRef.current.push(croppedPreview)

      pendingImagesRef.current.push({
        type: 'new',
        id: generateImageId(),
        file: croppedFile,
        preview: croppedPreview,
      })

      advanceOrFinish()
    },
    [currentItem, advanceOrFinish],
  )

  const skipCrop = useCallback(() => {
    if (!currentItem) return

    pendingImagesRef.current.push({
      type: 'new',
      id: generateImageId(),
      file: currentItem.file,
      preview: currentItem.previewUrl,
    })

    advanceOrFinish()
  }, [currentItem, advanceOrFinish])

  const dismissCrop = useCallback(() => {
    if (!currentItem) return

    URL.revokeObjectURL(currentItem.previewUrl)
    advanceOrFinish()
  }, [currentItem, advanceOrFinish])

  const revokeAllPreviews = useCallback(() => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrlsRef.current = []
  }, [])

  return {
    isOpen,
    currentItem,
    processedCount,
    totalCount: totalInBatch.current,
    enqueueFiles,
    confirmCrop,
    skipCrop,
    dismissCrop,
    revokeAllPreviews,
  }
}
