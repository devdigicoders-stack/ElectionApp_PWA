import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen flex flex-col bg-gradient-to-b from-[#f37920] via-[#e25d14] to-[#8c2a07] overflow-hidden">
        
        {/* Top Section: Logo and Titles */}
        <div className="w-full flex flex-col items-center pt-12 px-6 z-10 flex-grow">
          {/* Top Image (Likely BJP Logo from image copy 2.png) */}
          <img 
            src="/image copy 2.png" 
            alt="BJP Logo" 
            className="w-44 h-auto object-contain drop-shadow-md mb-12"
          />

          {/* Hindi Slogans */}
          <div className="flex flex-col items-center space-y-1.5 text-white font-bold text-[1.35rem] tracking-wide drop-shadow-md" style={{ fontFamily: 'sans-serif' }}>
            <p>सबका साथ</p>
            <p>सबका विकास</p>
            <p>सबका विश्वास</p>
            <p>सबका प्रयास</p>
          </div>
        </div>

        {/* Bottom Section: Silhouette & Text */}
        <div className="w-full relative flex flex-col items-center justify-end z-10 mt-auto">
          {/* Bottom Image (Likely Monuments from image copy.png) */}
          <img 
            src="/image copy.png" 
            alt="Monuments" 
            className="w-full h-auto object-cover object-bottom"
          />
        </div>

    </div>
  );
}
