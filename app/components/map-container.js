'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { fetchSiteList } from '@/utils/get-sitelist';
import { useEffect, useState } from 'react';
import LocationToggle from '../components/toggle2';
// import GoogleMaps from '../components/map2';

const Map = dynamic(() => import('./map'), { ssr: false });


const MapContainer = () => {



  return (
    <div>
      <div className='flex justify-center font-bold'>
        <h3 className='absolute top-40 flex items-center p-4 text-center rounded-xl shadow-md bg-gradient-to-br from from-white to-amtorange z-[998]'>
          CHECK COVERAGE
        </h3>
{/* 
        <div className='absolute top-[50%] left-4 w-12 h-12 rounded-full backdrop-blur-sm bg-amtorange/30 z-[998]'>
          <p className='text-sm'>Location</p>
        </div> */}
      </div>
      <LocationToggle />

      <Map />
      {/* <GoogleMaps /> */}
    </div>
  );
};

export default MapContainer;

