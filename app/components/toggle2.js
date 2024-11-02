'use client'

import { useState } from 'react';

const LocationToggle = () => {
  const [toggle, setToggle] = useState('location');

  return (
    <div className="fixed flex justify-center w-full mt-20 z-[9999]"> {/* Horizontal centering */}
      <div className="relative flex gap-2 w-fit p-1 rounded-full bg-slate-300">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full rounded-full bg-amtorange transition-all duration-300 ${
            toggle === 'location' ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
        <button
          onClick={() => setToggle('location')}
          className={`w-20 text-center text-sm z-10 font-semibold transition-colors duration-300 ${
            toggle === 'location' ? 'text-white' : 'text-gray-700'
          }`}
        >
          Location
        </button>
        <button
          onClick={() => setToggle('address')}
          className={`w-20 text-center text-sm z-10 font-semibold transition-colors duration-300 ${
            toggle === 'address' ? 'text-white' : 'text-gray-700'
          }`}
        >
          Address
        </button>
      </div>
    </div>
  );
};

export default LocationToggle;
