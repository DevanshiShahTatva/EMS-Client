'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import { useMapEvent } from 'react-leaflet';
interface OpenStreetMapProps {
  location: {
    lat: number;
    lng: number;
  };
  locationName: string;
}

const GoogleMap: React.FC<OpenStreetMapProps> = ({ location, locationName }) => {
  
  const MapClickHandler = () => {
    useMapEvent('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const origin = `${position.coords.latitude},${position.coords.longitude}`;
            const destination = `${location.lat},${location.lng}`;
            const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin};${destination}`;
            window.open(url, '_blank');
          },
          () => {
            alert('Unable to fetch your current location');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser');
      }
    });
    return null;
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow relative z-40">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>{locationName}</Popup>
        </Marker>
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default GoogleMap;
