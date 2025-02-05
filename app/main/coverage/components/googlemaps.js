import { GoogleMap, Marker, useLoadScript, Circle, DirectionsRenderer, Polygon } from '@react-google-maps/api';
import { MarkerClusterer } from '@react-google-maps/api';

const libraries = ['places']; 

const GoogleMapComponent = ({ center, markerPosition, radius, setRadius, onMarkerDragEnd, sampleFAT, directions, onLoad, polygons }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '100vh',
  };

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Handle loading error
  if (loadError) return <div className='p-2'>Error loading maps</div>;
  
  // Wait until the script is loaded
  if (!isLoaded && !sampleFAT.length>0) return <div className='p-2'>Loading Maps...</div>;


  const parseWKT = (wkt) => {
    const regex = /\(\((.*?)\)\)/;
    const match = wkt.match(regex);
    if (match) {
      return match[1]
        .split(',')
        .map((coord) => {
          const [lng, lat] = coord.trim().split(' ').map((val) => {
            const parsedVal = parseFloat(val);
            return isNaN(parsedVal) ? null : parsedVal;
          });
          if (lat !== null && lng !== null) {
            return { lat, lng };
          }
          return null;
        })
        .filter((coord) => coord !== null);
    }
    return [];
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onClick={onMarkerDragEnd}
    >
      <Marker
        position={markerPosition}
        draggable={true}
        onDragEnd={onMarkerDragEnd}
        />

        <MarkerClusterer
          options={{
            maxZoom: 17,
            styles: [
              {
                url: '/orange2.png',
                width: 25,
                height: 25,
                fontFamily: 'Quicksand',
                fontWeight: 'bold',
                textColor: '#152c57',
                textSize: 12,
              },
            ],
          }}
        >
        {(clusterer) =>
          sampleFAT.map((i, idx) => (
            <Marker
              key={idx}
              position={i}
              onClick={() => setRadius({ lat: i.lat, lng: i.lng })}
              icon={{
                url: '/fat-green.png',
                scaledSize: new window.google.maps.Size(25, 30),
              }}
              clusterer={clusterer}
            />
          ))
        }
      </MarkerClusterer>

      {radius.lat && radius.lng && (
        <Circle
          center={{ lat: radius.lat, lng: radius.lng }}
          radius={100}
          options={{
            strokeColor: "#2CF226",
            strokeWeight: 0.5,
            strokeOpacity: 0.5,
            fillColor: "#23ad1f",
            fillOpacity: 0.2,
          }}
        />
      )}


      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true, 
            polylineOptions: {
              "icons": [{
                "icon": {
                  "path": 0,
                  "scale": 5,
                  "fillOpacity": 0.9,
                  "fillColor": "#d9f99d",
                  "strokeOpacity": 1,
                  "strokeColor": "#0c8c0a",
                  "strokeWeight": 1
                },
                "repeat": "14px"
              }],
              strokeColor: '#bef264',
              strokeWeight: 8,
              strokeOpacity: 0,
            },
          }}
          
        />
      )}

      {polygons.map((polygonData, index) => {
        const coordinates = parseWKT(polygonData.geometry);
        return (
          <Polygon
            key={index}
            paths={coordinates}
            options={{
              fillColor: '#8b5cf6',
              fillOpacity: 0.2,
              strokeColor: '#8b5cf6',
              strokeOpacity: .6,
              strokeWeight: 1,
            }}
          />
        );
      })}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
