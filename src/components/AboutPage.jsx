import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AboutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden pb-[72px]">
      
      {/* Top Header */}
      <div className="flex items-center px-4 py-3 shrink-0 bg-white z-20 shadow-sm relative">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:text-[#f37920] transition-colors rounded-full">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900 ml-2">About Narendra Modi</h1>
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        
        {/* Banner Section */}
        <div className="relative w-full aspect-[4/3] bg-gray-200 shrink-0 overflow-hidden sm:rounded-b-3xl">
          <img src="https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=800" alt="Leader Banner" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            {/* Play Button Mockup */}
            <button className="w-14 h-14 bg-black/50 border-2 border-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-6">
          
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 mb-6">
            {['Overview', 'Journey', 'Vision'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-sm font-bold py-2 transition-all ${activeTab === tab ? 'bg-[#f37920] text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'Overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Shri Narendra Modi</h2>
              <p className="text-sm font-bold text-gray-500 mb-4">Prime Minister of India</p>

              <p className="text-sm text-gray-700 leading-relaxed font-medium mb-6">
                A leader with a vision for a stronger, developed and self-reliant India. His dedication towards nation building continues to inspire millions. Under his leadership, the country has seen unprecedented growth and development across all sectors.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-xl font-black text-[#f37920]">70+</span>
                  <span className="text-[0.65rem] font-bold text-gray-500 text-center uppercase tracking-wider mt-1">Awards</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-xl font-black text-[#f37920]">20+</span>
                  <span className="text-[0.65rem] font-bold text-gray-500 text-center uppercase tracking-wider mt-1">Years of Service</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-xl font-black text-[#f37920]">1</span>
                  <span className="text-[0.65rem] font-bold text-gray-500 text-center uppercase tracking-wider mt-1">Vision</span>
                  <span className="text-[0.6rem] font-semibold text-gray-400 text-center leading-none mt-0.5">Viksit Bharat</span>
                </div>
              </div>

              {/* Quote Block */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100/50 mb-6 relative overflow-hidden">
                <svg className="absolute -top-2 -left-2 w-16 h-16 text-orange-200/50 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="relative z-10 text-[0.95rem] font-extrabold text-[#d84315] italic leading-snug text-center">
                  "Sabka Saath, Sabka Vikas,<br/>Sabka Vishwas, Sabka Prayas"
                </p>
              </div>

              {/* Dummy Extra Content for Scrolling */}
              <div className="space-y-4 pb-8">
                <h3 className="font-bold text-gray-900">Key Achievements</h3>
                {[
                  { title: "Digital India", desc: "Empowering every citizen with technology." },
                  { title: "Make in India", desc: "Transforming India into a global manufacturing hub." },
                  { title: "Swachh Bharat", desc: "A clean and green nation for all." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Journey */}
          {activeTab === 'Journey' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[300px]">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-4">A Lifetime of Service</h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                From humble beginnings in Vadnagar to the highest office in the country, the journey has been marked by unwavering dedication and hard work.
              </p>
            </div>
          )}

          {/* Tab Content: Vision */}
          {activeTab === 'Vision' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[300px]">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-4">Viksit Bharat 2047</h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                The vision is clear: to see India as a developed nation by the 100th year of its independence. This involves inclusive growth, modern infrastructure, and global leadership.
              </p>
            </div>
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
