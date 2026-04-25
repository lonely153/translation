import React from 'react';

function AuthPopup({ onClose, onGoToLogin }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-8">
          You must be logged in to add items to your cart or reserve an item. Would you like to sign in now?
        </p>
        
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Not Now
          </button>
          <button 
            onClick={onGoToLogin}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;