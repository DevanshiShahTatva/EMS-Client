import React from "react";

interface Props {
  data: any | null;
}

const WeatherReport = (props: Props) => {
  const { data } = props;

  if (data === null) {
    return (
      <div className="text-center py-24">
        <h1>No data found</h1>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-12 rounded-2xl mt-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full text-white">
        {/* Current Weather Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">
              {formatDate(data.current.dt_txt.split(" ")[0])}
            </h2>
            <p className="text-xl opacity-90 capitalize">
              {data.city.name}
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <img
              src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
              alt={data.current.weather[0].description}
              className="w-24 h-24"
            />
            <span className="text-6xl font-light">
              {Math.round(data.current.main.temp)}°C
            </span>
          </div>
        </div>

        {/* Current Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Feels Like</p>
            <p className="text-2xl font-semibold">
              {Math.round(data.current.main.feels_like)}°C
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Humidity</p>
            <p className="text-2xl font-semibold">
              {data.current.main.humidity}%
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Wind Speed</p>
            <p className="text-2xl font-semibold">
              {data.current.wind.speed} m/s
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <p className="text-sm opacity-80 mb-1">Pressure</p>
            <p className="text-2xl font-semibold">
              {data.current.main.pressure} hPa
            </p>
          </div>
        </div>

        {/* Daily Forecast Section */}
        <h3 className="text-2xl font-bold mb-4">4-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {data.daily.map((day: any, index: number) => (
            <div key={index} className="bg-white/10 p-4 rounded-xl text-center">
              <p className="font-semibold mb-2">{formatDate(day.date)}</p>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.weather}
                className="w-16 h-16 mx-auto mb-2"
              />
              <div className="flex justify-center space-x-4">
                <div>
                  <p className="text-sm opacity-80">High</p>
                  <p className="text-xl font-semibold">
                    {Math.round(day.maxTemp)}°C
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Low</p>
                  <p className="text-xl font-semibold">
                    {Math.round(day.minTemp)}°C
                  </p>
                </div>
              </div>
              <p className="mt-2 capitalize">{day.weather}</p>
            </div>
          ))}
        </div>

        {/* Hourly Forecast Section */}
        <h3 className="text-2xl font-bold mb-4">Today's Forecast</h3>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {data.daily[0].forecasts.map((hour: any, index: number) => (
            <div
              key={index}
              className=" bg-white/10 p-4 rounded-xl text-center min-w-[150px] flex-wrap"
            >
              <p className="font-semibold mb-2">{hour.time.substring(0, 5)}</p>
              <img
                src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                alt={hour.weather}
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-xl font-semibold">{Math.round(hour.temp)}°C</p>
              <p className="mt-1 text-sm capitalize">{hour.weather}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherReport;
