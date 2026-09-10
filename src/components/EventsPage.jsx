import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';
import { eventsStorage } from '../services/eventsData';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { getMediaUrl } from '../utils/mediaUrl';
import { 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiBuildingLibrary, 
  HiStar, 
  HiHandThumbUp, 
  HiTicket, 
  HiShare, 
  HiArrowLeft, 
  HiXMark, 
  HiCheck 
} from 'react-icons/hi2';

export default function EventsPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const filterRefs = useRef({});
  const tabRefs = useRef({});

  const tabs = ['Upcoming', 'Past', 'My Events'];
  const eventTypes = ['All', 'Jan Sabha', 'Rally', 'Meeting', 'Blood Donation', 'Membership Drive', 'Social Program'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await api.getEvents().catch(() => []);
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (list.length > 0) {
          const formatted = list.map(e => ({
            id: e._id || e.id,
            _id: e._id,
            title: e.title,
            eventType: e.eventType || e.category || 'Jan Sabha',
            category: new Date(e.startDate) < new Date() ? 'Past' : 'Upcoming',
            date: e.startDate ? new Date(e.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Upcoming',
            time: e.startDate ? new Date(e.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            location: e.location || 'Local Constituency',
            image: getMediaUrl((Array.isArray(e.images) && e.images[0]) || e.bannerUrl || e.img, 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?auto=format&fit=crop&q=80&w=600'),
            description: e.description || '',
            requiresRegistration: e.isRegistrationRequired !== false,
          }));
          setEvents(formatted);
        } else {
          setEvents([]);
        }
        setRsvpStatus(eventsStorage.getRsvp());
      } catch (err) {
        console.warn('Error fetching events:', err);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto-scroll the active filter pill into view smoothly
  useEffect(() => {
    if (filterRefs.current[activeFilter]) {
      filterRefs.current[activeFilter].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeFilter]);

  const activeTabIndex = tabs.indexOf(activeTab);

  const getFilteredListForTab = (tabName) => {
    return events.filter((e) => {
      if (tabName === 'Upcoming' && e.category !== 'Upcoming') return false;
      if (tabName === 'Past' && e.category !== 'Past') return false;
      if (tabName === 'My Events' && !rsvpStatus[e.id]) return false;
      if (activeFilter !== 'All' && e.eventType !== activeFilter) return false;
      return true;
    });
  };

  const handleInterested = async (eventId, e) => {
    e.stopPropagation();
    try {
      await api.rsvpEvent(eventId, 'interested').catch(() => {});
    } catch {}
    const updated = eventsStorage.setRsvp(eventId, 'Interested');
    setRsvpStatus({ ...updated });
    toast.success('Marked as Interested! Reminder will be sent.');
  };

  const handleGoing = async (eventId, e) => {
    e.stopPropagation();
    try {
      await api.rsvpEvent(eventId, 'going').catch(() => {});
    } catch {}
    const updated = eventsStorage.setRsvp(eventId, 'Going');
    setRsvpStatus({ ...updated });
    toast.success('You are attending this event (RSVP: Going)!');
  };

  const handleRegisterClick = (event, e) => {
    e.stopPropagation();
    setRegisteringEvent(event);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registeringEvent) {
      const updated = eventsStorage.setRsvp(registeringEvent.id, 'Registered');
      setRsvpStatus({ ...updated });
    }
    setRegisteringEvent(null);
    toast.success('Registration confirmed! Pass generated.');
  };

  const handleShareEvent = (event, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join us at ${event.title} (${event.eventType}) on ${event.date} at ${event.location}!`,
        url: `${window.location.origin}/events/${event.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
      toast.info(`Event link copied to clipboard!`);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Registration Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div 
              className="px-5 py-4 text-white flex justify-between items-center"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
            >
              <div>
                <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{registeringEvent.eventType}</span>
                <h3 className="font-extrabold text-base mt-1">Get Entry Pass</h3>
              </div>
              <button onClick={() => setRegisteringEvent(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="p-5 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Citizen Name</label>
                <input required type="text" placeholder="Enter name" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1" style={{ outlineColor: primaryColor }} defaultValue="Rahul Sharma" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input required type="tel" placeholder="10-digit number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1" style={{ outlineColor: primaryColor }} defaultValue="9876543210" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">No. of Attendees</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none">
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="5">Group (5 Persons)</option>
                </select>
              </div>
              
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setRegisteringEvent(null)} className="flex-1 py-2.5 rounded-xl font-bold text-xs text-gray-600 bg-gray-100 hover:bg-gray-200">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Confirm Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">Events & Rallies</h1>
            <p className="text-[10px] font-semibold text-gray-500 truncate">Public meetings, chaupals & campaigns</p>
          </div>
        </div>
      </div>

      {/* Primary Timing Tabs */}
      <div className="flex bg-white px-4 border-b border-gray-100 shrink-0 shadow-sm z-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center justify-center gap-1.5 ${isActive ? '' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              style={{
                borderColor: isActive ? primaryColor : 'transparent',
                color: isActive ? primaryColor : undefined,
              }}
            >
              <span>{tab}</span>
              {tab === 'My Events' && Object.keys(rsvpStatus).length > 0 && (
                <span 
                  className="px-1.5 py-0.2 rounded-full text-[9px] font-black"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  {Object.keys(rsvpStatus).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary Type Filter Pills (Auto-Slide on selection) */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2.5 border-b border-gray-100 shrink-0 overflow-x-auto hide-scrollbar flex gap-2 scroll-smooth">
        {eventTypes.map(type => (
          <button 
            key={type}
            ref={(el) => (filterRefs.current[type] = el)}
            onClick={() => setActiveFilter(type)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${activeFilter === type ? 'text-white shadow-sm scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            style={{
              backgroundColor: activeFilter === type ? primaryColor : undefined
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Auto-Slide Carousel Content Container for Tabs */}
      <div className="flex-1 w-full overflow-hidden relative">
        <div 
          className="flex h-full w-[300%] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(activeTabIndex >= 0 ? activeTabIndex : 0) * (100 / 3)}%)` }}
        >
          {tabs.map((tab) => {
            const list = getFilteredListForTab(tab);
            return (
              <div key={tab} className="w-1/3 h-full overflow-y-auto p-4">
                <div className="flex flex-col gap-4 pb-6">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div 
                        className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
                      ></div>
                    </div>
                  ) : list.length > 0 ? (
                    list.map((event) => (
                      <div 
                        key={event.id} 
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md cursor-pointer active:scale-[0.99] transition-all"
                      >
                        {/* Banner */}
                        <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                          
                          {/* Top Tags */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span 
                              className="text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {event.eventType}
                            </span>
                          </div>

                          {rsvpStatus[event.id] && (
                            <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                              <HiCheck className="w-3 h-3" /> {rsvpStatus[event.id]}
                            </span>
                          )}

                          <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                            <h3 className="text-sm font-black leading-tight drop-shadow">{event.title}</h3>
                            <p className="text-[11px] font-medium text-white/90 mt-0.5 flex items-center gap-1">
                              <HiMapPin className="w-3.5 h-3.5" style={{ color: secondaryColor || '#fde047' }} />
                              <span>{event.location}</span>
                            </p>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-3.5 flex flex-col gap-2.5">
                          <p className="text-xs text-gray-600 font-semibold leading-relaxed line-clamp-2">{event.description}</p>

                          <div className="bg-[#f8fafc] border border-gray-100 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-gray-700">
                            <div className="flex items-center gap-1.5">
                              <HiCalendarDays className="w-4 h-4" style={{ color: primaryColor }} />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                              <HiClock className="w-3.5 h-3.5" />
                              <span>{event.time}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                            <HiBuildingLibrary className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                            <span className="font-bold text-gray-800 truncate">{event.location}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                            <button 
                              onClick={(e) => handleInterested(event.id, e)}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${rsvpStatus[event.id] === 'Interested' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                              <HiStar className="w-3.5 h-3.5 text-amber-500" />
                              <span>Interested</span>
                            </button>

                            <button 
                              onClick={(e) => handleGoing(event.id, e)}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${rsvpStatus[event.id] === 'Going' ? 'bg-green-50 border-green-400 text-green-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                              <HiHandThumbUp className="w-3.5 h-3.5 text-green-600" />
                              <span>Going</span>
                            </button>

                            <button 
                              onClick={(e) => handleRegisterClick(event, e)}
                              className="py-2 text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <HiTicket className="w-3.5 h-3.5" />
                              <span>Pass</span>
                            </button>
                          </div>

                          {/* Footer Nav Link */}
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="font-bold flex items-center gap-1" style={{ color: primaryColor }}>
                              View Full Event Details →
                            </span>
                            <button 
                              onClick={(e) => handleShareEvent(event, e)} 
                              className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1.5"
                            >
                              <HiShare className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                      <p className="text-gray-500 font-bold text-sm">No events found in this category.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}




