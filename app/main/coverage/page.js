'use client';

import { useEffect, useState, useRef } from 'react';

import LocationToggle from '../../components/toggle2';
import GoogleMaps from '../../components/googlemap';
import { message } from 'antd';
import { useSession } from 'next-auth/react';
import Modal from '@/app/components/modal';


const MapContainer = () => {
  const { data: session, status} = useSession()

  const [center, setCenter] = useState({ lat: -6.2, lng: 106.8 });
  const [markerPosition, setMarkerPosition] = useState({ lat: -6.2, lng: 106.8 });
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false); 
  const autocompleteRef = useRef(null);

  const [sampleFAT, setSampleFAT] = useState([])
  const [address, setAddress] = useState('')
  const [homepass, setHomepass] = useState('')
  const [loading, setLoading] = useState(false)


  const [isModalOpen, setIsModalOpen] = useState(false);

  
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
  


  // Handle marker drag end to update position
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


  // Handle check FAT nearby
  const onCheckCoverage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/coverage?query=check_coverage&client=${session?.user.name}&long=${markerPosition?.lng}&lat=${markerPosition?.lat}`);
      if (!response.ok) {
        message.error('Failed to fetch data!');
        return false;
      }
      const data = await response.json();
      const fatidList = data.map(item => item.fatid);
      if(fatidList.length > 0) {
        message.success('Area covered') 
        onCheckAvailability(fatidList)
        // message.loading('Checking available homepass', 0)
      } else {
        message.warning('Area Not Covered!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('An error occurred while fetching data.');
    } finally {
      setLoading(false)
    }
  };

  
  // Handle check homepass availability
  const onCheckAvailability = async (fatidList) => {
    for (const fatid of fatidList) {
      try {
        const response = await fetch(`/api/coverage?query=check_availability&fatid=${fatid}`);
        if (!response.ok) {
          throw new Error(`Error fetching data for FATID: ${fatid}`);
        }
        const data = await response.json();
        if (data.length>0) {
          console.log(data)
          // message.success({ content: `Homepass available ${data[0].id} - ${data[0].type}` });
          setHomepass(data[0])
          setIsModalOpen(true)
          return data;
        } else {
          message.warning({ content: `Homepass not available` });
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
    console.log('No data found in any fatid.');
    return null; // Return null if no data found in any item
  };
  
  return (
    <div className="relative h-lvh overflow-hidden">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} datas={homepass} />
      <LocationToggle 
        isGoogleLoaded={isGoogleLoaded} 
        autocompleteRef={autocompleteRef} 
        onPlaceChanged={onPlaceChanged} 
        onCheckCoverage={onCheckCoverage}
        address={address}
        setAddress={setAddress}
        loading={loading}
      />
      <GoogleMaps 
        center={center} 
        markerPosition={markerPosition}
        onMarkerDragEnd={onMarkerDragEnd} 
        sampleFAT={sampleFAT}
        onLoad={() => setIsGoogleLoaded(true)} 
      />
    </div>
  );
};

export default MapContainer;

