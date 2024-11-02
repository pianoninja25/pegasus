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
    <div className='relative'>
      <p className='absolute top-0'>asd</p>
      
      <LocationToggle />

      <Map />
      {/* <GoogleMaps /> */}
    </div>
  );
};

export default MapContainer;

