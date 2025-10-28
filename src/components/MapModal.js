import React from 'react';

function MapModal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  // Full-screen, responsive modal styling (Requirement 5)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col p-0 transition-opacity duration-300">
      
      {/* Close button (Requirement 4) */}
      <button 
          className="absolute top-4 right-4 p-3 bg-[#FFD700] text-gray-900 font-extrabold text-xl rounded-full shadow-2xl hover:bg-yellow-400 z-50 transform hover:scale-105"
          onClick={onClose}
          aria-label="Close map view"
      >
          &times;
      </button>
      
      {/* Map Content Area */}
      <div className="relative w-full h-full">
          {children}
      </div>
    </div>
  );
}

export default MapModal;