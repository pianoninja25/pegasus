'use client'

import React, { useEffect, useRef, useState } from 'react'
import GoogleMaps from './components/googlemaps';
import { Input, notification } from 'antd';
import { Autocomplete } from '@react-google-maps/api';
import { message } from 'antd';
import Table from './components/table';
import { useSessionContext } from "@/app/context/session-provider";
import { fetchSampleFAT } from '@/utils/get-sitelist';
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import { useUser } from '@/app/context/useUser';
import { isTokenExpired, refreshAccessToken } from '@/app/service/token';




const MapContainer = ({ polygons }) => {
  // const session = useSessionContext()
  const { user, loadingUser, isAuthenticated } = useUser();

  const [isActive, setIsActive] = useState('Location')
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false); 
  
  const [center, setCenter] = useState({ lat: -6.2, lng: 106.8 });
  const [markerPosition, setMarkerPosition] = useState({ lat: -6.2, lng: 106.8 });
  const [radius, setRadius] = useState({ lng: -18.15, lat: 29.73} )
  const [directions, setDirections] = useState(null);
  
  const [address, setAddress] = useState('')
  const [homepass, setHomepass] = useState('')
  const [sampleFAT, setSampleFAT] = useState([]);
  const [loading, setLoading] = useState(false)

  const [showOrderCreation, setShowOrderCreation] = useState(true);

  const autocompleteRef = useRef(null);

  const autocompleteOptions = {
    bounds: {
      north: 6.2745,
      south: -11.0083,
      east: 141.0218,
      west: 94.9117,
    },
    strictBounds: true,
  };
  

  /* 
  ------------------------
  GENERATE MAPS LOCATION 
  ------------------------
  */

  // Get GPS current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setMarkerPosition(userLocation);
        },
        () => {
          console.error("Error getting the user's location.");
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);


  // Select GPS position
  const onMarkerDragEnd = (event) => {
  
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    setHomepass({})

    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            const address = results[0].formatted_address;
            setAddress(address);
          } else {
            console.log("No address found");
          }
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
    }


  };

  // Handle place selection from Autocomplete
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCenter(newLocation);
      setMarkerPosition(newLocation);
      setAddress(place.formatted_address);
      setHomepass({})
    }
    else {
      // If place.geometry is undefined, we can try geocoding the address manually
      if (address) {
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results[0]) {
              const newLocation = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
              };
              setCenter(newLocation);
              setMarkerPosition(newLocation);
              setAddress(results[0].formatted_address);
              setHomepass({})
            } else {
              console.error("Geocoder failed:", status);
            }
          });
        
        }
      }
    }
  };



    /* 
  --------------------------
  FETCH API & EVENTS HANDLER 
  --------------------------
  */
  
  async function getBoundaries() {
    try {
      if (user && isTokenExpired(user?.access_token)) {
        await refreshAccessToken(user);
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PEGASUS_API}/check-boundary`, 
        {
          lon: markerPosition.lng,
          lat: markerPosition.lat,
          tenant: user.tenant
        },
        { headers: { Authorization: `Bearer ${user.access_token}` }}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    } 
  }

  async function getFAT(psitelist) {
    try {
      if (user && isTokenExpired(user?.access_token)) {
        await refreshAccessToken(user);
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PEGASUS_API}/get-fat`, 
        { sitelist : psitelist },
        { headers: { Authorization: `Bearer ${user.access_token}` }}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching fat:', error);
      throw error;
    } 
  }

  async function getGoogleMatrix(psitelist) {
    try {
      const response = await axios.post('/api/check_google_matrix', {
        origins: markerPosition,
        destinations: psitelist
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Google Matrix:', error);
    }
  }

  async function getNearbyFAT(session, lat, long) {
    try {
      if (session && isTokenExpired(session.access_token)) {
        await refreshAccessToken(session);
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PEGASUS_API}/check-coverage`, 
        {
          tenant: session.tenant,
          lat: lat,
          long: long,
          scan_radius: session.radius_meter
        },
        { headers: { Authorization: `Bearer ${session.access_token}` }}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching near fat:', error);
      throw error;
    }
  }
  
  const onCheckCoverage = async () => {
    try {
      setLoading(true)
      const sitelist = await getBoundaries();
      // IF THE LOCATION INSIDE BOUNDARIES
      if (sitelist.status === 200) {
        const fatlist = await getFAT(sitelist.data);
        const matrix = await getGoogleMatrix(fatlist)
        onCheckAvailability(user, matrix, 'Covered')
      } 
      // IF THE LOCATION OUTSIDE BOUNDARIES
      else if (sitelist.status === 404) {
        const nearfatlist = await getNearbyFAT(user, markerPosition?.lat, markerPosition?.lng)
        const nearmatrix = await getGoogleMatrix(nearfatlist)
        if(nearfatlist.length > 0) {
          onCheckAvailability(user, nearmatrix, 'Maybe')
        } else {
          notification.error({
            message: 'Area not covered!',
            description: 'Sorry, your location is not covered at the moment.',
            placement: 'topRight',
            duration: 5,
          });
        }
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({
        message: 'Error!',
        description: error.message,
        placement: 'topRight',
        duration: 5,
      });
      setLoading(false)
    }
  };

  const onCheckAvailability = async (session, dataFAT, pstatus) => {
    for (const i of dataFAT) {
      try {
        setLoading(true);
        if (session && isTokenExpired(session.access_token)) {
          await refreshAccessToken(session);
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_PEGASUS_API}/check-availability`, 
          { "fatid": i.fatid },
          { headers: { Authorization: `Bearer ${session.access_token}` }}
        );

        const data = await response.data;
  
        if (data.length > 0) {
          data[0].distances = `${i.distance} m`;
          setHomepass(data[0]);
          if(pstatus === 'Covered') {
            notification.success({
              message: 'Area covered!',
              description: 'Please complete workorder form.',
              placement: 'topRight',
              duration: 5,
            });
          } else {
            notification.warning({
              message: 'Area may be covered!',
              description: 'Please complete the workorder form, and we will verify for you.',
              placement: 'topRight',
              duration: 5,
            });
          }
          setLoading(false)  
          return data;
        } else {
          console.log('Homepass already full.')
        }
      } catch (error) {
        console.error(`Error processing FATID: ${i.fatid}`, error);
        // message.error({ content: `Check your internet connection!` });
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  
    console.log('No data found for any FATID.');
    return null;
  };


  return (
    <div className='flex h-screen shadow-md bg-slate-300 sm:p-2 sm:pt-14'>
      {/* h-[calc(100vh_-_.5rem)]  */}
      <div className='absolute top-20 left-1/2 transform -translate-x-1/2 w-80 h-fit rounded-lg border-2 border-white bg-amtblue/10 shadow-md backdrop-blur-md z-[990]
        sm:static sm:h-full sm:translate-x-0 sm:rounded-none sm:rounded-l-lg sm:shadow-none sm:bg-slate-50'>
        
        
        {isGoogleLoaded && (
          <div className='flex flex-col p-2 overflow-y-auto smooth-scrollbar sm:h-full'>
            <h3 className='p-1 text-xs font-bold text-slate-500'>Find Location</h3>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChanged}
              restrictions={{ country: 'ID' }}
            >
              <Input 
                placeholder="Find Location" 
                className="text-xs"
                options={autocompleteOptions} 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                allowClear
              />
            </Autocomplete>
            <button 
              onClick={onCheckCoverage}
              disabled={loading}
              className='relative place-self-center w-fit px-4 py-1 mt-3 rounded-full shadow-sm text-xs font-bold text-center sm:py-1.5 sm:my-4 sm:text-xxs 
                text-white bg-gradient-to-br from-lime-500 to-teal-600 
                disabled:text-lime-300 disabled:cursor-not-allowed transition-all duration-500 hover:shadow-lg hover:scale-105'
            >
              {loading ? 'Checking...' : 'Check Coverage'} 
            </button>

            {Object.keys(homepass).length > 0 && 
              <Table 
                datas={homepass}
                markerPosition={markerPosition} 
                user={user}
                showOrderCreation={showOrderCreation}
                setShowOrderCreation={setShowOrderCreation}
              />
            }
          </div>
        )
          
        }
      </div>
      <div className='relative flex-1 rounded-r-lg border-white overflow-hidden sm:border-2'>
        {/* <div className={`${loading ? 'loading p-20 sm:p-40 z-50 rounded-full shadow-md backdrop-blur-md bg-amtblue/10' : ''}`} /> */}
        <div className='loading' />
        <GoogleMaps 
          center={center} 
          markerPosition={markerPosition}
          radius={radius}
          setRadius={setRadius}
          onMarkerDragEnd={onMarkerDragEnd} 
          sampleFAT={sampleFAT}
          directions={directions}
          onLoad={() => setIsGoogleLoaded(true)}
          polygons={polygons} 
        />
      </div>
    </div>
  )
}

export default MapContainer