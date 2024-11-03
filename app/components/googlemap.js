import { GoogleMap } from '@react-google-maps/api';

const GoogleMaps = () => {
  const containerStyle = {
    width: '100%',
    height: '100vh',
  };

  const center = {
    lat: -6.877660,
    lng: 106.776413,
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
    >
      {/* Additional map elements go here */}
    </GoogleMap>
  );
};

export default GoogleMaps;
