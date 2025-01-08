'use client'

import React, { useEffect, useRef, useState } from 'react'
import GoogleMaps from '../../components/googlemap';
import { Input } from 'antd';
import { Autocomplete } from '@react-google-maps/api';
import { message } from 'antd';
import Table from './components/table';
import { useSessionContext } from "@/app/context/session-provider";

const CheckCoverage = () => {
  const session = useSessionContext()
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
  
  // Show sample nearby FAT to test
  useEffect(() => {
    const fetchCoverageData = async () => {
      try {
        const response = await fetch(`/api/coverage?query=sample_client_sitelist&client=${session?.user.name}`);
        const data = await response.json();
        const fetchedMarkers = data.map(i => ({
          lat: i.geolocation.y,
          lng: i.geolocation.x,
        }));
        setSampleFAT(fetchedMarkers);
      } catch (error) {
        console.error("Error fetching coverage data:", error);
      }
    };
    fetchCoverageData();
  }, [session]);


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

  // Handle check FAT nearby
  const onCheckCoverage = async () => {
    try {
      setLoading(true)
      setHomepass({})
      const response = await fetch(`/api/coverage?query=check_coverage&client=${session?.user.name}&long=${markerPosition?.lng}&lat=${markerPosition?.lat}`);

      if (!response.ok) {
        message.error('Failed to fetch data!');
        return false;
      }
      const data = await response.json();
      if(data.length > 0) {
        message.success('Area covered!')
        const nearbyFAT = await onCheckRouteDistance(data)
        onCheckAvailability(nearbyFAT)
        return
      } else {
        message.warning('Area Not Covered!');
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('An error occurred while fetching data.');
    } 
  };

   // Handle check route directions & distance
  const onCheckRouteDistance = async (datas) => {
    try {
      const response = await fetch(`/api/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origins: markerPosition,
          destinations: datas
        }),
      });
  
      if (!response.ok) {
        console.error('Error:', response.statusText);
        return;
      }
  
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  // Handle check homepass availability
  const onCheckAvailability = async (dataFAT) => {
    for (const i of dataFAT) {
      try {
        setLoading(true);
  
        const response = await fetch(`/api/coverage/check_availability?fatid=${i.fatid}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}, FATID: ${i.fatid}`);
        }
  
        const data = await response.json();
  
        if (data.length > 0) {
          data[0].distances = `${i.distance} m`;
          message.success({ content: `Homepass available for FATID: ${i.fatid}` });
          setHomepass(data[0]);
  

          const [lat, lng] = i.destination.split(',').map(Number);
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: markerPosition.lat, lng: markerPosition.lng },
              destination: { lat, lng },
              travelMode: google.maps.TravelMode.WALKING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                setDirections(result);
              } else {
                console.error(`Directions request failed: ${status}`);
              }
            }
          );
  
          return data; // Stop processing after finding the first available FATID
        } else {
          message.warning({ content: `Homepass not available for FATID: ${i.fatid}` });
        }
      } catch (error) {
        console.error(`Error processing FATID: ${i.fatid}`, error);
        message.error({ content: `Check your internet connection!` });
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
          <div className='flex flex-col p-2 overflow-y-auto smooth-scrollbar sm:h-[calc(100vh_-_8rem)]'>
            <h3 className='p-1 text-xs font-bold text-slate-500'>Find Location</h3>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChanged}
              restrictions={{ country: 'ID' }}
            >
              <Input 
                placeholder="Find Location" 
                className='text-xs break-words' 
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
                session={session}
                showOrderCreation={showOrderCreation}
                setShowOrderCreation={setShowOrderCreation} 
              />
            }
          </div>
        )
          
        }
      </div>
      <div className='relative flex-1 rounded-r-lg border-white overflow-hidden sm:border-2'>
        <div className={`${loading ? 'loading p-20 sm:p-40 z-50 rounded-full shadow-md backdrop-blur-md bg-amtblue/10' : ''}`} />
        <GoogleMaps 
          center={center} 
          markerPosition={markerPosition}
          radius={radius}
          setRadius={setRadius}
          onMarkerDragEnd={onMarkerDragEnd} 
          sampleFAT={sampleFAT}
          directions={directions}
          onLoad={() => setIsGoogleLoaded(true)} 
        />
      </div>
    </div>
  )
}

export default CheckCoverage