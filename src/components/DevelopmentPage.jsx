import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function DevelopmentPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Road', 'Education', 'Health'];

  const works = [
    {
      id: 1,
      title: 'New Highway Project',
      location: 'Varanasi, UP',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      image: '/highway_project.jpg',
      category: 'Road'
    },
    {
      id: 2,
      title: 'Government School',
      location: 'Lucknow, UP',
      status: 'In Progress',
      statusColor: 'bg-blue-100 text-blue-700',
      image: '/govt_school.jpg',
      category: 'Education'
    },
    {
      id: 3,
      title: 'Water Supply Scheme',
      location: 'Kanpur, UP',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      image: '/water_supply.jpg',
      category: 'Health' // Approximating category for water supply
    },
    {
      id: 4,
      title: 'Community Health Center',
      location: 'Agra, UP',
      status: 'Ongoing',
      statusColor: 'bg-blue-100 text-blue-700',
      image: '/health_center.jpg',
      category: 'Health'
    }
  ];

  const filteredWorks = activeFilter === 'All' 
    ? works 
    : works.filter(w => w.category === activeFilter);

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Top App Bar */}
      <div className="flex items-center px-5 py-4 shrink-0 bg-white shadow-sm z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-1 -ml-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-3 tracking-wide">Development Works</h1>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="p-5 flex flex-col gap-5">
          
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f37920] focus:border-[#f37920] sm:text-sm font-medium transition-shadow shadow-sm"
              placeholder="Search works..."
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeFilter === filter 
                    ? 'bg-[#f37920] text-white shadow-md shadow-orange-500/20' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Works List */}
          <div className="flex flex-col gap-4">
            {filteredWorks.map((work) => (
              <div 
                key={work.id} 
                onClick={() => navigate(`/works/${work.id}`)}
                className="bg-white rounded-2xl p-3 flex gap-4 shadow-sm border border-gray-100 items-center cursor-pointer transition-transform active:scale-[0.98] hover:shadow-md"
              >
                {/* Image */}
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Details */}
                <div className="flex flex-col flex-1 py-1">
                  <h3 className="text-[1.05rem] font-bold text-gray-900 leading-tight mb-1">{work.title}</h3>
                  <p className="text-[0.8rem] text-gray-500 font-semibold mb-3">{work.location}</p>
                  
                  {/* Badge */}
                  <div className="mt-auto">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[0.7rem] font-bold tracking-wide ${work.statusColor}`}>
                      {work.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
