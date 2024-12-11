'use client'
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const GeoJsonMap = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      const response = await fetch('/PAKGUN_RW.geojson');
      const data = await response.json();
      console.log('GeoJSON Data:', data);
      if (map) {
        map.data.addGeoJson(data);
      }
    };

    fetchGeoJSON();
  }, [map]);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
    if (mapInstance) {
      mapInstance.data.setStyle((feature) => ({
        fillColor: '#ec008c',
        strokeColor: 'red',
        strokeWeight: 1,
        fillOpacity: 0.4,
      }));
    }
  };

  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap
        zoom={14}
        center={{ lat: -6.904052, lng: 106.7291304}}
        onLoad={onLoad}
        mapContainerStyle={{
          width: '100%',
          height: '100vh',
        }}
      />
    </LoadScript>
  );
};

export default GeoJsonMap;