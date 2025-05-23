import { WeatherDetails } from "@/app/events/types";
import React from "react";

interface Props {
  data: WeatherDetails | null;
}

const WeatherReport = (props: Props) => {
  const { data } = props;

  if (data === null) {
    return <h1>No data found</h1>;
  }

  // Helper function to format time from timestamp
  const formatTime = (timestamp: any) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Weather icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-3xl text-white">
        {/* Location and Main Info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">{data.name}</h2>
            <p className="text-xl opacity-90">{data.weather[0].description}</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <img
              src={iconUrl}
              alt={data.weather[0].description}
              className="w-24 h-24"
            />
            <span className="text-6xl font-light">
              {Math.round(data.main.temp)}°C
            </span>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Feels Like</p>
            <p className="text-2xl font-semibold">
              {Math.round(data.main.feels_like)}°C
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Humidity</p>
            <p className="text-2xl font-semibold">{data.main.humidity}%</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Wind Speed</p>
            <p className="text-2xl font-semibold">{data.wind.speed} m/s</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Rain</p>
            <p className="text-2xl font-semibold">
              {data.rain?.["1h"] || 0} mm
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <SunIcon className="w-6 h-6" />
            <span>{formatTime(data.sys.sunrise)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MoonIcon className="w-6 h-6" />
            <span>{formatTime(data.sys.sunset)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudIcon className="w-6 h-6" />
            <span>{data.clouds.all}% Cloudiness</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example icons (you can use Heroicons or other icon set)
const SunIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
    />
  </svg>
);

const MoonIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const CloudIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
  </svg>
);

export default WeatherReport;
