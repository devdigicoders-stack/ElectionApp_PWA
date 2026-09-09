import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const worksData = [
  {
    id: 1,
    title: 'New Highway Project',
    longTitle: 'Four Lane Highway Project',
    location: 'Varanasi, Uttar Pradesh',
    shortLocation: 'Varanasi, UP',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-700',
    image: '/highway_project.jpg',
    category: 'Road Infrastructure',
    startDate: '12 Jan 2023',
    endDate: '30 Dec 2024',
    description: 'A 4 lane highway to improve connectivity and boost local economy in the region.'
  },
  {
    id: 2,
    title: 'Government School',
    longTitle: 'Sarvodaya Government School Renovation',
    location: 'Lucknow, Uttar Pradesh',
    shortLocation: 'Lucknow, UP',
    status: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-700',
    image: '/govt_school.jpg',
    category: 'Education Infrastructure',
    startDate: '01 Mar 2024',
    endDate: '15 Aug 2024',
    description: 'Complete renovation of the main building with smart classrooms and new sports facilities.'
  },
  {
    id: 3,
    title: 'Water Supply Scheme',
    longTitle: 'Jal Jeevan Water Supply Scheme',
    location: 'Kanpur, Uttar Pradesh',
    shortLocation: 'Kanpur, UP',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-700',
    image: '/water_supply.jpg',
    category: 'Public Health',
    startDate: '10 Feb 2023',
    endDate: '20 Jan 2024',
    description: 'New water purification plant ensuring clean drinking water to over 50,000 households.'
  },
  {
    id: 4,
    title: 'Community Health Center',
    longTitle: 'Modern Community Health Center',
    location: 'Agra, Uttar Pradesh',
    shortLocation: 'Agra, UP',
    status: 'Ongoing',
    statusColor: 'bg-blue-100 text-blue-700',
    image: '/health_center.jpg',
    category: 'Healthcare Infrastructure',
    startDate: '05 May 2024',
    endDate: 'Expected early 2025',
    description: 'A multi-specialty community health center to provide affordable and accessible healthcare.'
  }
];

export default function WorkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Details');

  const work = worksData.find(w => w.id === parseInt(id)) || worksData[0];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: work.longTitle,
          text: `Check out this project: ${work.longTitle} in ${work.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Share feature is not supported on this browser.');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden pb-[80px]">
      
      {/* Banner Section with Back Arrow */}
      <div className="relative w-full aspect-[4/3] bg-gray-200 shrink-0 overflow-hidden sm:rounded-b-3xl">
        <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
        
        {/* Top Overlay Gradient for Back Button Visibility */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent"></div>

        {/* Back Button & Audio Icon (Mock) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button onClick={() => navigate(-1)} className="p-2 text-white hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 text-white bg-white/20 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-5 py-6">
        
        {/* Header Info */}
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide ${work.statusColor}`}>
            {work.status}
          </span>
          <button onClick={handleShare} className="text-gray-400 p-1 hover:text-[#f37920] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
          {work.longTitle}
        </h1>

        <div className="flex items-center text-gray-500 mb-4 text-sm font-semibold">
          <svg className="w-4 h-4 mr-1.5 text-[#f37920]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {work.location}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center text-sm font-bold text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {work.startDate}
          </div>
          <div className="flex items-center text-sm font-bold text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {work.endDate}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {['Details', 'Gallery', 'Before/After'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-[0.8rem] sm:text-sm font-bold py-2.5 px-1 rounded-lg transition-all ${activeTab === tab ? 'bg-white text-[#f37920] shadow-sm border border-orange-100' : 'text-gray-600 hover:text-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Details */}
        {activeTab === 'Details' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold text-[#1e293b] mb-2">Description</h3>
            <p className="text-[0.95rem] text-gray-600 font-medium leading-relaxed mb-6">
              {work.description}
            </p>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Category</span>
                <span className="font-bold text-gray-800">{work.category}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Area</span>
                <span className="font-bold text-gray-800">{work.shortLocation}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Share Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] flex gap-3">
        <button onClick={handleShare} className="w-14 h-14 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl flex items-center justify-center transition-colors shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <button onClick={handleShare} className="flex-1 bg-[#0f5132] hover:bg-[#0c4128] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-900/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>

    </div>
  );
}
