export interface Note {
  id: string;
  tripId: string;
  stopId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: {
    date: string;
    temp: number;
    description: string;
    icon: string;
  }[];
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
}

export interface UnsplashImage {
  id: string;
  url: string;
  thumbUrl: string;
  blurHash: string | null;
  alt: string;
  credit: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
