export async function getLocalWeatherData(city) {
    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');

    weatherUrl.search = new URLSearchParams({
        latitude: city.latitude,
        longitude: city.longitude,
        current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
        timezone: city.timezone
    });

    const response = await fetch(weatherUrl);

    if (!response.ok) {
        throw new Error(`Unable to load weather data: ${response.status}`);
    }

    return response.json();
}

function getWeatherIcon(weatherCode)
{
    // based off the weather code, check weather-code-categories to see which icon we should display
}