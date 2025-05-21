import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
<div className="w-screen flex justify-center h-screen bg-[#9195a3] ">
      {/* Phone-like mobile container */}
      <div className="w-full h-full max-w-[500px] max-h-screen bg-primary flex items-center justify-center px-4">
        <img
          src="/3.png"
          alt="Splash Logo"
          className="w-40 h-40 object-contain mb-10"
        />
      </div>
    </div>
  );
};

export default SplashScreen;






