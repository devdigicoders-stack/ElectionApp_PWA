import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
      
      {/* App Bar */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white border-b border-gray-100 z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">Terms & Conditions</h1>
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
