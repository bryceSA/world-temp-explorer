export interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  precip: number;
  lat: number;
  lon: number;
}

export interface ForecastData {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}