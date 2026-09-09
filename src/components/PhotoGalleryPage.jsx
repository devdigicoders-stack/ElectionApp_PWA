import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function PhotoGalleryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Rallies', 'Development', 'People'];

  const photos = [
    { id: 1, category: 'Rallies', url: 'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=400', height: 'h-64' },
    { id: 2, category: 'Development', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400', height: 'h-40' },
    { id: 3, category: 'People', url: 'https://images.unsplash.com/photo-1514574972183-11b30521e483?auto=format&fit=crop&q=80&w=400', height: 'h-48' },
    { id: 4, category: 'Rallies', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400', height: 'h-56' },
    { id: 5, category: 'Development', url: 'https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=400', height: 'h-64' },
    { id: 6, category: 'People', url: 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=400', height: 'h-40' }
  ];

  const filteredPhotos = activeTab === 'All' 
    ? photos 
    : photos.filter(p => p.category === activeTab);

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white shadow-sm z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">Photo Gallery</h1>
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

      {/* Masonry Grid Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="columns-2 gap-4 space-y-4 pb-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className={`w-full rounded-2xl overflow-hidden break-inside-avoid relative group active:scale-[0.98] transition-transform ${photo.height}`}>
              <img src={photo.url} alt="Gallery item" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-bold">{photo.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
