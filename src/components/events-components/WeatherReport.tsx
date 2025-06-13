import React, { useEffect, useState } from "react";
import {
  SunIcon,
  EyeDropperIcon,
  WindowIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  BoltIcon,
  SparklesIcon,
  Bars3BottomLeftIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import { API_ROUTES } from "@/utils/constant";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  lat: number;
  lng: number;
};

const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
)

const WeatherReport = (props: Props) => {
  const { lat, lng } = props;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (lat && lng) {
      fetchWeatherData(lat, lng);
    }
  }, []);

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const apiKey =
        process.env.REACT_APP_OPENWEATHER_API_KEY ||
        "d1871bd0599d1966396475295187f1e3";
      const endPoint =
        API_ROUTES.USER.WEATHER_API +
        `?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
      const resp = await axios.get(endPoint, { withCredentials: false });
      if (resp.data) {
        const dailyForecasts = processForecastData(resp.data.list);
        setData({
          current: resp.data.list[0],
          city: resp.data.city,
          daily: dailyForecasts,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const processForecastData = (forecasts: any[]) => {
    const dailyData: Record<string, any> = {};

    forecasts.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temps: [],
          weathers: [],
          timeStamps: [],
          icons: [],
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].icons.push(item.weather[0].icon);
      dailyData[date].weathers.push(item.weather[0].main);
      dailyData[date].timeStamps.push(item.dt_txt);
    });

    return Object.values(dailyData)
      .map((day) => {
        const latestWeather = day.weathers[day.weathers.length - 1];
        const icon = day.icons[day.icons.length - 1];
        return {
          date: day.date,
          minTemp: Math.min(...day.temps),
          maxTemp: Math.max(...day.temps),
          weather: latestWeather,
          icon: icon,
          forecasts: day.timeStamps.map((ts: string, i: number) => ({
            time: ts.split(" ")[1],
            icon: day.icons[i],
            temp: day.temps[i],
            weather: day.weathers[i],
          })),
        };
      })
      .slice(0, 7);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getWeatherIcon = (weather: string) => {
    const condition = weather.toLowerCase();

    if (condition.includes("clear"))
      return <SunIcon className="w-8 h-8 text-yellow-500 mx-auto" />;

    if (condition.includes("cloud"))
      return <CloudIcon className="w-8 h-8 text-gray-400 mx-auto" />;

    if (condition.includes("rain"))
      return <Bars3BottomLeftIcon className="w-8 h-8 text-blue-500 mx-auto" />;

    if (condition.includes("thunder"))
      return <BoltIcon className="w-8 h-8 text-yellow-700 mx-auto" />;

    if (condition.includes("snow"))
      return <SparklesIcon className="w-8 h-8 text-blue-300 mx-auto" />;

    if (
      condition.includes("mist") ||
      condition.includes("haze") ||
      condition.includes("fog")
    )
      return <CloudIcon className="w-8 h-8 text-gray-300 mx-auto" />;

    return <SunIcon className="w-8 h-8 text-yellow-500 mx-auto" />;
  };

  if (loading) {
    return <SkeletonBox className="w-full h-96" />;
  }

  if (!data) {
    return (
      <div className="text-center py-24">
        <h1>No data found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 w-full max-w-7xl">
        {/* Enhanced Left Section */}
        <div className="col-span-1 relative bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-400 p-6 sm:p-8 flex flex-col justify-between text-gray-800 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-100/30 -mt-12 -mr-12 sm:-mt-16 sm:-mr-16"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-amber-100/20 -mb-20 -ml-20 sm:-mb-24 sm:-ml-24"></div>

          {/* Weather pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="20" cy="30" r="2" fill="currentColor" />
              <circle cx="40" cy="15" r="1.5" fill="currentColor" />
              <circle cx="70" cy="25" r="1.8" fill="currentColor" />
              <circle cx="85" cy="40" r="2.2" fill="currentColor" />
              <circle cx="60" cy="50" r="1.7" fill="currentColor" />
              <circle cx="30" cy="65" r="2.5" fill="currentColor" />
              <circle cx="50" cy="75" r="1.5" fill="currentColor" />
              <circle cx="75" cy="65" r="2" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Location and Date */}
            <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">
                {data.city.name}, {data.city.country}
              </h1>
              <p className="text-gray-700">
                {formatDate(data.current.dt_txt.split(" ")[0])}
              </p>
            </div>

            {/* Weather Visualization */}
            <div className="flex-grow flex flex-col items-center justify-center py-4">
              <div className="relative mb-10">
              <div className="absolute -inset-3 sm:-inset-4 bg-amber-100 rounded-full animate-pulse opacity-30"></div>
                <img
                  src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`}
                  alt={data.current.weather[0].description}
                  className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-lg"
                />
              </div>

              <div className="text-center">
                <div className="text-5xl sm:text-7xl font-bold mb-2 relative inline-block">
                  {Math.round(data.current.main.temp)}°
                  <span className="absolute top-0 -right-4 sm:-right-6 text-lg sm:text-2xl">C</span>
                </div>
                <p className="text-lg sm:text-xl font-medium capitalize text-gray-700">
                  {data.current.weather[0].description}
                </p>
              </div>
            </div>

            {/* Temperature Range */}
            <div className="mb-6">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                <span>
                  Feels like {Math.round(data.current.main.feels_like)}°
                </span>
                <span>Humidity {data.current.main.humidity}%</span>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"
                  style={{
                    width: `${(data.current.main.temp / 40) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs sm:text-sm text-gray-600">
                <span>0°</span>
                <span>20°</span>
                <span>40°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forecast + Highlights */}
        <div className="col-span-2 p-6 sm:p-8 space-y-8 bg-white">
          <div>
            <h3 className="text-xl font-semibold mb-4">Week Forecast</h3>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4 text-center">
              {data.daily.map((day: any, index: number) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 rounded-xl bg-gray-50 shadow-sm"
                >
                  <p className="font-medium mb-1 text-sm sm:text-base">{formatDate(day.date)}</p>
                  {getWeatherIcon(day.weather)}
                  <p className="text-xs sm:text-sm mt-1">
                    {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Section */}
          <div>
            <h3 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Today's Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Feels Like */}
              <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-xs sm:text-sm opacity-70 mb-1">Feels Like</p>
                <p className="text-lg sm:text-xl font-bold">
                  {Math.round(data.current.main.feels_like)}°C
                </p>
              </div>

              {/* Humidity */}
              <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                <EyeDropperIcon className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <p className="text-sm opacity-70 mb-1">Humidity</p>
                <p className="text-xl font-bold">
                  {data.current.main.humidity}%
                </p>
              </div>

              {/* Wind */}
              <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                <WindowIcon className="w-6 h-6 mx-auto text-green-500 mb-2" />
                <p className="text-sm opacity-70 mb-1">Wind</p>
                <p className="text-xl font-bold">
                  {data.current.wind.speed} m/s
                </p>
              </div>

              {/* Pressure */}
              <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                <ArrowTrendingUpIcon className="w-6 h-6 mx-auto text-purple-500 mb-2" />
                <p className="text-sm opacity-70 mb-1">Pressure</p>
                <p className="text-xl font-bold">
                  {data.current.main.pressure} hPa
                </p>
              </div>

              {/* Visibility */}
              <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                <EyeIcon className="w-6 h-6 mx-auto text-cyan-500 mb-2" />
                <p className="text-sm opacity-70 mb-1">Visibility</p>
                <p className="text-xl font-bold">{data.current.visibility}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherReport;
