import React from 'react';

const LockedPage = () => {
  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="p-8 text-center bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 border-t-4 border-red-500">
        
        {}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          تم قفل هذه الصفحة
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          عفواً، لا يمكنك الوصول إلى هذه الصفحة في الوقت الحالي. يرجى مراجعة المطور أو الإدارة لحل المشكلة.
        </p>

        {}
        <button 
          onClick={() => window.history.back()}
          className="w-full px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 font-semibold shadow-sm"
        >
          العودة للصفحة السابقة
        </button>
      </div>
    </div>
  );
};

export default LockedPage;