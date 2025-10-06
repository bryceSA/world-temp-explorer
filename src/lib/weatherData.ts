// Sample weather data - will be replaced with real API data later
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  lat: number;
  lon: number;
}

export interface HistoricalData {
  date: string;
  [key: string]: number | string;
}

export const cities: WeatherData[] = [
  {
    city: "New York",
    country: "USA",
    temperature: 18,
    humidity: 65,
    windSpeed: 4.5,
    precipitation: 2.3,
    condition: "Partly Cloudy",
    lat: 40.7128,
    lon: -74.0060,
  },
  {
    city: "Tokyo",
    country: "Japan",
    temperature: 22,
    humidity: 70,
    windSpeed: 3.2,
    precipitation: 0.5,
    condition: "Clear Sky",
    lat: 35.6762,
    lon: 139.6503,
  },
  {
    city: "Sydney",
    country: "Australia",
    temperature: 26,
    humidity: 55,
    windSpeed: 5.8,
    precipitation: 0,
    condition: "Sunny",
    lat: -33.8688,
    lon: 151.2093,
  },
  {
    city: "London",
    country: "UK",
    temperature: 12,
    humidity: 80,
    windSpeed: 6.2,
    precipitation: 5.1,
    condition: "Rainy",
    lat: 51.5074,
    lon: -0.1278,
  },
  {
    city: "Nairobi",
    country: "Kenya",
    temperature: 20,
    humidity: 60,
    windSpeed: 2.8,
    precipitation: 1.2,
    condition: "Partly Cloudy",
    lat: -1.2921,
    lon: 36.8219,
  },
];

// Generate 30 days of historical temperature data
export const generateHistoricalData = (): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dataPoint: HistoricalData = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    
    cities.forEach(city => {
      // Generate slightly varying temperatures based on city's base temperature
      const variance = (Math.random() - 0.5) * 6;
      dataPoint[city.city] = Math.round((city.temperature + variance) * 10) / 10;
    });
    
    data.push(dataPoint);
  }
  
  return data;
};
