import requests
import pandas as pd
import time

API_KEY = '5db23b8860fa8d29e77761edd0e4f138'  # Replace with your OpenWeatherMap API key

def get_city_coords(city):
    url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
    response = requests.get(url).json()
    return response[0]['lat'], response[0]['lon']

def fetch_historical_data(city, days=365):
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
                'precip': data.get('rain', 0)
            })
        except Exception as e:
            print(f"Error for {city}, day {day}: {e}")
        time.sleep(0.1)  # Avoid API rate limits
    return pd.DataFrame(data_list)

if __name__ == "__main__":
    cities = ['New York', 'Tokyo', 'Sydney', 'London', 'Nairobi']
    all_data = pd.concat([fetch_historical_data(city) for city in cities])
    all_data.to_json('data/weather_data.json', orient='records', date_format='iso')