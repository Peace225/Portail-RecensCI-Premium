// src/backoffice/MapZone.tsx
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const MapZone = () => {
  const position: [number, number] = [5.36, -4.00]; // Coordonnées d'Abidjan

  return (
    <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
      <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Carte style Dark/Cyber
          attribution='&copy; OpenStreetMap contributors'
        />
        <Circle 
          center={position} 
          pathOptions={{ fillColor: '#8b5cf6', color: '#8b5cf6' }} 
          radius={5000} 
        >
          <Popup>Zone A : Forte activité de recensement</Popup>
        </Circle>
      </MapContainer>
    </div>
  );
};