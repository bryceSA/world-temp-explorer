import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CityLocation {
  city: string;
  lat: number;
  lon: number;
  temperature: number;
  country: string;
}

interface WeatherMapProps {
  cities: CityLocation[];
  selectedCity?: string;
  onCitySelect?: (city: string) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapContent({ cities, onCitySelect }: { cities: CityLocation[], onCitySelect?: (city: string) => void, center: [number, number] }) {
  const getTempColor = (temp: number) => {
    if (temp >= 25) return "#f97316";
    if (temp <= 10) return "#0ea5e9";
    return "#6b7280";
  };

  return (
    <>
      {/* @ts-ignore - React-Leaflet types issue */}
      <TileLayer
        // @ts-ignore - React-Leaflet types issue
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cities.map((city) => {
        const markerIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background-color: ${getTempColor(city.temperature)};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: white;
              font-size: 12px;
            ">
              ${Math.round(city.temperature)}°
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        return (
          <Marker
            key={city.city}
            // @ts-ignore - React-Leaflet types issue
            position={[city.lat, city.lon]}
            // @ts-ignore - React-Leaflet types issue
            icon={markerIcon}
            eventHandlers={{
              click: () => onCitySelect?.(city.city),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{city.city}</h3>
                <p className="text-sm text-muted-foreground">{city.country}</p>
                <p className="text-xl font-bold mt-2" style={{ color: getTempColor(city.temperature) }}>
                  {city.temperature}°C
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

const WeatherMap = ({ cities, selectedCity, onCitySelect }: WeatherMapProps) => {
  const selected = cities.find((c) => c.city === selectedCity);
  const center: [number, number] = selected ? [selected.lat, selected.lon] : [20, 0];

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-md">
      <MapContainer
        // @ts-ignore - React-Leaflet types issue
        center={center}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <ChangeView center={center} />
        <MapContent cities={cities} onCitySelect={onCitySelect} center={center} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
