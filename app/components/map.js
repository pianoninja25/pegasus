'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const Map = () => {

  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation && navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: -6.2178649,
            lng: 106.8293705,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // You can set a default position here if needed
          setPosition({ lat: -6.2178649, lng: 106.8293705 }); 
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Set a default position if Geolocation is not supported
      setPosition({ lat: -6.2178649, lng: 106.8293705 }); 
    }
  }, []);


  return (
    <div className="h-screen w-screen">
      <MapContainer
        center={[-6.2178649, 106.8293705]}
        zoom={20}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[-6.2178649, 106.8293705]}
          draggable={true}
        >
          <Popup>Your Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
