import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { useTenant } from '../context/TenantContext';
import { api } from '../services/api';
import { 
  HiArrowLeft, 
  HiBell, 
  HiInformationCircle, 
  HiExclamationTriangle, 
  HiCalendarDays, 
  HiSparkles
} from 'react-icons/hi2';
import { toast } from 'react-toastify';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const slug = api.getTenantSlug();
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.getMyNotifications().catch(() => []);
        const list = Array.isArray(res) ? res : (res?.data || []);
        
        if (list.length > 0) {
          const formatted = list.map(item => {
            const noteObj = item.notificationId || item;
            return {
              id: item._id || noteObj._id,
              rawId: item._id,
              notificationId: noteObj._id,
              title: noteObj.title || 'Official Update',
              message: noteObj.body || noteObj.message || '',
              time: noteObj.createdAt ? new Date(noteObj.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent',
              type: (noteObj.category || noteObj.type || 'announcement').toLowerCase(),
              read: item.isRead ?? false,
              link: noteObj.actionUrl || noteObj.link || (noteObj.category === 'complaint' ? '/my-complaints' : noteObj.category === 'event' ? '/events' : '/latest-updates')
            };
          });
          setNotifications(formatted);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.warn('Error fetching notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filterTabs = ['All', 'Complaints', 'Events', 'Announcements'];

  const getIconForType = (type) => {
    switch(type) {
      case 'complaint': return (
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
          <HiExclamationTriangle className="w-5 h-5" />
        </div>
      );
      case 'event': return (
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
          <HiCalendarDays className="w-5 h-5" />
        </div>
      );
      case 'announcement': return (
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
        >
          <HiBell className="w-5 h-5" />
        </div>
      );
      default: return (
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
          <HiInformationCircle className="w-5 h-5" />
        </div>
      );
    }
  };

  const handleNotificationClick = async (note) => {
    if (!note.read && note.rawId) {
      try {
        await api.markNotificationRead(note.rawId).catch(() => {});
        setNotifications(prev => prev.map(n => n.id === note.id ? { ...n, read: true } : n));
      } catch (err) {
        console.warn('Error marking notification read:', err);
      }
    }
    if (note.link) {
      navigate(note.link);
    }
  };

  const markAllRead = async () => {
    const unreadList = notifications.filter(n => !n.read && n.rawId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');

    for (const note of unreadList) {
      api.markNotificationRead(note.rawId).catch(() => {});
    }
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info('Notifications cleared');
  };

  const filtered = activeFilter === 'All' 
    ? notifications 
    : notifications.filter(n => {
        if (activeFilter === 'Complaints') return n.type === 'complaint';
        if (activeFilter === 'Events') return n.type === 'event';
        if (activeFilter === 'Announcements') return n.type === 'announcement';
        return true;
      });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Clean White Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-3.5 pb-3 shadow-xs shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-[#0f172a] leading-tight flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span 
                    className="text-[0.65rem] font-black text-white px-2 py-0.2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {unreadCount} New
                  </span>
                )}
              </h1>
              <p className="text-[0.7rem] font-semibold text-gray-400">Updates, alerts & events</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-bold border px-3 py-1 rounded-full active:scale-95 transition-all"
                style={{ color: primaryColor, backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
              >
                Mark Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-3.5 overflow-x-auto no-scrollbar scrollbar-hide">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                activeFilter === tab
                  ? 'text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200/80'
              }`}
              style={activeFilter === tab ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="flex flex-col gap-3 pb-6">
          {isLoading ? (
            <LoadingSpinner message="सूचनाएं लोड हो रही हैं..." />
          ) : filtered.length > 0 ? (
            filtered.map((note) => (
              <div
                key={note.id}
                onClick={() => handleNotificationClick(note)}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all cursor-pointer flex gap-3.5 items-start active:scale-[0.99] ${
                  note.read ? 'border-gray-100' : 'shadow-sm'
                }`}
                style={!note.read ? { borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}08` } : {}}
              >
                {getIconForType(note.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className={`text-sm font-extrabold truncate ${note.read ? 'text-gray-900' : 'text-[#0f172a]'}`}>
                      {note.title}
                    </h3>
                    {!note.read && (
                      <span 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      ></span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed mb-2">
                    {note.message}
                  </p>
                  <span className="text-[0.65rem] font-bold text-gray-400">
                    {note.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-white rounded-2xl border border-gray-100 my-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <HiBell className="w-7 h-7" />
              </div>
              <p className="text-gray-800 font-extrabold text-sm">No Notifications Found</p>
              <p className="text-gray-400 font-semibold text-xs mt-0.5">You're all caught up with latest updates!</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
