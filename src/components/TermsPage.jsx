import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-6">
        <div className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            By downloading, installing, or using this application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the application.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">2. User Conduct</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            You agree to use the application only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the app. Harassment, abusive behavior, and the transmission of obscene or offensive content is strictly prohibited.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">3. Account Registration</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
          <p className="mb-5 leading-relaxed font-medium text-[0.95rem]">
            All content, trademarks, logos, and service marks displayed on the application are the property of their respective owners. You are not permitted to use these without prior written consent.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Termination</h2>
          <p className="mb-8 leading-relaxed font-medium text-[0.95rem]">
            We reserve the right to suspend or terminate your access to the application at any time, without notice, for any reason, including violation of these Terms.
          </p>
          
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-600">
              For any questions regarding these terms, please contact our support team. Last updated: September 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
