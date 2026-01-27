"use client"

// 1. Importe o Circle
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import { memo, useState } from 'react'

interface PropertyGoogleMapProps {
  lat: number
  lng: number
  popupText?: string
  radius?: number // 2. Nova prop opcional para o tamanho do raio em metros
}

const containerStyle = {
  width: '100%',
  height: '100%'
}

// Opções visuais do Círculo (Usei a cor #17375F da sua marca)
const circleOptions = {
  strokeColor: '#17375F',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#17375F',
  fillOpacity: 0.20, // 20% de opacidade para ver o mapa embaixo
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1
}

function PropertyGoogleMap({ lat, lng, popupText, radius = 0 }: PropertyGoogleMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    language: 'pt-BR',
    region: 'BR'
  })

  const [map, setMap] = useState(null)

  const onLoad = (map: google.maps.Map) => {
    setMap(map)
  }

  const onUnmount = () => {
    setMap(null)
  }

  if (!isLoaded) {
    return (
      <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">
        Carregando mapa...
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Mantém o Pin (Marker) */}
        <Marker
          position={{ lat, lng }}
          title={popupText}
          
        />

        {/* 3. Renderiza o Círculo se houver raio > 0 */}
        {radius > 0 && (
          <Circle
            center={{ lat, lng }}
            radius={radius} // Raio em metros
            options={circleOptions}
          />
        )}
      </GoogleMap>
    </div>
  )
}

export default memo(PropertyGoogleMap)