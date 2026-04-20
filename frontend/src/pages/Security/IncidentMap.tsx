// src/pages/Security/IncidentMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icônes Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const IncidentMap: React.FC = () => {
  const position: [number, number] = [6.8276, -5.2767]; // Côte d'Ivoire

  return (
    <div className="h-[450px] w-full rounded-xl overflow-hidden shadow-md border-2 border-white">
      <MapContainer center={position} zoom={7} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>Poste Central RecensCI</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default IncidentMap;