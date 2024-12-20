'use client'

import { useState } from 'react';
import { Button, Select, Spin } from 'antd';
import { Input } from 'antd';
import { Autocomplete } from '@react-google-maps/api';
import { AiOutlineLoading } from "react-icons/ai";

const LocationToggle = ({ 
  isGoogleLoaded, 
  autocompleteRef, 
  onPlaceChanged, 
  onCheckCoverage,
  onKeyDown,
  address,
  setAddress,
  loading
}) => {
  const [toggle, setToggle] = useState('location');
  const [region, setRegion] = useState('')
  
  const autocompleteOptions = {
    bounds: {
      north: 6.2745,
      south: -11.0083,
      east: 141.0218,
      west: 94.9117,
    },
    strictBounds: true,
  };

  const regionList = [
    { name: 'JBRO', value: 'JBRO'},
    { name: 'KSMP', value: 'KSMP'},
    { name: 'CJWJ', value: 'CJWJ'},
    { name: 'ÉJBN', value: 'ÉJBN'},
    { name: 'SMTR', value: 'SMTR'},
  ]

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 w-fit mt-[20%] sm:mt-[5%] z-50"> {/* Horizontal centering */}
      <div className="relative flex gap-8 w-fit p-1 px-4 rounded-t-lg backdrop-blur-lg border-2 border-b-0 border-white bg-amtblue/20">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-amtblue/50 transition-all duration-300 ${
            toggle === 'location' ? 'rounded-tl-md translate-x-0' : 'rounded-tr-md translate-x-full'
          }`}
        />
        <button
          onClick={() => setToggle('location')}
          className={`w-32 p-1 text-center text-sm z-10 transition-colors duration-300 ${
            toggle === 'location' ? 'text-white font-bold' : 'text-gray-500'
          }`}
        >
          Location
        </button>
        <button
          onClick={() => setToggle('address')}
          className={`w-32 p-1 text-center text-sm z-10 transition-colors duration-300 ${
            toggle === 'address' ? 'text-white font-bold' : 'text-gray-500'
          }`}
        >
          Address
        </button>
      </div>
      



      <div className='relative w-[324px] h-fit p-2  shadow-lg rounded-b-md backdrop-blur-md border-2 border-t-0 border-white bg-amtblue/20'>
        
        {/* FIND LOCATION */}
        {toggle === 'location' && isGoogleLoaded && (
          <div className='grid p-2'>
            <Autocomplete
              // onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              // onPlaceChanged={onPlaceChanged}
              restrictions={{ country: 'ID' }}
            >
              <Input 
                placeholder="Find Location" 
                className='h-8' 
                options={autocompleteOptions} 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                onKeyDown={onKeyDown} 
                allowClear
              />
            </Autocomplete>
            <div className='flex justify-between mt-4'>
              <button 
                className='place-self-start w-fit px-4 py-2 rounded-md shadow-md text-sm text-center text-white bg-amtorange'
                onClick={onPlaceChanged}
              >
                Find Location 
              </button>
              <button 
                onClick={onCheckCoverage}
                disabled={loading}
                className='relative place-self-start w-fit px-4 py-2 rounded-md shadow-md text-sm text-center text-white bg-green-500 disabled:text-stone-300 disabled:cursor-not-allowed'
              >
                Check Coverage {loading ? <Spin indicator={<AiOutlineLoading />} size="small" className='absolute left-[45%] top-3 animate-spin' /> : ''}
              </button>
            </div>
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
