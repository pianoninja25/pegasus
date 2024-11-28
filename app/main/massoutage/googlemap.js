'use client'

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader'; // Google Maps loader
import { useState } from 'react';

const MapComponent = ({ geoJsonData }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Google Maps API loader
    const loader = new Loader({
      apiKey: 'AIzaSyDbi_yhiq93ie2boq5Y5wZvlg_15qemuG4',  // Replace with your API key
      version: 'weekly',
      libraries: ['geometry', 'visualization'],
    });

    loader.load().then(() => {
      // Initialize Google Map
      const mapInstance = new google.maps.Map(mapContainer.current, {
        center: { lat: -6.9202, lng: 106.7442 }, // Set a default map center
        zoom: 13,
      });

      // Load GeoJSON data into the map
      mapInstance.data.addGeoJson(geoJsonData);

      setMap(mapInstance);  // Set the map instance in the state
    });
  }, [geoJsonData]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;
