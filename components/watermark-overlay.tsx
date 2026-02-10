interface WatermarkOverlayProps {
  watermarkUrl: string
}

export function WatermarkOverlay({ watermarkUrl }: WatermarkOverlayProps) {
  return (
    <img
      src={watermarkUrl}
      alt=""
      aria-hidden
      className="absolute inset-0 m-auto max-w-[30%] max-h-[30%] object-contain opacity-50 pointer-events-none z-10"
    />
  )
}
