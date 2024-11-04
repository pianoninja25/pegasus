// components/GoogleMap.js
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React from 'react';

const GoogleMapComponent = () => {
  const mapContainerStyle = {
    width: '100%',
    height: '100vh',
  };

  const center = {
    lat: -6.200000,
    lng: 106.816666,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={18}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
