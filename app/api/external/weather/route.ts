import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached, CACHE_TTL } from "@/lib/utils/cache";
import type { WeatherData } from "@/types/api";

function generateMockWeather(city: string): WeatherData {
  const conditions = ["Sunny", "Partly Cloudy", "Clear", "Mostly Sunny", "Light Breeze"];
  const icons = ["01d", "02d", "01d", "02d", "01d"];
  const baseTemp = 18 + Math.floor(Math.random() * 10);

  return {
    current: {
      temp: baseTemp,
      description: conditions[Math.floor(Math.random() * conditions.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      humidity: 60 + Math.floor(Math.random() * 15),
      windSpeed: 10 + Math.floor(Math.random() * 5),
    },
    forecast: Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toISOString().split("T")[0],
        temp: baseTemp + Math.floor(Math.random() * 4) - 2,
        description: conditions[Math.floor(Math.random() * conditions.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
      };
    }),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const cacheKey = `weather:${city}:${lat}:${lon}`;
    const cached = getCached<WeatherData>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Use mock data if no API key
    if (!apiKey) {
      const mock = generateMockWeather(city);
      setCached(cacheKey, mock, CACHE_TTL.WEATHER);
      return NextResponse.json(mock);
    }

    let url: string;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=7`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      const mock = generateMockWeather(city);
      setCached(cacheKey, mock, CACHE_TTL.WEATHER);
      return NextResponse.json(mock);
    }

    const data = await res.json();

    let weatherData: WeatherData;

    if (data.list) {
      // Forecast response
      weatherData = {
        current: {
          temp: Math.round(data.list[0].main.temp),
          description: data.list[0].weather[0].description,
          icon: data.list[0].weather[0].icon,
          humidity: data.list[0].main.humidity,
          windSpeed: Math.round(data.list[0].wind.speed * 3.6),
        },
        forecast: data.list.slice(1).map((item: Record<string, unknown>) => {
          const main = item.main as Record<string, number>;
          const weather = (item.weather as Record<string, unknown>[])[0];
          return {
            date: String(item.dt_txt).split(" ")[0],
            temp: Math.round(main.temp),
            description: String(weather.description),
            icon: String(weather.icon),
          };
        }),
      };
    } else {
      // Current weather response
      weatherData = {
        current: {
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
        },
        forecast: [],
      };
    }

    setCached(cacheKey, weatherData, CACHE_TTL.WEATHER);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather proxy error:", error);
    const city = new URL(req.url).searchParams.get("city") || "";
    return NextResponse.json(generateMockWeather(city));
  }
}
