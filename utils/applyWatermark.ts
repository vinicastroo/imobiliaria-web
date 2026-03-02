import { createImage } from './cropImage'

// Load the watermark via a same-origin proxy route so the canvas doesn't get
// tainted. Fetching the external S3/CloudFront URL directly from the browser
// fails when the bucket isn't configured to return CORS headers.
// The proxy fetches server-side (no CORS restriction) and returns the blob;
// loading it from a blob URL keeps the canvas clean.
async function loadWatermarkImage(url: string): Promise<HTMLImageElement> {
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
  const response = await fetch(proxyUrl)
  const blob = await response.blob()
  const blobUrl = URL.createObjectURL(blob)
  try {
    return await createImage(blobUrl)
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
}

export async function applyWatermarkToBlob(imageBlob: Blob, watermarkUrl: string): Promise<Blob> {
  const objectUrl = URL.createObjectURL(imageBlob)

  try {
    const [photo, watermark] = await Promise.all([
      createImage(objectUrl),
      loadWatermarkImage(watermarkUrl),
    ])

    const canvas = document.createElement('canvas')
    canvas.width = photo.naturalWidth
    canvas.height = photo.naturalHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return imageBlob

    ctx.drawImage(photo, 0, 0)

    const wmW = Math.min(photo.naturalWidth * 0.3, watermark.naturalWidth)
    const wmH = (watermark.naturalHeight / watermark.naturalWidth) * wmW
    const x = (canvas.width - wmW) / 2
    const y = (canvas.height - wmH) / 2

    ctx.globalAlpha = 0.65
    ctx.drawImage(watermark, x, y, wmW, wmH)
    ctx.globalAlpha = 1

    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob ?? imageBlob),
        'image/jpeg',
        0.9,
      )
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
