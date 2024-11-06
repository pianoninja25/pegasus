'use client'

import { useState } from 'react';
import { Button, Select } from 'antd';
import { Input } from 'antd';
import { Autocomplete } from '@react-google-maps/api';
const { Search } = Input;

const LocationToggle = ({ isGoogleLoaded, autocompleteRef, onPlaceChanged }) => {
  const [toggle, setToggle] = useState('location');
  const [region, setRegion] = useState('')
  const regionList = [
    { name: 'JBRO', value: 'JBRO'},
    { name: 'KSMP', value: 'KSMP'},
    { name: 'CJWJ', value: 'CJWJ'},
    { name: 'ÉJBN', value: 'ÉJBN'},
    { name: 'SMTR', value: 'SMTR'},
  ]

  return (
    <div className="fixed grid justify-center w-full mt-[18vh] z-50"> {/* Horizontal centering */}
      <div className="relative flex gap-8 w-fit p-1 px-4 rounded-t-lg backdrop-blur-lg border-2 border-b-0 border-white bg-amtblue/20">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-amtblue/50 transition-all duration-300 ${
            toggle === 'location' ? 'rounded-tl-md translate-x-0' : 'rounded-tr-md translate-x-full'
          }`}
        />
        <button
          onClick={() => setToggle('location')}
          className={`w-20 text-center text-sm z-10 transition-colors duration-300 ${
            toggle === 'location' ? 'text-white font-bold' : 'text-gray-500'
          }`}
        >
          Location
        </button>
        <button
          onClick={() => setToggle('address')}
          className={`w-20 text-center text-sm z-10 transition-colors duration-300 ${
            toggle === 'address' ? 'text-white font-bold' : 'text-gray-500'
          }`}
        >
          Address
        </button>
      </div>
      



      <div className='relative w-[227.2px] h-fit p-2 shadow-lg rounded-b-md backdrop-blur-md border-2 border-t-0 border-white bg-amtblue/20'>
        
        {/* FIND LOCATION */}
        {toggle === 'location' && isGoogleLoaded && (
          <div className='grid p-2'>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChanged}
            >
              <Search placeholder="Find Location"  />
            </Autocomplete>
            <button className='place-self-center w-fit px-4 py-1 rounded-md shadow-md text-sm text-center text-white bg-amtorange'>Find Location </button>
          </div>
        )}



        {/* DROPDOWN */}
        {toggle === 'address' && (
          <>
            {/* SELECT PROVINCE */}
            <div className='grid place-items-center'>
              <h2 className='place-self-start p-1 px-6 text-xs font-bold text-amtblue'>Province</h2>
              <Select
                showSearch
                allowClear
                style={{
                  width: '80%',
                }}
                placeholder="Select Province"
                maxTagCount="responsive"
                onChange={(e) => setRegion(e)}
                // defaultValue={regionName}
                options={regionList}
              />
            </div>

            {/* SELECT CITY */}
            <div className='grid place-items-center pt-2'>
              <h2 className='place-self-start p-1 px-6 text-xs font-bold text-amtblue'>City</h2>
              <Select
                showSearch
                allowClear
                style={{
                  width: '80%',
                }}
                placeholder="Select City"
                maxTagCount="responsive"
                onChange={(e) => setRegion(e)}
                // defaultValue={regionName}
                options={regionList}
              />
            </div>

            {/* SELECT SUBDISTRICT */}
            <div className='grid place-items-center pt-2'>
              <h2 className='place-self-start p-1 px-6 text-xs font-bold text-amtblue'>Subdistrict</h2>
              <Select
                showSearch
                allowClear
                style={{
                  width: '80%',
                }}
                placeholder="Select Subdistrict"
                maxTagCount="responsive"
                onChange={(e) => setRegion(e)}
                // defaultValue={regionName}
                options={regionList}
              />
            </div>

            {/* SELECT WARD */}
            <div className='grid place-items-center py-2'>
              <h2 className='place-self-start p-1 px-6 text-xs font-bold text-amtblue'>Ward</h2>
              <Select
                showSearch
                allowClear
                style={{
                  width: '80%',
                }}
                placeholder="Select Ward"
                maxTagCount="responsive"
                onChange={(e) => setRegion(e)}
                // defaultValue={regionName}
                options={regionList}
              />
            </div>

            <div className='grid p-2 pt-4'>
              <button className='place-self-center w-fit px-4 py-1 rounded-md shadow-md text-sm text-center text-white bg-amtorange'>Check Coverage </button>
            </div>
          
          </>
        )}

      </div>
    </div>
  );
};

export default LocationToggle;
