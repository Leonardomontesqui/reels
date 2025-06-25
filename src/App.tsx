import React, { useState } from 'react';
import { useCurrentUser } from "@shopify/shop-minis-react";

export function App() {
  const { currentUser } = useCurrentUser();
  const [showAlert, setShowAlert] = useState(false);

  const handleRefreshClick = () => {
    setShowAlert(true);
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
              
              {/* Refresh button */}
              <button 
                onClick={handleRefreshClick}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Alert notification */}
            {showAlert && (
              <div className="mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Avatar refreshed successfully! 
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Your LEGO avatar has been updated with the latest configuration.
                      </p>
                    </div>
                    <div className="ml-auto pl-3">
                      <button
                        onClick={() => setShowAlert(false)}
                        className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
