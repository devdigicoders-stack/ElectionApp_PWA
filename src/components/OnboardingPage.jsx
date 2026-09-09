import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-10 right-6 z-20">
        <button className="text-sm font-semibold text-[#1e40af] hover:text-blue-800" onClick={() => navigate('/login')}>Skip</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-6 px-6 pb-6 overflow-y-auto">
        {/* Logo and Titles */}
        <div className="flex flex-col items-center mb-2 shrink-0">
           {/* Assuming icons.svg is the small lotus logo. I will use image copy 2.png or leave it out if image copy 4 has it. I'll use image copy 2.png scaled down. */}
           <img src="/image copy 2.png" alt="Logo" className="w-16 h-auto object-contain mb-1" onError={(e) => { e.target.style.display = 'none'; }} />
           <h1 className="text-xl font-extrabold text-black tracking-wide leading-none">
             BJP
           </h1>
           <h2 className="text-xs font-bold text-[#046A38] tracking-wider mt-1">
             JanSampark
           </h2>
        </div>

        {/* Center Image (Modi Ji) */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0 my-2">
          <img src="/image copy 4.png" alt="Leader" className="w-full h-full object-contain" />
        </div>

        {/* Text Section */}
        <div className="w-full flex flex-col items-center text-center mt-2 shrink-0">
          <h2 className="text-[1.35rem] font-extrabold text-gray-900 leading-tight mb-2">
            A Stronger India,<br/>Together
          </h2>
          <p className="text-xs text-gray-500 font-semibold px-4 mb-4">
            Connect with your leader,<br/>be part of the change.
          </p>

          {/* Dots */}
          <div className="flex gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#f37920]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>

          {/* Get Started Button */}
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-[#f37920] text-white rounded-xl font-bold text-lg hover:bg-[#e25d14] transition-colors shadow-lg shadow-orange-500/30"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
