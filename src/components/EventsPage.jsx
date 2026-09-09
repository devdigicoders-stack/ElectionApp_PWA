import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';

export default function EventsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Upcoming');
  
  // Register Modal State
  const [registeringEvent, setRegisteringEvent] = useState(null);

  const filters = ['Upcoming', 'Past', 'My Events'];

  const events = [
    {
      id: 1,
      title: 'BJP Jan Sabha',
      location: 'Varanasi, UP',
      date: '25 Sep 2026',
      time: '10:00 AM',
      image: '/event_jan_sabha.jpg',
      category: 'Upcoming'
    },
    {
      id: 2,
      title: 'Youth Meet',
      location: 'Lucknow, UP',
      date: '02 Oct 2026',
      time: '12:00 PM',
      image: '/event_youth_meet.jpg',
      category: 'Upcoming'
    },
    {
      id: 3,
      title: 'Mahila Sammelan',
      location: 'Kanpur, UP',
      date: '15 Oct 2026',
      time: '11:00 AM',
      image: '/event_mahila_sammelan.jpg',
      category: 'Upcoming'
    }
  ];

  const filteredEvents = activeFilter === 'Upcoming' 
    ? events 
    : events.filter(e => e.category === activeFilter);

  const handleInterested = () => {
    toast.success('Thank you for showing interest!');
  };

  const handleRegisterClick = (event) => {
    setRegisteringEvent(event);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisteringEvent(null);
    toast.success('Thank you for registration!');
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Registration Modal */}
      {registeringEvent && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-orange-50 px-5 py-4 border-b border-orange-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Register for Event</h3>
                <p className="text-xs text-orange-600 font-bold truncate max-w-[200px]">{registeringEvent.title}</p>
              </div>
              <button onClick={() => setRegisteringEvent(null)} className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920]" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number</label>
                <input required type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920]" placeholder="Enter mobile number" />
              </div>
              
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setRegisteringEvent(null)} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-[#f37920] hover:bg-[#d86616] shadow-md shadow-orange-500/20 transition-colors">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white shadow-sm z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">Events</h1>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="p-5 flex flex-col gap-6">

          {/* Filter Chips */}
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
                  activeFilter === filter 
                    ? 'bg-[#f37920] text-white shadow-md shadow-orange-500/20' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="flex flex-col gap-5">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-md p-4 flex flex-col gap-4 shadow-sm border border-gray-100 transition-transform hover:shadow-md">
                
                {/* Top Row: Image & Details */}
                <div className="flex gap-4 items-center">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 font-semibold mb-2">{event.location}</p>
                    
                    <div className="flex flex-col gap-1 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Buttons */}
                <div className="flex gap-3 pt-1">
                  <button 
                    onClick={handleInterested}
                    className="flex-1 py-2.5 rounded-md border-2 border-blue-100 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
                  >
                    Interested
                  </button>
                  <button 
                    onClick={() => handleRegisterClick(event)}
                    className="flex-1 py-2.5 rounded-md bg-[#f37920] text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:bg-[#d86616] transition-colors"
                  >
                    Register
                  </button>
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
