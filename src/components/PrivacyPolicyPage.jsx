import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
      
      {/* App Bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-6">
        <div className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information Collection</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            We collect personal information that you provide to us, including your name, contact details, and location data when you use the app. This helps us provide you with relevant local updates and events.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            Your data is used to personalize your experience, send notifications about important political events in your area, and improve the overall functionality of the application.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">3. Data Security</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Sharing of Information</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            We do not sell your personal information. We may share your data with trusted partners solely for the purpose of app maintenance, analytics, and service delivery under strict confidentiality agreements.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Your Rights</h2>
          <p className="mb-8 leading-relaxed font-medium text-[0.95rem]">
            You have the right to access, update, or delete your personal information at any time through the 'Edit Profile' section of the application.
          </p>
          
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-sm font-semibold text-orange-800">
              By continuing to use this application, you agree to our Privacy Policy. Last updated: September 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
