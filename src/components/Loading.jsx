import React from 'react'

const Loading = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
  
  export default Loading;