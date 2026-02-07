import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

/* ===== FIX LEAFLET ICON ISSUE ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* ===== FIX MAP SIZE ===== */
function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

/* ===== SAFE FIT BOUNDS (FILTER BAD DATA) ===== */
function FitBounds({ complaints }) {
  const map = useMap();

  useEffect(() => {
    const valid = complaints.filter(
      (c) => typeof c.lat === "number" && typeof c.lng === "number"
    );

    if (valid.length === 0) return;

    const bounds = valid.map((c) => [c.lat, c.lng]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [complaints, map]);

  return null;
}

function MapView({ complaints }) {
  const validComplaints = complaints.filter(
    (c) => typeof c.lat === "number" && typeof c.lng === "number"
  );

  return (
    <MapContainer
      center={[18.5204, 73.8567]}
      zoom={12}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <FixMapSize />
      <FitBounds complaints={validComplaints} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {validComplaints.map((c, index) => (
        <Marker key={index} position={[c.lat, c.lng]}>
          <Popup>
            <b>{c.category}</b>
            <br />
            {c.complaint}
            <br />
            <b>Priority:</b> {c.priority}
            <br />
            <b>Location:</b> {c.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;



