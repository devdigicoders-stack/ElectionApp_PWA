import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function VideoGalleryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Speeches', 'Campaign', 'Shorts'];

  const videos = [
    {
      id: 1,
      title: 'Vision for Viksit Bharat',
      category: 'Speeches',
      date: '12 Sep 2026',
      views: '245K views',
      thumbnail: 'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'BJP Sankalp Rally',
      category: 'Campaign',
      date: '8 Sep 2026',
      views: '180K views',
      thumbnail: 'https://images.unsplash.com/photo-1514574972183-11b30521e483?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const filteredVideos = activeTab === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeTab);

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white shadow-sm z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">Video Gallery</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 shrink-0 shadow-sm z-10 overflow-x-auto scrollbar-hide flex gap-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="flex flex-col gap-6 pb-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="flex flex-col group cursor-pointer active:scale-[0.99] transition-transform">
              <div className="w-full h-48 rounded-2xl overflow-hidden relative mb-3 bg-gray-200 shadow-sm border border-gray-100">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-[#f37920] transition-all">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-base font-extrabold text-gray-900 leading-tight mb-1 px-1">{video.title}</h3>
              <div className="flex items-center gap-2 px-1 text-xs font-semibold text-gray-500">
                <span>{video.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{video.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
