interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

const OUTPUT_WIDTH = 1920
const OUTPUT_HEIGHT = 1080

export async function cropImage(
  imageSrc: string,
  pixelCrop: PixelCrop,
): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  canvas.width = OUTPUT_WIDTH
  canvas.height = OUTPUT_HEIGHT

  // Fundo branco para áreas fora da imagem (zoom out)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)

  // Quando a imagem é menor que o crop (zoom out), pixelCrop pode ter
  // coordenadas negativas ou dimensões maiores que a imagem.
  // Precisamos calcular a intersecção entre o crop e a imagem real.
  const sx = Math.max(pixelCrop.x, 0)
  const sy = Math.max(pixelCrop.y, 0)
  const sx2 = Math.min(pixelCrop.x + pixelCrop.width, image.naturalWidth)
  const sy2 = Math.min(pixelCrop.y + pixelCrop.height, image.naturalHeight)
  const sw = sx2 - sx
  const sh = sy2 - sy

  if (sw > 0 && sh > 0) {
    const scale = OUTPUT_WIDTH / pixelCrop.width
    const dx = (sx - pixelCrop.x) * scale
    const dy = (sy - pixelCrop.y) * scale
    const dw = sw * scale
    const dh = sh * scale

    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      0.9,
    )
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (e) => reject(e))
    img.src = src
  })
}
