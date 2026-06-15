"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet + Next.js
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapController({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({ 
  center, 
  zoom, 
  places
}: { 
  center: {lat: number, lng: number}, 
  zoom: number, 
  places: { id?: string; lat: number; lng: number; name: string; address: string }[]
}) {
  return (
    <>
      <style>{`
        .leaflet-container {
          min-height: 75vh !important;
          border-radius: 1.5rem;
          filter: contrast(1.1) saturate(1.2);
        }
      `}</style>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ height: '100%', minHeight: '75vh', width: '100%', zIndex: 0 }}
        zoomControl={true}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} zoom={zoom} />
      
      {places.map((loc, i) => (
        <Marker key={loc.id || i} position={[loc.lat, loc.lng]}>
          <Popup>
            <div className="font-bold text-sm text-slate-800">{loc.name}</div>
            <div className="text-xs text-slate-500">{loc.address}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </>
  );
}
