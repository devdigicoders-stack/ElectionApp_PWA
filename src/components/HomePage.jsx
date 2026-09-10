import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import UserAvatar from './UserAvatar';
import { FaXTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { getMediaUrl } from '../utils/mediaUrl';

export default function HomePage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, leaderName, tagline, logoUrl } = useTenant();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePoll, setActivePoll] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [tenantConfig, setTenantConfig] = useState(null);
  const [banners, setBanners] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [devProjects, setDevProjects] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [aboutLeader, setAboutLeader] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnread = async () => {
      const slug = api.getTenantSlug();
      if (!slug) return;
      try {
        const count = await api.getNotificationUnreadCount().catch(() => 0);
        setUnreadCount(typeof count === 'number' ? count : (count?.count || 0));
      } catch (err) {
        console.warn('Error fetching unread count:', err);
      }
    };
    fetchUnread();
  }, []);

  useEffect(() => {
    const user = storage.getUser();
    if (user) setCurrentUser(user);

    const currentSlug = api.getTenantSlug();

    const loadAllHomeData = async () => {
      // If no tenant slug is configured in .env, do not fetch tenant data from backend.
      if (!currentSlug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // 1. Fetch Tenant Configuration & White-label Branding
        const configRes = await api.getConfig().catch(() => null);
        if (configRes) {
          setTenantConfig(configRes);
        }

        // 2. Fetch Active Banners
        const bannersRes = await api.getBanners().catch(() => []);
        if (Array.isArray(bannersRes) && bannersRes.length > 0) {
          setBanners(bannersRes);
        }

        // 3. Fetch Active Polls
        const polls = await api.getActivePolls().catch(() => []);
        if (Array.isArray(polls) && polls.length > 0) {
          setActivePoll(polls[0]);
        }

        // 4. Fetch Latest News & Updates
        const newsRes = await api.getNews({ limit: 4 }).catch(() => []);
        const newsList = Array.isArray(newsRes) ? newsRes : (newsRes?.data || []);
        if (newsList.length > 0) {
          setLatestUpdates(newsList);
        }

        // 5. Fetch Upcoming Events
        const eventsRes = await api.getEvents({ upcoming: 'true', limit: 4 }).catch(() => []);
        const eventsList = Array.isArray(eventsRes?.items) 
          ? eventsRes.items 
          : (Array.isArray(eventsRes?.data?.items) 
              ? eventsRes.data.items 
              : (Array.isArray(eventsRes?.data) 
                  ? eventsRes.data 
                  : (Array.isArray(eventsRes) ? eventsRes : [])));
        if (eventsList.length > 0) {
          setUpcomingEvents(eventsList);
        }

        // 6. Fetch Development Works
        const worksRes = await api.getWorks({ limit: 4 }).catch(() => []);
        const worksList = Array.isArray(worksRes) ? worksRes : (worksRes?.data || []);
        if (worksList.length > 0) {
          setDevProjects(worksList);
        }

        // 7. Fetch Photo Gallery
        const galleryRes = await api.getGallery({ limit: 4 }).catch(() => []);
        const galleryList = Array.isArray(galleryRes) ? galleryRes : (galleryRes?.data || []);
        if (galleryList.length > 0) {
          setGalleryPhotos(galleryList);
        }

        // 8. Fetch About Leader
        const leaderRes = await api.getAboutLeader().catch(() => null);
        if (leaderRes) {
          setAboutLeader(leaderRes);
        }
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllHomeData();
  }, []);

  // Display slides from backend banners or clean tenant branding banner
  const displaySlides = banners.length > 0 
    ? banners.map(b => ({
        img: getMediaUrl(b.imageUrl || b.image),
        title: b.title || 'जनसंपर्क अभियान',
        badge: b.category || 'Jan Sabha',
        desc: b.description || b.subtitle || '',
        linkUrl: b.linkUrl || null
      }))
    : [
        {
          img: tenantConfig?.branding?.heroBannerUrl || tenantConfig?.branding?.logoUrl || '/image copy 3.png',
          title: tenantConfig?.branding?.tagline || 'सेवा, संकल्प और विकास ही हमारी पहचान',
          badge: leaderName || 'जनसेवा',
          desc: tenantConfig?.tenant?.constituency ? `Constituency: ${tenantConfig.tenant.constituency}` : 'Direct Citizen Engagement & Public Welfare',
          linkUrl: null
        }
      ];

  const getRouteButtonLabel = (url) => {
    if (!url) return null;
    const clean = url.trim().toLowerCase();
    if (clean.includes('event')) return { text: 'View Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' };
    if (clean.includes('work') || clean.includes('dev')) return { text: 'Explore Works', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' };
    if (clean.includes('poll')) return { text: 'Vote in Poll', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' };
    if (clean.includes('complaint')) return { text: 'Register Grievance', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    if (clean.includes('membership')) return { text: 'Join Membership', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' };
    if (clean.includes('volunteer')) return { text: 'Join as Volunteer', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' };
    if (clean.includes('gallery') || clean.includes('photo')) return { text: 'View Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' };
    if (clean.includes('news') || clean.includes('update')) return { text: 'Read Updates', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' };
    if (clean.includes('about')) return { text: 'Know More', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    return { text: 'Explore Now', icon: 'M13 7l5 5m0 0l-5 5m5-5H6' };
  };

  const handleBannerClick = (slide) => {
    if (!slide.linkUrl) return;
    const target = slide.linkUrl.trim();
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else {
      navigate(target.startsWith('/') ? target : `/${target}`);
    }
  };

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  // Categories / Quick Actions Grid
  const categories = [
    { name: 'Development', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', bgColor: 'bg-[#e8f5e9]', color: 'text-[#2e7d32]', path: '/works' },
    { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bgColor: 'bg-[#fff3e0]', color: 'text-[#ef6c00]', path: '/events' },
    { name: 'Polls', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bgColor: 'bg-[#e3f2fd]', color: 'text-[#1565c0]', path: '/polls' },
    { name: 'Complaint', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bgColor: 'bg-[#fff3e0]', color: 'text-[#d84315]', path: '/my-complaints' },
    { name: 'Membership', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', bgColor: 'bg-[#ffebee]', color: 'text-[#c62828]', path: '/membership' },
    { name: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', bgColor: 'bg-[#e8f5e9]', color: 'text-[#2e7d32]', path: '/photo-gallery' },
    { name: 'Volunteer', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', bgColor: 'bg-[#f3e5f5]', color: 'text-[#8e24aa]', path: '/volunteer' },
    { name: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', bgColor: 'bg-[#e0f7fa]', color: 'text-[#00838f]', path: '/latest-updates' },
  ];

  const appName = leaderName || tenantConfig?.branding?.leaderName || tenantConfig?.tenant?.name || 'जनसंपर्क';
  const appTagline = tagline || tenantConfig?.branding?.tagline || '';
  const currentLogo = logoUrl || tenantConfig?.branding?.logoUrl || '/image copy 3.png';

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      {/* Top App Bar with Dynamic White-Label Branding */}
      <div className="flex items-center justify-between px-4 py-2.5 shrink-0 bg-white z-20 shadow-xs relative border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 bg-white shadow-xs flex items-center justify-center p-0.5"
            style={{ borderColor: `${primaryColor}30` }}
          >
            <img 
              src={currentLogo} 
              alt="Logo" 
              className="w-full h-full object-cover rounded-full" 
              onError={(e) => { e.target.src = '/image copy 3.png'; }} 
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-base font-black text-gray-900 leading-tight tracking-tight truncate max-w-[175px] sm:max-w-xs">{appName}</h1>
            {appTagline && (
              <p 
                className="text-[0.62rem] font-bold tracking-wider mt-0.5 uppercase truncate max-w-[175px]"
                style={{ color: primaryColor }}
              >
                {appTagline}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/notifications')}
            className="relative text-gray-800 hover:opacity-80 active:scale-95 transition-all p-1"
            style={{ color: primaryColor }}
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span 
                className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[0.58rem] font-black text-white flex items-center justify-center rounded-full ring-2 ring-white"
                style={{ backgroundColor: primaryColor }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate('/search')}
            className="text-gray-800 hover:opacity-80 active:scale-95 transition-all p-1"
            style={{ color: primaryColor }}
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div
            onClick={() => navigate('/my-profile')}
            className="w-9 h-9 rounded-full overflow-hidden border shadow-xs flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            style={{ borderColor: `${primaryColor}40` }}
          >
            <UserAvatar 
              src={currentUser?.photo} 
              name={currentUser?.name} 
              className="w-full h-full" 
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        {/* Slider Banner */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-slate-900 shrink-0 overflow-hidden shadow-inner">
          <div
            className="flex w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {displaySlides.map((slide, idx) => (
              <div 
                key={idx} 
                onClick={() => handleBannerClick(slide)}
                className={`min-w-full h-full relative overflow-hidden flex flex-col justify-end p-4 ${slide.linkUrl ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}
              >
                {/* Background Image */}
                <img 
                  src={slide.img} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover object-center" 
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                
                {/* Content Overlay */}
                <div className="relative z-20 text-white mb-2 max-w-[88%] flex flex-col items-start">
                  <span 
                    className="inline-block text-white text-[0.6rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {slide.badge}
                  </span>
                  <h3 className="text-sm sm:text-base font-black leading-tight drop-shadow-md truncate w-full">
                    {slide.title}
                  </h3>
                  {slide.desc && (
                    <p className="text-[0.68rem] text-gray-200 font-medium line-clamp-1 opacity-90 mb-1.5">
                      {slide.desc}
                    </p>
                  )}
                  {slide.linkUrl && (() => {
                    const btn = getRouteButtonLabel(slide.linkUrl);
                    return (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBannerClick(slide);
                        }}
                        className="mt-1.5 px-3 py-1 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 active:scale-95 transition-all hover:opacity-95"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span>{btn.text}</span>
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
                        </svg>
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Slide Indicators */}
          {displaySlides.length > 1 && (
            <div className="absolute bottom-2.5 right-4 flex justify-end gap-1.5 z-30">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-5 shadow' : 'bg-white/60 w-1.5'}`}
                  style={{ backgroundColor: currentSlide === idx ? primaryColor : undefined }}
                ></button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
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

          {/* Latest Updates / News Section */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Latest Updates</h2>
              <button 
                onClick={() => navigate('/latest-updates')} 
                className="text-xs font-bold transition-opacity hover:opacity-80"
                style={{ color: secondaryColor }}
              >
                View All →
              </button>
            </div>
            {latestUpdates.length > 0 ? (
              <div className="flex flex-col gap-3">
                {latestUpdates.map(item => (
                  <div key={item._id || item.id} onClick={() => navigate('/latest-updates')} className="flex gap-3 items-center bg-[#f8fafc] rounded-2xl p-3 cursor-pointer active:scale-[0.98] transition-transform border border-gray-100">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <img src={item.coverImage || item.imageUrl || item.img || 'https://images.unsplash.com/photo-1532375810565-c0ba94c93ebc?auto=format&fit=crop&q=80&w=400'} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span 
                        className="text-[0.6rem] font-bold uppercase tracking-widest mb-0.5"
                        style={{ color: secondaryColor }}
                      >
                        {item.category || 'News'}
                      </span>
                      <p className="text-xs font-extrabold text-gray-900 leading-snug line-clamp-2">{item.title}</p>
                      <span className="text-[0.65rem] font-semibold text-gray-400 mt-1">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (item.date || 'Recent')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No new announcements yet. Check back soon!
              </div>
            )}
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Upcoming Events Section */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Upcoming Events</h2>
              <button 
                onClick={() => navigate('/events')} 
                className="text-xs font-bold transition-opacity hover:opacity-80"
                style={{ color: secondaryColor }}
              >
                View All →
              </button>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {upcomingEvents.map(event => (
                  <div key={event._id || event.id} onClick={() => navigate(`/events/${event._id || event.id}`)} className="shrink-0 w-44 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.97] transition-transform hover:border-orange-200">
                    <div className="w-full h-28 relative overflow-hidden bg-gray-100">
                      <img src={event.bannerUrl || event.img || 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=400'} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-3 right-2">
                        <p className="text-white text-xs font-extrabold leading-tight line-clamp-1">{event.title}</p>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-2.5 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-gray-500 truncate">
                        <svg className="w-3 h-3 shrink-0" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location || 'Local Constituency'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-gray-500">
                        <svg className="w-3 h-3 shrink-0" style={{ color: secondaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Upcoming'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No scheduled events at this moment.
              </div>
            )}
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Development Projects */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Development Works</h2>
              <button 
                onClick={() => navigate('/works')} 
                className="text-xs font-bold transition-opacity hover:opacity-80"
                style={{ color: secondaryColor }}
              >
                View All →
              </button>
            </div>
            {devProjects.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {devProjects.map(proj => (
                  <div key={proj._id || proj.id} onClick={() => navigate(`/works/${proj._id || proj.id}`)} className="shrink-0 w-40 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.97] transition-transform">
                    <div className="w-full h-24 relative overflow-hidden bg-gray-100">
                      <img src={proj.coverImageUrl || proj.img || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'} alt={proj.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/25"></div>
                    </div>
                    <div className="bg-white px-3 py-2.5 flex flex-col gap-1">
                      <p className="text-xs font-extrabold text-gray-900 leading-tight line-clamp-1">{proj.title}</p>
                      <span 
                        className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md self-start"
                        style={{ 
                          backgroundColor: `${secondaryColor}15`, 
                          color: secondaryColor 
                        }}
                      >
                        {proj.status || 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                Ongoing development work records will appear here.
              </div>
            )}
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Active Poll Preview */}
          {activePoll && (
            <div className="px-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-[#1e293b]">Active Poll</h2>
                <button 
                  onClick={() => navigate('/polls')} 
                  className="text-xs font-bold transition-opacity hover:opacity-80"
                  style={{ color: secondaryColor }}
                >
                  {activePoll.userVoted ? 'View Poll →' : 'Vote Now →'}
                </button>
              </div>
              <div onClick={() => navigate('/polls')} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform">
                <p className="text-sm font-extrabold text-gray-900 mb-4 leading-snug">{activePoll.question}</p>
                <div className="flex flex-col gap-2.5">
                  {(activePoll.options || []).map((opt, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-gray-700">
                        <span>{opt.text}</span>
                        <span style={{ color: primaryColor }}>{opt.votesCount || opt.percent || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ 
                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                            width: `${opt.percent || Math.min(opt.votesCount * 10, 100) || 10}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Photo Gallery Preview */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#1e293b]">Photo Gallery</h2>
              <button 
                onClick={() => navigate('/photo-gallery')} 
                className="text-xs font-bold transition-opacity hover:opacity-80"
                style={{ color: secondaryColor }}
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(galleryPhotos.length > 0 ? galleryPhotos : [
                { url: 'https://images.unsplash.com/photo-1541888087405-d61db6c1e13a?auto=format&fit=crop&q=80&w=400' },
                { url: 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=400' }
              ]).map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/photo-gallery')}
                  className={`rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all bg-white border border-gray-100 shadow-xs relative flex items-center justify-center ${i === 0 ? 'col-span-2 h-44' : 'h-32'}`}
                >
                  <img 
                    src={getMediaUrl(item.imageUrl || item.url || item)} 
                    alt={item.title || "Gallery"} 
                    className="w-full h-full object-contain p-2" 
                  />
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-2.5 pt-6 text-white">
                      <p className="text-xs font-bold truncate drop-shadow">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Leader Message Card */}
          <div className="px-5 mt-2">
            <div 
              className="border rounded-2xl p-4 relative overflow-hidden shadow-sm"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}15)`,
                borderColor: `${primaryColor}30` 
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 shadow-sm bg-gray-100"
                  style={{ borderColor: primaryColor }}
                >
                  <img 
                    src={aboutLeader?.photoUrl || tenantConfig?.branding?.leaderPhotoUrl || '/profile_avatar.jpg'} 
                    alt="Leader" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = '/profile_avatar.jpg'; }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-gray-900">{aboutLeader?.name || leaderName || 'माननीय जन प्रतिनिधि'}</h3>
                    <span 
                      className="text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {aboutLeader?.designation || 'Leader'}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-gray-500 font-semibold">{aboutLeader?.constituency || 'Janseva Portal'}</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-700 italic leading-relaxed">
                "{aboutLeader?.vision || aboutLeader?.shortBio || tagline || 'जन सेवा ही हमारा संकल्प है। अपनी समस्याओं और सुझावों के लिए हमसे जुड़े रहें।'}"
              </p>
              <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between">
                <button 
                  onClick={() => navigate('/about')} 
                  className="text-xs font-bold hover:underline flex items-center gap-1"
                  style={{ color: primaryColor }}
                >
                  Read Full Bio & Vision →
                </button>
                <span className="text-[0.65rem] font-bold text-gray-400">Public Representative</span>
              </div>
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Social Media & Contact Helpline Bar */}
          <div className="px-5">
            <h2 className="text-base font-extrabold text-[#1e293b] mb-3">Connect & Helpline</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <a href="tel:1800123456" className="flex items-center gap-2.5 bg-green-50 border border-green-200/70 p-3 rounded-xl active:scale-[0.98] transition-transform">
                <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold text-gray-500">Toll-Free Helpline</p>
                  <p className="text-xs font-extrabold text-gray-900">1800-123-456</p>
                </div>
              </a>

              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/70 p-3 rounded-xl active:scale-[0.98] transition-transform">
                <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 font-black text-xs">
                  WA
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold text-gray-500">WhatsApp Helpdesk</p>
                  <p className="text-xs font-extrabold text-gray-900">+91 9876543210</p>
                </div>
              </a>
            </div>

            {/* Social Channels Row */}
            <div className="flex items-center justify-between bg-[#f8fafc] border border-gray-200/80 rounded-xl p-3">
              <span className="text-xs font-bold text-gray-700">Follow Leader:</span>
              <div className="flex items-center gap-2">
                {[
                  { name: 'X', color: 'bg-black text-white', icon: <FaXTwitter className="w-3.5 h-3.5" /> },
                  { name: 'FB', color: 'bg-[#1877F2] text-white', icon: <FaFacebookF className="w-3.5 h-3.5" /> },
                  { name: 'IG', color: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white', icon: <FaInstagram className="w-3.5 h-3.5" /> },
                  { name: 'YT', color: 'bg-[#FF0000] text-white', icon: <FaYoutube className="w-3.5 h-3.5" /> }
                ].map((s, i) => (
                  <button key={i} className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center shadow-sm active:scale-90 transition-transform`}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-2 bg-[#f8fafc] my-5"></div>

          {/* Jan Samasya CTA */}
          <div className="px-5">
            <div
              onClick={() => navigate('/complaint')}
              className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` 
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-white font-extrabold text-base leading-tight">Jan Samasya Portal</h3>
                <p className="text-white/80 text-xs font-semibold mt-0.5">Submit complaint & track status</p>
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
