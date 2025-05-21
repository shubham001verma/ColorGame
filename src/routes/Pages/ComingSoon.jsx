import React from 'react';

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <div className="relative w-80 h-16 bg-yellow-400 border-4 border-black rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-black w-1/2 animate-loading"></div>
        <div className="relative z-10 flex justify-center items-center h-full">
          <span className="text-black font-bold text-lg mix-blend-difference">COMING SOON</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
