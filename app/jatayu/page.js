'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { fetchSiteList } from '@/utils/get-sitelist';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('../components/map'), { ssr: false });

const Jatayu = () => {



  return (
    <div>
      <div className='flex justify-center font-bold'>
        <h3 className='absolute top-40 flex items-center p-4 text-center rounded-xl shadow-md bg-gradient-to-br from from-white to-amtorange z-[9999]'>
          CHECK COVERAGE
        </h3>
      </div>

      <Map />
    </div>
  );
};

export default Jatayu;

