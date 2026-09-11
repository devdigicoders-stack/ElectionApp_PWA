import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { 
  HiMegaphone, 
  HiWrenchScrewdriver, 
  HiChartBar, 
  HiCalendarDays, 
  HiArrowLeft, 
  HiMapPin,
  HiUserGroup,
  HiPhone,
  HiCheckBadge
} from 'react-icons/hi2';

export default function MyAreaPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, leaderName } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  const [userArea, setUserArea] = useState({
    district: '',
    assembly: '',
    block: '',
    village: '',
    ward: '',
    booth: ''
  });
  const [areaTree, setAreaTree] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [polls, setPolls] = useState([]);
  const [areaWorks, setAreaWorks] = useState([]);
  const [areaNews, setAreaNews] = useState([]);
  const [areaEvents, setAreaEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const user = storage.getUser() || {};
      setUserArea({
        district: user.district || 'Varanasi',
        assembly: user.vidhanSabha || user.assembly || user.areaName || 'Constituency',
        block: user.block || 'Central Block',
        village: user.village || user.panchayat || '',
        ward: user.ward || 'Ward 12',
        booth: user.booth || 'Booth 104'
      });

      setComplaints(storage.getComplaints());

      const slug = api.getTenantSlug();
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 1. Fetch Area Tree
        const treeRes = await api.getAreaTree().catch(() => []);
        if (Array.isArray(treeRes)) setAreaTree(treeRes);

        // 2. Fetch Polls, Works, News, Events
        const [pollsRes, worksRes, newsRes, eventsRes] = await Promise.all([
          api.getActivePolls().catch(() => []),
          api.getWorks({ limit: 6 }).catch(() => []),
          api.getNews({ limit: 6 }).catch(() => []),
          api.getEvents({ limit: 6 }).catch(() => [])
        ]);

        const pollsList = Array.isArray(pollsRes)
          ? pollsRes
          : (Array.isArray(pollsRes?.items)
              ? pollsRes.items
              : (Array.isArray(pollsRes?.data?.items)
                  ? pollsRes.data.items
                  : (Array.isArray(pollsRes?.data) ? pollsRes.data : [])));

        if (Array.isArray(pollsList)) setPolls(pollsList);
        if (Array.isArray(worksRes?.data || worksRes)) setAreaWorks(worksRes?.data || worksRes);
        if (Array.isArray(newsRes?.data || newsRes)) setAreaNews(newsRes?.data || newsRes);
        if (Array.isArray(eventsRes?.data || eventsRes)) setAreaEvents(eventsRes?.data || eventsRes);
      } catch (err) {
        console.warn('Error fetching area data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'news', label: 'News' },
    { key: 'works', label: 'Works' },
    { key: 'events', label: 'Events' },
  ];

  const areaLevels = [
    { label: 'Assembly', value: userArea.assembly, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-blue-50 text-blue-600' },
    { label: 'Ward / Mandal', value: userArea.ward, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-orange-50 text-orange-600' },
    { label: 'Booth No', value: userArea.booth, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-teal-50 text-teal-600' },
  ];

  const localRepresentatives = [
    { name: 'Shri Rajesh Sharma', designation: 'Mandal Adhyaksh', phone: '+91 98765 43210', ward: userArea.ward || 'Ward 12' },
    { name: 'Smt. Sunita Verma', designation: 'Booth Prabhari', phone: '+91 98123 45678', ward: userArea.booth || 'Booth 104' },
    { name: 'Office of Leader', designation: 'Constituency Helpline', phone: '1800-123-456', ward: 'Headquarters' }
  ];

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      {/* Top Header */}
      <div 
        className="shrink-0 px-4 pt-4 pb-12 relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-16 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>

        <div className="flex items-center justify-between mb-3 relative z-10 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all shrink-0 text-white"
            >
              <HiArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-black text-white tracking-tight truncate">
              My Area
            </h1>
          </div>
          <button 
            onClick={() => navigate('/register')} 
            className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl backdrop-blur-xs active:scale-95 transition-all shrink-0"
          >
            Change Area
          </button>
        </div>

        <div className="flex items-center gap-1.5 relative z-10 text-white/95 text-xs font-semibold px-1">
          <HiMapPin className="w-4 h-4 text-white shrink-0" />
          <p className="truncate">{userArea.village || 'Local Area'}, {userArea.district || 'Constituency'}</p>
        </div>
      </div>

      {/* Tabs – 4 tabs */}
      <div className="shrink-0 -mt-6 px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-md p-1 grid grid-cols-4 gap-1 border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 text-[0.7rem] font-bold rounded-xl truncate text-center transition-all flex items-center justify-center ${
                activeTab === tab.key
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              style={activeTab === tab.key ? { backgroundColor: primaryColor } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {isLoading ? (
          <LoadingSpinner message="क्षेत्रीय डेटा लोड हो रहा है..." />
        ) : (
          <>
            {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Area Hierarchy Cards */}
            <div className="grid grid-cols-3 gap-2">
              {areaLevels.map((level, i) => (
                <div key={i} className={`${level.color} rounded-2xl p-3 flex flex-col items-center gap-1.5`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d={level.icon} />
                  </svg>
                  <span className="text-[0.55rem] font-bold uppercase tracking-wider opacity-70">{level.label}</span>
                  <span className="text-[0.7rem] font-extrabold text-center leading-tight">{level.value}</span>
                </div>
              ))}
            </div>

            {/* Announcements */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <HiMegaphone className="w-4 h-4" style={{ color: primaryColor }} />
                <h3 className="text-sm font-extrabold text-gray-900">Announcements</h3>
              </div>
              <div className="space-y-2">
                {(areaNews.length > 0 ? areaNews.slice(0, 2) : [
                  { id: 1, text: 'Cleanliness and sanitation drive begins this weekend across wards.', date: 'Today' }
                ]).map((ann, idx) => (
                  <div key={ann._id || ann.id || idx} className="rounded-xl p-3 border bg-blue-50 border-blue-100">
                    <p className="text-xs font-bold text-gray-800 leading-snug">{ann.title || ann.text}</p>
                    <span className="text-[0.6rem] font-semibold text-gray-400 mt-1 block">{ann.date || 'Constituency Update'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Works Summary */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <HiWrenchScrewdriver className="w-4 h-4" style={{ color: primaryColor }} />
                  <h3 className="text-sm font-extrabold text-gray-900">Development Works</h3>
                </div>
                <button onClick={() => setActiveTab('works')} className="text-[0.65rem] font-bold" style={{ color: primaryColor }}>View All →</button>
              </div>
              <div className="space-y-2">
                {areaWorks.slice(0, 3).map((work, i) => (
                  <div key={work._id || work.id || i} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-extrabold text-gray-900">{work.title}</p>
                      <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${
                        work.status === 'completed' || work.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        work.status === 'in_progress' || work.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>{work.status || 'Active'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ 
                          width: `${work.progress || 50}%`,
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor || primaryColor})` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Poll */}
            {polls.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <HiChartBar className="w-4 h-4" style={{ color: primaryColor }} />
                  <h3 className="text-sm font-extrabold text-gray-900">Active Poll</h3>
                </div>
                <div onClick={() => navigate('/polls')} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
                  <p className="text-xs font-extrabold text-gray-900 mb-1">{polls[0].question}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[0.6rem] font-semibold text-gray-400">{polls[0].totalVotes || 0} votes</span>
                    <span className="text-[0.6rem] font-bold" style={{ color: primaryColor }}>{polls[0].userVoted ? 'View Results →' : 'Vote Now →'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <HiCalendarDays className="w-4 h-4" style={{ color: primaryColor }} />
                <h3 className="text-sm font-extrabold text-gray-900">Upcoming Events</h3>
              </div>
              <div className="space-y-2">
                {areaEvents.map((event, idx) => (
                  <div key={event._id || event.id || idx} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <span className="text-[0.6rem] font-bold uppercase" style={{ color: primaryColor }}>
                        {new Date(event.startDate || event.date || Date.now()).toLocaleString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-base font-extrabold leading-none" style={{ color: primaryColor }}>
                        {new Date(event.startDate || event.date || Date.now()).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-extrabold text-gray-900">{event.title}</p>
                      <p className="text-[0.65rem] font-semibold text-gray-400 mt-0.5">{event.time || event.location || 'Event'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-3">
            {areaNews.map((item, idx) => (
              <div key={item._id || item.id || idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <span className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                  {item.category || 'News'}
                </span>
                <p className="text-sm font-extrabold text-gray-900 mt-1 leading-snug">{item.title}</p>
                <span className="text-[0.6rem] font-semibold text-gray-400 mt-1.5 block">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : (item.date || '')}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'works' && (
          <div className="space-y-3">
            {areaWorks.map((work, idx) => (
              <div key={work._id || work.id || idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-extrabold text-gray-900">{work.title}</p>
                  <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${
                    work.status === 'completed' || work.status === 'Completed' ? 'bg-green-50 text-green-600' :
                    work.status === 'in_progress' || work.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{work.status || 'Active'}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{ 
                        width: `${work.progress || 50}%`,
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor || primaryColor})` 
                      }}
                    ></div>
                  </div>
                  <span className="text-[0.65rem] font-bold text-gray-500">{work.progress || 50}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {areaEvents.map(event => (
              <div key={event.id || event._id} onClick={() => navigate('/events')} className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm flex items-start gap-3 cursor-pointer hover:border-gray-300 transition-colors">
                <div 
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border"
                  style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                >
                  <span className="text-[0.6rem] font-bold uppercase" style={{ color: primaryColor }}>
                    {event.date ? (typeof event.date === 'string' && event.date.includes(' ') ? event.date.split(' ')[1]?.slice(0,3) : new Date(event.date).toLocaleString('en-US', { month: 'short' })) : 'Upcoming'}
                  </span>
                  <span className="text-base font-extrabold leading-none" style={{ color: primaryColor }}>
                    {event.date ? (typeof event.date === 'string' && event.date.includes(' ') ? event.date.split(' ')[0] : new Date(event.date).getDate()) : '•'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-gray-900">{event.title}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{event.time || ''} {event.location ? `• ${event.location}` : ''}</p>
                  <span className="text-[0.7rem] font-bold mt-1 inline-block" style={{ color: primaryColor }}>View Details & RSVP →</span>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

      </div>
    </div>
  );
}
