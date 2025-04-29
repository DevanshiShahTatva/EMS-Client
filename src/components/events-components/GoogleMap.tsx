'use client'

import React, { useEffect, useRef, useState } from 'react'

interface GoogleMapProps {
  location: {
    lat: number
    lng: number
  }
  locationName: string
}

declare global {
  interface Window {
    initMap: () => void
    google: any
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location, locationName }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
        })

        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: locationName,
        })

        const handleClick = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const origin = `${pos.coords.latitude},${pos.coords.longitude}`
                const destination = `${location.lat},${location.lng}`
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
                window.open(mapsUrl, '_blank')
              },
              () => {
                const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
                window.open(fallbackUrl, '_blank')
              }
            )
          }
        }

        map.addListener('click', handleClick)
        marker.addListener('click', handleClick)
        setIsMapLoaded(true)
      }
    }

    // Load Google Maps script
    if (!window.google) {
      const existingScript = document.getElementById('googleMaps')
      if (!existingScript) {
        const script = document.createElement('script')
        script.id = 'googleMaps'
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
        script.async = true
        script.defer = true
        script.onload = initMap
        document.head.appendChild(script)
      } else {
        existingScript.addEventListener('load', initMap)
      }
    } else {
      initMap()
    }
  }, [location, locationName])

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow">
      {!isMapLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          Loading map...
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default GoogleMap
