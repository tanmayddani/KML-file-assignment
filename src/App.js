import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import FileUpload from './components/FileUpload';
import MapModal from './components/MapModal';
import GoogleMapComponent from './components/GoogleMapComponent';
import './index.css';

// Define required libraries for the Google Maps script
const libraries = ['geometry']; 

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [boundingBox, setBoundingBox] = useState(null);
  const [error, setError] = useState(null);
  
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const handleFileProcessed = (data, bounds) => {
    setError(null);
    setGeoJsonData(data);
    setBoundingBox(bounds);
    setIsModalOpen(true); 
  };
  
  const handleUploadError = (message) => {
      setGeoJsonData(null);
      setBoundingBox(null);
      setIsModalOpen(false);
      setError(message);
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const renderMap = () => {
      if (loadError) return <div className="text-white p-6 bg-red-600 rounded-lg shadow-xl">Error loading maps: {loadError.message}</div>;
      if (!isLoaded) return <div className="text-white p-6 bg-gray-700 rounded-lg shadow-xl animate-pulse">Loading Google Maps API...</div>;

      return (
        <GoogleMapComponent 
            geoJsonData={geoJsonData} 
            boundingBox={boundingBox} 
        />
      );
  };
  
  return (
    // Applied Inter font for clean typography
    <div className="App min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter"> 
      
      {/* 1. File Upload/Main Screen UI */}
      <div className="max-w-xl w-full">
        <FileUpload 
            onFileProcessed={handleFileProcessed} 
            onError={handleUploadError}
        />
        
        {/* Display error message */}
        {error && (
            <div className="text-sm md:text-base text-red-700 text-center mt-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg shadow-md transition duration-300">
                ⚠️ **Error:** {error}
            </div>
        )}
      </div>

      {/* 2. Full-Screen Map Modal */}
      <MapModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      >
        {renderMap()}
      </MapModal>
    </div>
  );
}

export default App;
