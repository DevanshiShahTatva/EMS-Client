import React, { useEffect, useRef, createElement } from 'react'
interface GoogleMapProps {
  location: {
    lat: number
    lng: number
  }
  locationName: string
}
const GoogleMap: React.FC<GoogleMapProps> = ({ location, locationName }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  useEffect(() => {
    // Load the Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`
    script.async = true
    script.defer = true
    // Define the callback function
    window.initMap = function () {
      if (mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
        })
        new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          title: locationName,
        })
      }
    }
    document.head.appendChild(script)
    return () => {
      // Clean up
      document.head.removeChild(script)
    }
  }, [location, locationName])
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
          <p className="text-xs text-gray-400 mt-2">
            Note: To use Google Maps, please add your API key
          </p>
        </div>
      </div>
    </div>
  )
}
// Add this to make TypeScript happy with the global window object
declare global {
  interface Window {
    initMap: () => void
    google: any
  }
}
export default GoogleMap
