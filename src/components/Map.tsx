import { MapContainer, Marker, TileLayer, Circle, useMapEvents } from "react-leaflet"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface MapProps {
  position: [number, number]
  zoom: number
  radius: number
}

// Component to handle map clicks and manage both marker and circle position
function LocationMarkerAndCircle({ 
  initialPosition, 
  radius 
}: { 
  initialPosition: [number, number]
  radius: number 
}) {
  const [position, setPosition] = useState<[number, number]>(initialPosition)

  const map = useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng]
      setPosition(newPosition)
      
      // Zoom in and center on the clicked location
      map.flyTo(newPosition, map.getZoom(), {
        animate: true,
        duration: 1 // Animation duration in seconds
      })    
    },
  })
  
  useEffect(() => {
    setPosition(initialPosition);
    if (map) {
      map.flyTo(initialPosition, map.getZoom(), {
        animate: true,
        duration: 1 // Animation duration in seconds
      });
    }
  }, [initialPosition, map]);

  // Convert miles to meters for Leaflet Circle component
  const radiusInMeters = radius * 1609.34;

  return (
    <>
      <Circle 
        center={position} 
        pathOptions={{ fillColor: 'none', color: 'red', weight: 4, opacity: 1, fillOpacity: 0.0 }} 
        radius={radiusInMeters} 
      />
      <Marker position={position} />
    </>
  )
}

export default function MyMap({ position: initialPosition, zoom, radius }: MapProps) {
  return (
    <MapContainer 
      center={initialPosition} 
      zoom={zoom} 
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarkerAndCircle initialPosition={initialPosition} radius={radius} />
    </MapContainer>
  )
}