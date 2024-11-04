'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LocationToggle from '../components/toggle2';
import GoogleMaps from '../components/googlemap';


const Map = dynamic(() => import('./map'), { ssr: false });


const MapContainer = () => {
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

