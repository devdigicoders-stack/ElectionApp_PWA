import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import { eventsStorage } from '../services/eventsData';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { getMediaUrl } from '../utils/mediaUrl';
import { 
  HiCalendarDays, 
  HiMapPin, 
  HiStar, 
  HiHandThumbUp, 
  HiTicket, 
  HiShare, 
  HiArrowLeft, 
  HiXMark, 
  HiCheck, 
  HiArrowTopRightOnSquare 
} from 'react-icons/hi2';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const liveEvent = await api.getEventById(id).catch(() => null);
        if (liveEvent) {
          const firstImg = (Array.isArray(liveEvent.images) && liveEvent.images.length > 0 ? liveEvent.images[0] : null) || liveEvent.bannerUrl || liveEvent.img;
          const hasPassed = liveEvent.status === 'past' || (liveEvent.endDate ? new Date(liveEvent.endDate) < new Date() : (liveEvent.startDate ? new Date(liveEvent.startDate) < new Date() : false));

          setEvent({
            id: liveEvent._id || liveEvent.id,
            title: liveEvent.title,
            eventType: liveEvent.eventType || liveEvent.category || 'Jan Sabha',
            category: hasPassed ? 'Past' : 'Upcoming',
            date: liveEvent.startDate ? new Date(liveEvent.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Upcoming',
            time: liveEvent.startTime || (liveEvent.startDate ? new Date(liveEvent.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'),
            endTime: liveEvent.endTime || '',
            location: liveEvent.location || 'Local Constituency',
            mapLink: liveEvent.mapLink || null,
            organizerName: liveEvent.organizerName || '',
            organizerPhone: liveEvent.organizerPhone || '',
            image: getMediaUrl(firstImg, 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200'),
            description: liveEvent.description || '',
            requiresRegistration: liveEvent.registrationRequired === true || liveEvent.isRegistrationRequired === true,
            interestedCount: liveEvent.interestedCount || 0,
            goingCount: liveEvent.goingCount || 0,
            registeredCount: liveEvent.registeredCount || 0,
            photos: (liveEvent.images || []).map(img => getMediaUrl(img)),
            tags: liveEvent.tags || []
          });
        } else {
          setEvent(null);
        }
      } catch {
        setEvent(null);
      }
    };

    fetchEvent();

    const rsvpMap = eventsStorage.getRsvp();
    if (rsvpMap && rsvpMap[id]) {
      setRsvpStatus(rsvpMap[id]);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <LoadingSpinner message="कार्यक्रम का विवरण लोड हो रहा है..." />
      </div>
    );
  }

  const handleInterested = () => {
    eventsStorage.setRsvp(event.id, 'Interested');
    setRsvpStatus('Interested');
    toast.success('Marked as Interested! Reminder will be sent.');
  };

  const handleGoing = () => {
    eventsStorage.setRsvp(event.id, 'Going');
    setRsvpStatus('Going');
    toast.success('You are attending this event (RSVP: Going)!');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    eventsStorage.setRsvp(event.id, 'Registered');
    setRsvpStatus('Registered');
    setIsRegisterModalOpen(false);
    toast.success('Entry Pass confirmed! Pass generated successfully.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join us at ${event.title} (${event.eventType}) on ${event.date} at ${event.location}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[80px]">
      
      {/* Registration Pass Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div 
              className="p-4 text-white flex justify-between items-center"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
            >
              <div>
                <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{event.eventType}</span>
                <h3 className="font-extrabold text-base mt-1">Get Entry Pass</h3>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-5 flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" defaultValue="Rahul Sharma" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                <input required type="tel" defaultValue="9876543210" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">No. of Attendees / Guest Pass</label>
                <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none bg-gray-50">
                  <option value="1">1 Person (Self)</option>
                  <option value="2">2 Persons</option>
                  <option value="5">Group / Family (5 Persons)</option>
                </select>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-xs text-gray-600 bg-gray-100 hover:bg-gray-200">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white shadow-lg active:scale-95 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Confirm Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Event Photos */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md animate-fade-in">
          <div className="flex justify-end pt-2">
            <button onClick={() => setSelectedPhoto(null)} className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center">
              <HiXMark className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={selectedPhoto} alt="Event" className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          </div>
          <div className="text-center text-white text-xs font-semibold pb-4">
            {event.title}
          </div>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="relative w-full aspect-[16/10] bg-gray-900 shrink-0 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60"></div>

        {/* Top Floating Buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all backdrop-blur-md"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare} 
              className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all backdrop-blur-md"
            >
              <HiShare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overlay Badges & Title */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span 
              className="text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow"
              style={{ backgroundColor: primaryColor }}
            >
              {event.eventType}
            </span>
            {event.isLiveSoon && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> LIVE WEBCAST
              </span>
            )}
            {rsvpStatus && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                <HiCheck className="w-3 h-3" /> {rsvpStatus}
              </span>
            )}
          </div>
          <h1 className="text-lg font-black leading-tight text-white drop-shadow-md">{event.title}</h1>
        </div>
      </div>

      {/* Scrollable Event Content */}
      <div className="flex-1 overflow-y-auto w-full p-4 flex flex-col gap-4">

        {/* Date, Time & Venue Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              <HiCalendarDays className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date & Timing</span>
              <p className="text-sm font-extrabold text-gray-900">{event.date}</p>
              <p className="text-xs font-semibold text-gray-500">{event.time}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}
            >
              <HiMapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Venue Location</span>
              <p className="text-xs font-extrabold text-gray-900 leading-snug">{event.location}</p>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold hover:underline inline-flex items-center gap-1 mt-1"
                style={{ color: secondaryColor }}
              >
                <span>Open in Google Maps</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* RSVP Fast Action Bar */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
          <span className="text-[11px] font-bold text-gray-500 block mb-2 text-center">Will you participate in this event?</span>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={handleInterested}
              className={`py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${rsvpStatus === 'Interested' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <HiStar className="w-4 h-4 text-amber-500" />
              <span>Interested</span>
            </button>

            <button 
              onClick={handleGoing}
              className={`py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${rsvpStatus === 'Going' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <HiHandThumbUp className="w-4 h-4 text-green-600" />
              <span>Going</span>
            </button>

            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="py-2.5 text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              style={{ backgroundColor: primaryColor }}
            >
              <HiTicket className="w-4 h-4" />
              <span>Get Pass</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
          {['Overview', 'Agenda / Timeline', 'Photos', 'Map / Venue'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              style={{
                color: activeTab === tab ? primaryColor : undefined
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 animate-fade-in">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 mb-2">About this {event.eventType}</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">{event.description || event.desc || 'Join us for this important community event.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Organized By</span>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{event.organizer || 'Representative Office'}</p>
              </div>
              <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Chief Dignitaries</span>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{event.chiefGuest || 'Leadership & Citizens'}</p>
              </div>
            </div>

            <div 
              className="p-3 rounded-xl flex items-center justify-between border"
              style={{ backgroundColor: `${primaryColor}0D`, borderColor: `${primaryColor}25` }}
            >
              <span className="text-xs font-bold text-gray-700">Expected Gathering:</span>
              <span className="text-xs font-extrabold" style={{ color: primaryColor }}>{event.expectedAttendees || `${event.interestedCount || 500}+ Citizens`}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Agenda */}
        {activeTab === 'Agenda / Timeline' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-900 mb-1">Event Schedule & Order</h3>
            <div className="flex flex-col gap-3 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-0.5 before:bg-gray-200">
              {(event.agenda || []).map((ag, i) => (
                <div key={i} className="flex items-start gap-3 relative z-10">
                  <div 
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: primaryColor }}>{ag.time}</span>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{ag.item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Photos */}
        {activeTab === 'Photos' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-900">Event Photos & Highlights</h3>
            {event.photos && event.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {event.photos.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedPhoto(p)}
                    className="h-32 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform relative group"
                  >
                    <img src={p} alt="Event photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-semibold py-4 text-center">Photos will be uploaded after the event.</p>
            )}
          </div>
        )}

        {/* Tab 4: Map / Venue */}
        {activeTab === 'Map / Venue' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-900">Venue & Navigation</h3>
            <p className="text-xs text-gray-600 font-medium">{event.location}</p>
            
            {/* Map Placeholder Graphic */}
            <div className="w-full h-44 rounded-2xl bg-blue-50 border border-blue-200 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-xl shadow-lg mb-2">
                <HiMapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-extrabold text-gray-900">{event.shortLocation || event.location}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Live GPS direction available</p>
            </div>

            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-3 text-white font-bold text-xs rounded-xl text-center shadow-md transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: secondaryColor || '#1565c0' }}
            >
              <span>Open Live Direction on Google Maps</span>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          </div>
        )}

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] flex items-center gap-3">
        <button 
          onClick={handleShare}
          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center shrink-0 transition-colors"
        >
          <HiShare className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex-1 h-12 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <HiTicket className="w-5 h-5" />
          <span>Register for Event Pass</span>
        </button>
      </div>

    </div>
  );
}


