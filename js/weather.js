const weatherCategories = {
    0: 'sunny',
    1: 'sunny',
    2: 'cloudy',
    3: 'cloudy',
    45: 'cloudy',
    48: 'cloudy',
    51: 'rainy',
    53: 'rainy',
    55: 'rainy',
    56: 'rainy',
    57: 'rainy',
    61: 'rainy',
    63: 'rainy',
    65: 'rainy',
    66: 'snowy',
    67: 'snowy',
    71: 'snowy',
    73: 'snowy',
    75: 'snowy',
    77: 'snowy',
    85: 'snowy',
    86: 'snowy',
    95: 'rainy',
    96: 'rainy',
    99: 'rainy'
};

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

export function getWeatherIcon(weatherCode) {
    // based off the weather code, check weather-code-categories to see which icon we should display
    const weatherCategory = weatherCategories[weatherCode];

    if (!weatherCategory) {
        return null;
    }

    return new URL(`../assets/weather/${weatherCategory.category}.svg`, import.meta.url).href;
}
