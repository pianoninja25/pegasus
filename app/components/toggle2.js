'use client'

import { useState } from 'react';

const LocationToggle = () => {
  const [toggle, setToggle] = useState('location');

  return (
    <div className="fixed grid justify-center w-full mt-20 z-[9999]"> {/* Horizontal centering */}
      <div className="relative flex gap-2 w-fit p-1 rounded-t-lg shadow-md backdrop-blur-sm border border-white bg-white/40">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full rounded-t-lg bg-amtblue/50 transition-all duration-300 ${
            toggle === 'location' ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
        <button
          onClick={() => setToggle('location')}
          className={`w-20 text-center text-sm z-10 font-semibold transition-colors duration-300 ${
            toggle === 'location' ? 'text-white' : 'text-gray-500'
          }`}
        >
          Location
        </button>
        <button
          onClick={() => setToggle('address')}
          className={`w-20 text-center text-sm z-10 font-semibold transition-colors duration-300 ${
            toggle === 'address' ? 'text-white' : 'text-gray-500'
          }`}
        >
          Address
        </button>
      </div>

      {/* DROPDOWN */}
      <div className='w-44 h-fit p-2 shadow-md rounded-b-md backdrop-blur-md border border-white bg-white/40'>
        {toggle === 'location' && (
          <div className='grid p-2'>
            <p className='place-self-center w-fit px-4 py-1 rounded-md text-sm text-center text-white bg-amtorange'>Find Location </p>
          </div>
        )}
        {toggle === 'address' && (
          <div className='grid p-2'>
            <span>DROPDOWN1 </span>
            <span>DROPDOWN2</span>
            <span>DROPDOWN3</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default LocationToggle;
