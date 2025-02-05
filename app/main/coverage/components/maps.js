'use client'

import { useState } from 'react';
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';

import { RiShapeLine } from "react-icons/ri";

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};


const parseWKT = (wkt) => {
  const regex = /\(\((.*?)\)\)/;
  const match = wkt.match(regex);
  if (match) {
    return match[1]
      .split(',')
      .map((coord) => {
        const [lng, lat] = coord.trim().split(' ').map((val) => {
          const parsedVal = parseFloat(val);
          return isNaN(parsedVal) ? null : parsedVal;
        });
        if (lat !== null && lng !== null) {
          return { lat, lng };
        }
        return null;
      })
      .filter((coord) => coord !== null);
  }
  return [];
};




// MAIN
const Map = ({ center, markerPosition, onMarkerDragEnd, polygons }) => {
  const [showBoundary, setShowBoundary] = useState(true)

  

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
    >
      <div
        onClick={() => setShowBoundary(!showBoundary)} 
        className='absolute m-20 p-2 rounded-full shadow-md bg-white hover:cursor-pointer hover:bg-[#fccda4] transition-all duration-500'
      >
        <RiShapeLine size={20} color='#f58220'/>
      </div>
      {showBoundary && polygons.map((polygonData, index) => {
        const coordinates = parseWKT(polygonData.geometry);
        return (
          <Polygon
            key={index}
            paths={coordinates}
            options={{
              fillColor: '#8b5cf6',
              fillOpacity: 0.2,
              strokeColor: '#8b5cf6',
              strokeOpacity: .6,
              strokeWeight: 1,
            }}
          />
        );
      })}

      <Marker
        position={markerPosition}
        draggable={true}
        onDragEnd={onMarkerDragEnd}
      />
    </GoogleMap>
  );
};

export default Map;
