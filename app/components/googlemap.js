// components/GoogleMap.js
import { GoogleMap, Marker, useLoadScript, Circle } from '@react-google-maps/api';

const libraries = ['places']; // Define libraries outside the component

const GoogleMapComponent = ({ center, markerPosition, onMarkerDragEnd, sampleFAT, onLoad }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '100vh',
  };

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Handle loading error
  if (loadError) return <div>Error loading maps</div>;
  
  // Wait until the script is loaded
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={17}
      onLoad={onLoad}
      onClick={onMarkerDragEnd}
    >
      <Marker
        position={markerPosition}
        draggable={true}
        onDragEnd={onMarkerDragEnd}
      />

      {sampleFAT.map((i, idx) => (
        <Circle key={idx} center={i} radius={100} options={{ strokeColor: 'red', fillColor: 'red', fillOpacity: 0.05 }} />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
