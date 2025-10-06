import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WeatherCard from "@/components/WeatherCard";
import TemperatureChart from "@/components/TemperatureChart";
import WeatherMap from "@/components/WeatherMap";
import { cities, generateHistoricalData } from "@/lib/weatherData";
import { MapPin, TrendingUp } from "lucide-react";
import heroImage from "@/assets/weather-hero.jpg";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0].city);
  const historicalData = generateHistoricalData();

  const currentCity = cities.find((c) => c.city === selectedCity) || cities[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Global Weather Pattern Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Real-time weather tracking and analysis across global cities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* City Selector */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Select City
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-[300px] bg-card">
                  <SelectValue placeholder="Choose a city" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {cities.map((city) => (
                    <SelectItem key={city.city} value={city.city}>
                      {city.city}, {city.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Current Weather Highlight */}
        <div className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Current Weather - {currentCity.city}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{currentCity.temperature}°C</p>
                  <p className="text-sm text-muted-foreground mt-2">Temperature</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{currentCity.humidity}%</p>
                  <p className="text-sm text-muted-foreground mt-2">Humidity</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{currentCity.windSpeed} m/s</p>
                  <p className="text-sm text-muted-foreground mt-2">Wind Speed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{currentCity.precipitation}mm</p>
                  <p className="text-sm text-muted-foreground mt-2">Precipitation</p>
                </div>
              </div>
              <p className="text-center mt-6 text-lg text-muted-foreground">{currentCity.condition}</p>
            </CardContent>
          </Card>
        </div>

        {/* Weather Cards Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-7 w-7 text-primary" />
            Global Cities Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {cities.map((city) => (
              <WeatherCard
                key={city.city}
                data={city}
                isSelected={city.city === selectedCity}
                onClick={() => setSelectedCity(city.city)}
              />
            ))}
          </div>
        </div>

        {/* Temperature Trends Chart */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="h-6 w-6 text-primary" />
                Temperature Trends (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureChart 
                data={historicalData} 
                cities={cities.map((c) => c.city)} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6 text-primary" />
                Geospatial Weather Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherMap
                cities={cities.map((c) => ({
                  city: c.city,
                  lat: c.lat,
                  lon: c.lon,
                  temperature: c.temperature,
                  country: c.country,
                }))}
                selectedCity={selectedCity}
                onCitySelect={setSelectedCity}
              />
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl">Climate Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Temperature Analysis</h3>
              <p className="text-muted-foreground">
                Sydney shows the highest average temperature at 26°C, while London experiences the coolest conditions at 12°C. 
                Temperature variations indicate seasonal patterns typical of their respective hemispheres.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Precipitation Patterns</h3>
              <p className="text-muted-foreground">
                London leads in precipitation with 5.1mm, reflecting its maritime climate. Sydney shows minimal rainfall, 
                consistent with current seasonal patterns in the Southern Hemisphere.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Wind Speed Distribution</h3>
              <p className="text-muted-foreground">
                London experiences the strongest winds at 6.2 m/s, while Nairobi has the calmest conditions at 2.8 m/s. 
                These variations reflect local geographical and meteorological factors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
