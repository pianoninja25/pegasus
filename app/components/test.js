// hooks/useGoogleMaps.js
import { useEffect, useState } from 'react';

let isGoogleMapsLoaded = false; // Flag to check if Google Maps has been loaded

const useGoogleMaps = (apiKey) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Google Maps is already loaded, skip loading
    if (isGoogleMapsLoaded) {
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true; // Load script asynchronously
    script.defer = true; // Defer loading until the page is parsed

    script.onload = () => {
      isGoogleMapsLoaded = true; // Mark as loaded
      setLoading(false); // Set loading to false
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API'); // Error handling
      setLoading(false);
    };

    document.head.appendChild(script); // Append script to head

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script); // Clean up on unmount
      }
    };
  }, [apiKey]);

  return { loading };
};

export default useGoogleMaps;
