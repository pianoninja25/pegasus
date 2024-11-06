'use client';

import { useEffect, useState, useRef } from 'react';

import LocationToggle from '../../components/toggle2';
import GoogleMaps from '../../components/googlemap';


const MapContainer = () => {

  const [center, setCenter] = useState({ lat: -6.200000, lng: 106.816666 });
  const [markerPosition, setMarkerPosition] = useState({ lat: -6.200000, lng: 106.816666 });
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false); 
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setMarkerPosition(userLocation);
        },
        () => {
          console.error("Error getting the user's location.");
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Handle place selection from Autocomplete
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCenter(newLocation);
      setMarkerPosition(newLocation);
      console.log(place)
    }
  };

  // Handle marker drag end to update position
  const onMarkerDragEnd = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
  };



  
  return (
    <div className="relative overflow-scroll">
      <LocationToggle 
        isGoogleLoaded={isGoogleLoaded} 
        autocompleteRef={autocompleteRef} 
        onPlaceChanged={onPlaceChanged} 
        onEN
      />
      <GoogleMaps 
        center={center} 
        markerPosition={markerPosition}
        onMarkerDragEnd={onMarkerDragEnd} 
        onLoad={() => setIsGoogleLoaded(true)} 
      />
    </div>
  );
};

export default MapContainer;

