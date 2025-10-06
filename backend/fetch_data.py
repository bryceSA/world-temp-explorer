import requests
import pandas as pd
import time
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('OPENWEATHER_API_KEY')
if not API_KEY:
    raise ValueError("OPENWEATHER_API_KEY not found in .env file")

def get_city_coords(city):
    url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
    response = requests.get(url).json()
    return response[0]['lat'], response[0]['lon']

def fetch_historical_data(city, days=30):  # Reduced to 30 days to avoid API limits
    lat, lon = get_city_coords(city)
    data_list = []
    for day in range(days):
        timestamp = int(time.time()) - (day * 86400)
        url = f"https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={timestamp}&appid={API_KEY}&units=metric"
        try:
            response = requests.get(url).json()
            data = response['data'][0]
            data_list.append({
                'date': pd.to_datetime(timestamp, unit='s'),
                'city': city,
                'temp': data['temp'],
                'humidity': data['humidity'],
                'precip': data.get('rain', {}).get('1h', 0)
            })
        except Exception as e:
            print(f"Error for {city}, day {day}: {e}")
        time.sleep(0.1)  # Avoid API rate limits
    return pd.DataFrame(data_list)

def fetch_forecast_data(city, days=7):
    lat, lon = get_city_coords(city)
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={API_KEY}"
    try:
        response = requests.get(url).json()
        forecast_list = []
        for i, item in enumerate(response['list'][:days*8]):  # 3-hourly data, take first 7 days
            if i % 8 == 0:  # Take daily data (every 8th entry, ~24h)
                forecast_list.append({
                    'ds': pd.to_datetime(item['dt'], unit='s').strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'yhat': item['main']['temp']
                })
        pd.DataFrame(forecast_list).to_json(f'data/forecast_{city.lower().replace(" ", "_")}.json', orient='records')
    except Exception as e:
        print(f"Error fetching forecast for {city}: {e}")

if __name__ == "__main__":
    cities = ['New York', 'Tokyo', 'Sydney', 'London', 'Nairobi']
    # Fetch historical data
    all_data = pd.concat([fetch_historical_data(city) for city in cities])
    all_data.to_json('data/weather_data.json', orient='records', date_format='iso')
    # Fetch forecast data
    for city in cities:
        fetch_forecast_data(city)