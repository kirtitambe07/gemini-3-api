import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapView({ complaints }) {
  return (
    <MapContainer
      center={[18.5204, 73.8567]}   // Pune default
      zoom={12}
      style={{ height: "400px", borderRadius: "16px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {complaints.map((c, index) => (
        <Marker key={index} position={[c.lat, c.lng]}>
          <Popup>
            <b>{c.category}</b>
            <br />
            {c.complaint}
            <br />
            Priority: {c.priority}
            <br />
            Area: {c.area}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
