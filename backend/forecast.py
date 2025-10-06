import pandas as pd
from prophet import Prophet

def generate_forecast(city):
    df = pd.read_json('data/weather_data.json')
    df_city = df[df['city'] == city][['date', 'temp']].rename(columns={'date': 'ds', 'temp': 'y'})
    df_city['ds'] = pd.to_datetime(df_city['ds'])
    model = Prophet(yearly_seasonality=True, weekly_seasonality=True)
    model.fit(df_city)
    future = model.make_future_dataframe(periods=7)
    forecast = model.predict(future)
    forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json(
        f'data/forecast_{city.lower().replace(" ", "_")}.json', orient='records', date_format='iso'
    )

if __name__ == "__main__":
    cities = ['New York', 'Tokyo', 'Sydney', 'London', 'Nairobi']
    for city in cities:
        generate_forecast(city)