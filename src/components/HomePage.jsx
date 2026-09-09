import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    '/image copy 5.png',
    'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=800',
    '/image.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const categories = [
    { name: 'Development', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', bgColor: 'bg-[#e8f5e9]', color: 'text-[#2e7d32]', path: '/works' },
    { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bgColor: 'bg-[#fff3e0]', color: 'text-[#ef6c00]', path: '/events' },
    { name: 'Polls', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bgColor: 'bg-[#e3f2fd]', color: 'text-[#1565c0]', path: '/polls' },
    { name: 'Complaint', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bgColor: 'bg-[#fff3e0]', color: 'text-[#d84315]', path: '/complaint' },
    { name: 'Membership', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', bgColor: 'bg-[#ffebee]', color: 'text-[#c62828]', path: '/my-complaints' },
    { name: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', bgColor: 'bg-[#e8f5e9]', color: 'text-[#2e7d32]', path: '/photo-gallery' },
    { name: 'Video', icon: 'M15 10l4.553-2.069A1 1 0 0121 8.871v6.258a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', bgColor: 'bg-[#f3e5f5]', color: 'text-[#8e24aa]', path: '/video-gallery' },
    { name: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', bgColor: 'bg-[#e0f7fa]', color: 'text-[#00838f]', path: '/latest-updates' },
  ];

  // Data from various pages
  const latestUpdates = [
    { id: 1, title: 'PM Modi addresses youth at Varanasi', category: 'Announcements', date: '09 Sep 2026', img: 'https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'New development projects approved for UP', category: 'Announcements', date: '05 Sep 2026', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'BJP launches membership drive across states', category: 'Articles', date: '02 Sep 2026', img: 'https://images.unsplash.com/photo-1514574972183-11b30521e483?auto=format&fit=crop&q=80&w=400' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'BJP Jan Sabha', location: 'Varanasi, UP', date: '20 Oct 2026', img: 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Youth Meet', location: 'Lucknow, UP', date: '23 Oct 2026', img: 'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Mahila Sammelan', location: 'Kanpur, UP', date: '15 Oct 2026', img: 'https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=400' },
  ];

  const devProjects = [
    { id: 1, title: 'Purvanchal Expressway', status: 'Completed', img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Health Centre - Phase 2', status: 'In Progress', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Govt School Renovation', status: 'Completed', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400' },
  ];

  const activePoll = {
    question: "Which sector needs immediate attention in your area?",
    options: [
      { text: 'Road Infrastructure', percent: 45 },
      { text: 'Water Supply', percent: 30 },
      { text: 'Healthcare', percent: 25 },
    ]
  };

  const galleryPhotos = [
    'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1514574972183-11b30521e483?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
  ];

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-white z-20 shadow-sm relative">
        <div className="flex items-center gap-2.5">
          <img src="/image copy 3.png" alt="BJP Logo" className="w-9 h-9 object-contain" />
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-black text-gray-900 leading-none tracking-tight">BJP</h1>
            <p className="text-[0.65rem] font-bold text-[#f37920] tracking-widest mt-0.5">JANSAMPARK</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-800 hover:text-[#f37920] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div
            onClick={() => navigate('/my-profile')}
            className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <img src="/profile_avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        {/* Slider Banner */}
        <div className="relative w-full aspect-[16/7] bg-[#f37920] shrink-0 overflow-hidden">
          <div
            className="flex w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((src, idx) => (
              <div key={idx} className="min-w-full h-full relative">
                <img src={src} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover object-top" />
                {(idx === 1 || idx === 2) && <div className="absolute inset-0 bg-black/25"></div>}
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
              ></button>
            ))}
          </div>
        </div>

        {/* White card pulled over banner */}
        <div className="relative z-20 w-full bg-white flex flex-col pb-8">
          
          {/* Categories Grid */}
          <div className="px-5 pt-6 pb-2">
            <div className="grid grid-cols-4 gap-y-5 gap-x-2">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => { if (cat.path) navigate(cat.path); }}
                >
                  <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center shadow-sm group-hover:shadow-md group-active:scale-95 transition-all`}>
                    <svg className={`w-5 h-5 ${cat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                    </svg>
                  </div>
                  <span className="text-[0.6rem] font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Latest Updates Section */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Latest Updates</h2>
              <button onClick={() => navigate('/latest-updates')} className="text-xs font-bold text-[#f37920]">View All →</button>
            </div>
            <div className="flex flex-col gap-3">
              {latestUpdates.map(item => (
                <div key={item.id} onClick={() => navigate('/latest-updates')} className="flex gap-3 items-center bg-[#f8fafc] rounded-2xl p-3 cursor-pointer active:scale-[0.98] transition-transform border border-gray-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`text-[0.6rem] font-bold uppercase tracking-widest mb-1 ${item.category === 'Announcements' ? 'text-[#f37920]' : 'text-blue-500'}`}>{item.category}</span>
                    <p className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2">{item.title}</p>
                    <span className="text-[0.65rem] font-semibold text-gray-400 mt-1">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Upcoming Events Section */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Upcoming Events</h2>
              <button onClick={() => navigate('/events')} className="text-xs font-bold text-[#f37920]">View All →</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {upcomingEvents.map(event => (
                <div key={event.id} onClick={() => navigate('/events')} className="shrink-0 w-44 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.97] transition-transform">
                  <div className="w-full h-28 relative overflow-hidden">
                    <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-3 right-2">
                      <p className="text-white text-xs font-extrabold leading-tight">{event.title}</p>
                    </div>
                  </div>
                  <div className="bg-white px-3 py-2.5 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-gray-500">
                      <svg className="w-3 h-3 text-[#f37920] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-gray-500">
                      <svg className="w-3 h-3 text-[#f37920] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Development Projects */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Development Works</h2>
              <button onClick={() => navigate('/works')} className="text-xs font-bold text-[#f37920]">View All →</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {devProjects.map(proj => (
                <div key={proj.id} onClick={() => navigate('/works')} className="shrink-0 w-40 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.97] transition-transform">
                  <div className="w-full h-24 relative overflow-hidden">
                    <img src={proj.img} alt={proj.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30"></div>
                  </div>
                  <div className="bg-white px-3 py-2.5 flex flex-col gap-1">
                    <p className="text-xs font-extrabold text-gray-900 leading-tight line-clamp-2">{proj.title}</p>
                    <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md self-start ${proj.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Active Poll Preview */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Active Poll</h2>
              <button onClick={() => navigate('/polls')} className="text-xs font-bold text-[#f37920]">Vote Now →</button>
            </div>
            <div onClick={() => navigate('/polls')} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform">
              <p className="text-sm font-extrabold text-gray-900 mb-4 leading-snug">{activePoll.question}</p>
              <div className="flex flex-col gap-2.5">
                {activePoll.options.map((opt, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>{opt.text}</span>
                      <span className="text-[#f37920]">{opt.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f37920] to-[#ffb347] rounded-full"
                        style={{ width: `${opt.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Photo Gallery Preview */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Photo Gallery</h2>
              <button onClick={() => navigate('/photo-gallery')} className="text-xs font-bold text-[#f37920]">View All →</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {galleryPhotos.map((url, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/photo-gallery')}
                  className={`rounded-2xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform ${i === 0 ? 'col-span-2 h-40' : 'h-28'}`}
                >
                  <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Jan Samasya CTA */}
          <div className="px-5">
            <div
              onClick={() => navigate('/complaint')}
              className="bg-gradient-to-r from-[#f37920] to-[#ff9950] rounded-2xl p-5 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform shadow-lg shadow-orange-500/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-white font-extrabold text-base leading-tight">Jan Samasya</h3>
                <p className="text-white/80 text-xs font-semibold mt-0.5">File a complaint about local issues</p>
              </div>
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
