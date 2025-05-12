"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { API_ROUTES } from "@/utils/constant";
import { apiCall } from "@/utils/services/request";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

const MapView = () => {
  const [L, setL] = useState<typeof import("leaflet")>();
  const [locationData, setLocationData] = useState<
    { lat: number; lng: number; city: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      const markerIcon2x = (
        await import("leaflet/dist/images/marker-icon-2x.png")
      ).default;
      const markerIcon = (await import("leaflet/dist/images/marker-icon.png"))
        .default;
      const markerShadow = (
        await import("leaflet/dist/images/marker-shadow.png")
      ).default;

      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });

      setL(leaflet);
    })();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const endpoint = `${API_ROUTES.ADMIN.GET_ALL_USERS}`;
        const response = await apiCall({ endPoint: endpoint, method: "GET" });
        const responseData = response?.data
          .filter(
            (item: { latitude: number; longitude: number }) =>
              item.latitude && item.longitude
          )
          .map((item: { latitude: number; longitude: number; city: string }) => ({
            lat: item.latitude || 0,
            lng: item.longitude || 0,
            city: item.city || "",
          }));
        setLocationData(responseData);
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err);
      }
    };

    fetchUsersData();
  }, []);

  const groupedLocations = groupLocations(locationData);

  if (!L) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {groupedLocations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Popup>
            <div>
              City: {location.city}<br />
              Location: [{location.lat}, {location.lng}]<br />
              Count: {location.count}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;

const groupLocations = (data: { lat: number; lng: number; city: string }[]) => {
    const map = new Map<string, { count: number; city: string }>();
  
    data.forEach(({ lat, lng, city }) => {
      const key = `${lat},${lng}`;
      if (map.has(key)) {
        map.get(key)!.count += 1;
      } else {
        map.set(key, { count: 1, city });
      }
    });

    const sortedMap = new Map([...map.entries()].sort((a, b) => b[1].count - a[1].count));
  
    return [...sortedMap.entries()].map(([key, { count, city }]) => {
      const [lat, lng] = key.split(",").map(Number);
      return { lat, lng, count, city };
    });
  };
  
