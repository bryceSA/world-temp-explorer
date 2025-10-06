import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
}

interface WeatherCardProps {
  data: WeatherData;
  isSelected?: boolean;
  onClick?: () => void;
}

const WeatherCard = ({ data, isSelected, onClick }: WeatherCardProps) => {
  const getTempColor = (temp: number) => {
    if (temp >= 25) return "text-accent";
    if (temp <= 10) return "text-cool";
    return "text-neutral";
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary shadow-elevated" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{data.city}</span>
          <span className="text-sm text-muted-foreground">{data.country}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className={`h-5 w-5 ${getTempColor(data.temperature)}`} />
            <span className={`text-3xl font-bold ${getTempColor(data.temperature)}`}>
              {data.temperature}°C
            </span>
          </div>
          <Cloud className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <p className="text-sm text-muted-foreground">{data.condition}</p>
        
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="flex flex-col items-center">
            <Droplets className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Humidity</span>
            <span className="text-sm font-semibold">{data.humidity}%</span>
          </div>
          <div className="flex flex-col items-center">
            <Wind className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Wind</span>
            <span className="text-sm font-semibold">{data.windSpeed} m/s</span>
          </div>
          <div className="flex flex-col items-center">
            <Droplets className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Rain</span>
            <span className="text-sm font-semibold">{data.precipitation}mm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
