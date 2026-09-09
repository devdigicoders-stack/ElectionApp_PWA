import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MyComplaintsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Pending', 'In Progress', 'Resolved'];

  const complaints = [
    {
      id: 'CMP-2026-000123',
      title: 'Water Supply Issue',
      status: 'In Progress',
      date: '10 Sep 2026',
      image: 'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'CMP-2026-000122',
      title: 'Road Repair Request',
      status: 'Resolved',
      date: '05 Sep 2026',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'CMP-2026-000121',
      title: 'Street Light Problem',
      status: 'Pending',
      date: '12 Sep 2026',
      image: 'https://images.unsplash.com/photo-1514574972183-11b30521e483?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'CMP-2026-000120',
      title: 'School Infrastructure',
      status: 'Resolved',
      date: '28 Aug 2026',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const filteredComplaints = activeTab === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === activeTab);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-red-50 text-red-600';
      case 'In Progress': return 'bg-blue-50 text-blue-600';
      case 'Resolved': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
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
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">My Complaints</h1>
        <div className="ml-auto">
          <button onClick={() => navigate('/complaint')} className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-[#f37920]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 pt-2 border-b border-gray-100 shrink-0 shadow-sm z-10 overflow-x-auto scrollbar-hide flex gap-4">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-3 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === tab ? 'border-[#f37920] text-[#f37920]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="flex flex-col gap-4 pb-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => (
              <div key={complaint.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center relative active:scale-[0.98] transition-transform cursor-pointer">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={complaint.image} alt={complaint.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight mb-1">{complaint.title}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-2">{complaint.id}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[0.65rem] font-extrabold uppercase tracking-widest ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 ml-auto">{complaint.date}</span>
                  </div>
                </div>
                
                {/* Options Menu Icon */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-500 font-medium text-sm">No complaints found.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
