'use client';

import { GoogleMap, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import { useState } from 'react';

const libraries = ['places'];

const RoutePage = () => {
  const mapContainerStyle = {
    width: '100%',
    height: '100vh',
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);

  // Function to calculate directions
  const handleCalculateRoute = () => {
    if (isLoaded && window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: -6.2289237, lng: 106.9275885 }, // Example origin
          destination: { lat: -6.22812957580519, lng: 106.92744982440402 }, // Example destination
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            console.log(`Distance: ${result.routes[0].legs[0].distance.text}`);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#FFA500',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleCalculateRoute}
        >
          Calculate Route
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: -6.2289237, lng: 106.9275885 }}
        zoom={14}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#FFA500',
                strokeWeight: 8,
              },
            }}
          />
        )}
      </GoogleMap>
    </>
  );
};

export default RoutePage;
