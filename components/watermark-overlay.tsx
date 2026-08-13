interface WatermarkOverlayProps {
  watermarkUrl: string
}

export function WatermarkOverlay({ watermarkUrl }: WatermarkOverlayProps) {
  return (
    <img
      src={watermarkUrl}
      alt=""
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 m-auto max-h-[30%] max-w-[30%] object-contain opacity-50"
    />
  )
}
