import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { WeatherData, ForecastData } from './types/weather';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const API_KEY = import.meta.env.VITE_API_KEY;
const CITIES = ['New York', 'Tokyo', 'Sydney', 'London', 'Nairobi'];
const REPO_BASE = 'https://raw.githubusercontent.com/bryceSA/world-temp-explorer/main';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  // Fetch real-time weather
  useEffect(() => {
    const fetchWeather = async () => {
      const cacheKey = 'weatherCache';
      const cacheTimeKey = 'weatherCacheTime';
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
        setWeatherData(JSON.parse(cached));
        return;
      }
      const dataPromises = CITIES.map(async (city) => {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        if (!geoData[0]) throw new Error(`No geo data for ${city}`);
        const { lat, lon } = geoData[0];
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const weatherRes = await fetch(weatherUrl);
        const weather = await weatherRes.json();
        return { city, temp: weather.main.temp, humidity: weather.main.humidity, precip: weather.rain?.['1h'] || 0, lat, lon };
      });
      const data = await Promise.all(dataPromises);
      setWeatherData(data);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
    };
    if (API_KEY) fetchWeather().catch(err => console.error('Fetch error:', err));
  }, []);

  // Fetch historical and forecast data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const histRes = await fetch(`${REPO_BASE}/data/weather_data.json`);
        const histData = await histRes.json();
        setHistoricalData(histData);
        const forecastRes = await fetch(`${REPO_BASE}/data/forecast_${selectedCity.toLowerCase().replace(' ', '_')}.json`);
        const fcData = await forecastRes.json();
        setForecastData(fcData);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };
    fetchData();
  }, [selectedCity]);

  // Chart data for temperature comparison
  const chartData = {
    labels: weatherData.map(d => d.city),
    datasets: [{
      label: 'Temperature (°C)',
      data: weatherData.map(d => d.temp),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  const selectedWeather = weatherData.find(d => d.city === selectedCity);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Global Weather Dashboard</h1>
        <div className="mb-6">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Current Weather - {selectedCity}</CardTitle></CardHeader>
            <CardContent>
              {selectedWeather && (
                <>
                  <p>Temperature: {selectedWeather.temp}°C</p>
                  <p>Humidity: {selectedWeather.humidity}%</p>
                  <p>Precipitation: {selectedWeather.precip} mm</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Temperature Comparison</CardTitle></CardHeader>
            <CardContent><Bar data={chartData} options={{ responsive: true }} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Weather Map</CardTitle></CardHeader>
            <CardContent>
              <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {weatherData.map(d => (
                  <Marker key={d.city} position={[d.lat, d.lon]}>
                    <Popup>{d.city}: {d.temp}°C</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>7-Day Forecast</CardTitle></CardHeader>
            <CardContent>
              {forecastData.length > 0 && (
                <Bar
                  data={{
                    labels: forecastData.slice(-7).map(d => new Date(d.ds).toLocaleDateString()),
                    datasets: [{ label: 'Forecasted Temp (°C)', data: forecastData.slice(-7).map(d => d.yhat), backgroundColor: 'rgba(153, 102, 255, 0.6)' }],
                  }}
                  options={{ responsive: true }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;