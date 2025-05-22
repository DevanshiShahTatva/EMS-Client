import { API_ROUTES } from "@/utils/constant";
import { apiCall } from "@/utils/services/request";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  lat: number;
  lng: number;
}

const WeatherReport = (props: Props) => {
  const { lng, lat } = props;

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lng]);

  const fetchWeatherData = async () => {
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      const resp = await apiCall({
        endPoint:
          API_ROUTES.USER.WEATHER_API +
          `?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
      });
      if (!resp.ok) throw new Error("Failed to fetch");
      const data = await resp.json();
      console.log("data::", data)
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return <div>WeatherReport</div>;
};

export default WeatherReport;
