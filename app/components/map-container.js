'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LocationToggle from '../components/toggle2';
import GoogleMaps from '../components/googlemap';
import useGoogleMaps from './test';


const Map = dynamic(() => import('./map'), { ssr: false });


const MapContainer = () => {

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { loading } = useGoogleMaps(apiKey); // Get loading state from the custom hook

  if (loading) {
    return <div>Loading Google Maps...</div>; // Optionally render a loading message
  }


  return (
    <div className='relative'>
      <div className='flex justify-center font-bold'>
        {/* 
        <div className='absolute top-[50%] left-4 w-12 h-12 rounded-full backdrop-blur-sm bg-amtorange/30 z-[998]'>
          <p className='text-sm'>Location</p>
        </div> */}
      </div>
      {/* <LocationToggle />
      <Map /> */}

      <div className="relative">
        <LocationToggle />
        <GoogleMaps />
      </div>

    </div>
  );
};

export default MapContainer;

