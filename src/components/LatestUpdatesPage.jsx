import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const ITEMS_PER_PAGE = 4;

export default function LatestUpdatesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  
  const tabs = ['All', 'Announcements', 'Articles'];

  const updates = [
    {
      id: 1,
      title: 'PM Modi addresses youth at Varanasi',
      category: 'Announcements',
      date: '09 Sep 2026',
      thumbnail: 'https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      title: 'New development projects approved for UP',
      category: 'Announcements',
      date: '05 Sep 2026',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      title: 'BJP launches membership drive across states',
      category: 'Articles',
      date: '02 Sep 2026',
      thumbnail: 'https://images.unsplash.com/photo-1514574972183-11b30521e483?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 4,
      title: 'Women empowerment initiative announced',
      category: 'Articles',
      date: '29 Aug 2026',
      thumbnail: 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 5,
      title: 'Infrastructure summit highlights key projects',
      category: 'Announcements',
      date: '25 Aug 2026',
      thumbnail: 'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 6,
      title: 'Digital India program expansion update',
      category: 'Articles',
      date: '20 Aug 2026',
      thumbnail: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'
    },
  ];

  const filtered = activeTab === 'All' ? updates : updates.filter(u => u.category === activeTab);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white shadow-sm z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">Latest Updates</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 shrink-0 shadow-sm z-10 flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="flex flex-col gap-4 pb-4">
          {paginated.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex gap-4 p-4 items-center active:scale-[0.98] transition-transform cursor-pointer">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1">
                <span className={`text-[0.65rem] font-bold uppercase tracking-widest mb-1.5 ${item.category === 'Announcements' ? 'text-[#f37920]' : 'text-blue-600'}`}>
                  {item.category}
                </span>
                <h3 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2 mb-1.5">{item.title}</h3>
                <span className="text-xs font-semibold text-gray-400">{item.date}</span>
              </div>
              <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${page === p ? 'bg-[#f37920] text-white shadow-md shadow-orange-500/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
