// src/pages/Security/IncidentMap.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiService } from "../../services/apiService";

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

const MOCK_INCIDENTS = [
  { id: 1, type: 'ACCIDENT', severity: 'GRAVE', latitude: 6.8276, longitude: -5.2767, status: 'OUVERT' },
];

const IncidentMap: React.FC = () => {
  const center: [number, number] = [6.8276, -5.2767];
  const [incidents, setIncidents] = useState<any[]>(MOCK_INCIDENTS);

  useEffect(() => {
    apiService.get<any[]>('/security/map').then((data) => {
      if (data && data.length > 0) setIncidents(data);
    }).catch(() => {
      // Fall back to mock data
    });
  }, []);

  return (
    <div className="h-[450px] w-full rounded-xl overflow-hidden shadow-md border-2 border-white">
      <MapContainer center={center} zoom={7} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {incidents.map((incident) => (
          <Marker key={incident.id} position={[incident.latitude, incident.longitude]}>
            <Popup>{incident.type} — {incident.severity} — {incident.status}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;