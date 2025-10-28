import React, { useRef, useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
};

function GoogleMapComponent({ geoJsonData, boundingBox }) {
  const mapRef = useRef(null);
  
  // Use useCallback for performance
  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
    
    // Center and zoom map to fit bounds (Requirement 2 & 3)
    if (boundingBox) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: boundingBox.north, lng: boundingBox.west });
      bounds.extend({ lat: boundingBox.south, lng: boundingBox.east });
      map.fitBounds(bounds);
    } else {
        // Fallback center for US
        map.setCenter({ lat: 37.0902, lng: -95.7129 });
        map.setZoom(4);
    }
    
    // Load GeoJSON data (Requirement 3)
    if (geoJsonData) {
      map.data.addGeoJson(geoJsonData);
    }
    
    // Apply styling: No fill and Chrome Yellow border (Requirement 3)
    map.data.setStyle(() => ({
      fillColor: 'transparent', // No fill
      strokeColor: '#FFD700', // Chrome Yellow
      strokeWeight: 3, 
    }));

  }, [geoJsonData, boundingBox]);

  // Clean up function is handled implicitly by the GoogleMap component's unmount prop
  
  const center = { lat: 37.0902, lng: -95.7129 }; 

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={4}
      options={defaultOptions}
      onLoad={onLoad} // Trigger map setup and data load here
      onUnmount={() => mapRef.current = null}
    >
    </GoogleMap>
  );
}

export default GoogleMapComponent;