'use client'

import { useState, useRef, useEffect } from 'react';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { Input, notification } from 'antd';
import Map from './components/maps';
import { useUser } from '@/app/context/useUser';
import axios from 'axios';
const libraries = ['places'];

const Container = ({ polygons }) => {
  const { user, loadingUser, isAuthenticated } = useUser();

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
  const [loading, setLoading] = useState(false)

  const [center, setCenter] = useState({ lat: -6.2, lng: 106.8 });
  const [markerPosition, setMarkerPosition] = useState({ lat: -6.2, lng: 106.8 });
  const [address, setAddress] = useState('')
  

  const [homepass, setHomepass] = useState('')


  const [showBoundary, setShowBoundary] = useState(true)



  // async function getBoundaries() {
  //   try {
  //     const response = await axios.post('/api/check_boundary', {
  //       lon: markerPosition.lng,
  //       lat: markerPosition.lat
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching:', error);
  //     throw error;
  //   } 
  // }
  
  // useEffect(() => {  
  //   const fetchData = async () => {
  //     try {
  //       const fetchedData = await getBoundaries();
  //       if (fetchedData.status === 200) {
  //         notification.success({
  //           message: 'Success!',
  //           description: fetchedData.message,
  //           placement: 'top',
  //           duration: 3,
  //         });
  //       } else if (fetchedData.status === 404) {
  //         notification.warning({
  //           message: 'Warning!',
  //           description: fetchedData.message,
  //           placement: 'top',
  //           duration: 3,
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [markerPosition]);



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
            } else {
              console.error("Geocoder failed:", status);
            }
          });
        
        }
      }
    }
  };

  const onMarkerDragEnd = (event) => {
    
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);

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

 

  const onCheckCoverage = async () => {
    try {
      setLoading(true);
      setHomepass({});
      const response = await fetch(`/api/coverage?query=check_coverage&client=${user.tenant}&long=${markerPosition?.lng}&lat=${markerPosition?.lat}`);

      if (!response.ok) {
        notification.error({
          message: 'Failed to fetch data!',
          placement: 'topRight', // Notification in the top-right corner
          duration: 3, // Display duration in seconds
        });
        setLoading(false);
      }

      const data = await response.json();
      if (data.length > 0) {
        notification.success({
          message: 'Area covered!',
          placement: 'topRight',
          duration: 3,
        });
        setLoading(false);

        // const nearbyFAT = await onCheckRouteDistance(data);
        // onCheckAvailability(nearbyFAT);
        return;
      } else {
        notification.warning({
          message: 'Area Not Covered!',
          placement: 'topRight',
          duration: 3,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({
        message: 'An error occurred while fetching data.',
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className='flex h-screen shadow-md bg-slate-300 sm:p-2 sm:pt-14'>
        
        <div className='absolute top-20 left-1/2 transform -translate-x-1/2 w-80 h-fit rounded-lg border-2 border-white bg-amtblue/10 shadow-md backdrop-blur-md z-[990]
          sm:static sm:h-full sm:translate-x-0 sm:rounded-none sm:rounded-l-lg sm:shadow-none sm:bg-slate-50'>
          <div className='flex flex-col p-2 overflow-y-auto smooth-scrollbar sm:h-[calc(100vh_-_8rem)]'>
            <h3 className='p-1 text-xs font-bold text-red-200'>Find Location</h3>
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
          </div>
        </div>


        <div className='relative flex-1 rounded-r-lg border-white overflow-hidden sm:border-2'>
          <Map
            center={center} 
            markerPosition={markerPosition}
            onMarkerDragEnd={onMarkerDragEnd}
            showBoundary={showBoundary}
            setShowBoundary={setShowBoundary}
            onLoad={() => console.log('Loaded')}
            polygons={polygons}
          />
        </div>

      </div>
    </LoadScript>
  );
};

export default Container;
