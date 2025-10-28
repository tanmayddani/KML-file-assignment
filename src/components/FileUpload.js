import React from 'react';
import togeojson from '@mapbox/togeojson';

// Calculates the bounding box from GeoJSON features for map centering (Requirement 2)
const calculateBoundingBox = (geoJson) => {
    let north = -90, south = 90, east = -180, west = 180;

    const processCoords = (coords) => {
        if (!coords) return;
        
        // Coordinates are typically [lng, lat] in GeoJSON
        if (typeof coords[0] === 'number' && coords.length >= 2) {
            const [lng, lat] = coords;
            if (lat > north) north = lat;
            if (lat < south) south = lat;
            if (lng > east) east = lng;
            if (lng < west) west = lng;
        } else if (Array.isArray(coords)) {
            // Recurse for nested arrays (e.g., Polygon, MultiLineString)
            coords.forEach(coord => processCoords(coord));
        }
    };

    geoJson.features.forEach(feature => {
        if (feature.geometry && feature.geometry.coordinates) {
            processCoords(feature.geometry.coordinates);
        }
    });
    
    if (north === -90 && south === 90) return null;

    return { north, south, east, west };
};


function FileUpload({ onFileProcessed, onError }) {
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file extension (Requirement 1)
    if (!file.name.toLowerCase().endsWith('.kml')) {
      onError('Invalid file type. Please upload a .kml file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const kmlText = e.target.result;
      
      try {
        // Parse KML to GeoJSON using DOMParser and togeojson (Requirement 3)
        const parser = new DOMParser();
        const kmlDom = parser.parseFromString(kmlText, 'text/xml');
        const geoJsonData = togeojson.kml(kmlDom);
        
        if (!geoJsonData || geoJsonData.features.length === 0) {
            onError('KML file parsed successfully, but no geometric features were found.');
            return;
        }
        
        const boundingBox = calculateBoundingBox(geoJsonData);
        onFileProcessed(geoJsonData, boundingBox);
        
      } catch (error) {
        onError('Could not parse the KML file. It may be corrupt or invalid XML.');
      }
    };

    reader.onerror = () => {
        onError('Error reading file.');
    };

    reader.readAsText(file);
  };
  
  return (
    <div className="p-10 bg-white shadow-xl rounded-xl border-4 border-dashed border-gray-300 hover:border-[#FFD700]">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">KML Map Overlay</h2>
      
      <label 
        htmlFor="kml-upload" 
        className="block cursor-pointer p-4 border-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 rounded-lg text-center hover:bg-blue-100"
      >
        <span>Click to select (.kml) file</span>
        <input 
          id="kml-upload"
          type="file" 
          accept=".kml" 
          onChange={handleFileChange} 
          className="hidden"
        />
      </label>
    </div>
  );
}

export default FileUpload;
