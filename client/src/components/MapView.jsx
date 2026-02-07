import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

function MapView({ complaints }) {
  return (
    <MapContainer
      center={[18.5204, 73.8567]}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
    >
      <FixMapSize />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {complaints.map((c, index) => (
        <Marker key={index} position={[c.lat, c.lng]}>
          <Popup>
            <b>{c.category}</b>
            <br />
            {c.complaint}
            <br />
            Priority: {c.priority}
            <br />
            Location: {c.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;




