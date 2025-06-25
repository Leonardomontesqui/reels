import React from 'react';
import { useCurrentUser } from "@shopify/shop-minis-react";

export function App() {
  const { currentUser } = useCurrentUser();

  const handleDownloadClick = () => {
    // For now, just show a simple message while we fix the screenshot functionality
    alert('Screenshot feature coming soon! For now, you can take a regular screenshot of your screen.');
  };

  return (
    <div id="lego-avatar-container" className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="pt-safe-top pt-12 px-6 pb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {currentUser?.displayName || 'Shams'}'s Lego Avatar
        </h1>
      </div>

      {/* Main Content with full-screen grid */}
      <div 
        className="flex-1 relative"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
          backgroundColor: '#f8f9fa'
        }}
      >
        {/* Centered LEGO image container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md">
            <div className="aspect-square relative flex items-center justify-center">
              {/* LEGO image */}
              <img 
                src="/lego-figure.png" 
                alt="LEGO Avatar" 
                className="max-w-[80%] max-h-[80%] object-contain drop-shadow-lg"
              />
              
              {/* Download/Share button */}
              <button 
                onClick={handleDownloadClick}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Download avatar as PNG"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
