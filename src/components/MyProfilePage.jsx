import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import UserAvatar from './UserAvatar';
import { 
  HiArrowLeft, 
  HiUser, 
  HiMapPin, 
  HiPencilSquare, 
  HiIdentification, 
  HiHandRaised, 
  HiBell, 
  HiShieldCheck, 
  HiDocumentText, 
  HiArrowRightOnRectangle,
  HiChevronRight,
  HiCheckBadge,
  HiSparkles,
  HiFolderOpen,
  HiCalendarDays,
  HiChartBar
} from 'react-icons/hi2';
import { toast } from 'react-toastify';

export default function MyProfilePage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [profileData, setProfileData] = useState(null);
  const [user, setUser] = useState({
    name: 'Citizen',
    mobile: '',
    district: '',
    assembly: '',
  });

  const [stats, setStats] = useState({
    complaints: 0,
    events: 0,
    polls: 0
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Initial load from local storage
    const token = storage.getToken();
    const localUser = storage.getUser();
    if (token && localUser) {
      setIsLoggedIn(true);
      setUser(localUser);
    } else {
      setIsLoggedIn(false);
      setUser({ name: 'Guest User', mobile: '', district: '', assembly: '' });
    }

    // Fetch live citizen profile from backend
    const loadCitizenProfile = async () => {
      try {
        if (localUser?._id) {
          const u = await api.getUserById(localUser._id).catch(() => null);
          if (u) {
            const updated = {
              ...localUser,
              ...u,
              assembly: u.areaId?.name || localUser.assembly || ''
            };
            setUser(updated);
            storage.setUser(updated);
          }
        }
      } catch (err) {
        console.warn('Profile load info:', err);
      }
    };

    loadCitizenProfile();
  }, []);

  const menuSections = [
    {
      title: 'Engagement & Membership',
      items: [
        {
          id: 'membership',
          path: '/membership',
          icon: <HiIdentification className="w-5 h-5" style={{ color: primaryColor }} />,
          bg: 'bg-orange-50',
          title: 'Party Membership Card',
          subtitle: user?.membership?.membershipNumber 
            ? `ID: ${user.membership.membershipNumber} (${user.membership.status || 'Active'})`
            : 'Digital ID & Verification QR'
        },
        {
          id: 'area',
          path: '/my-area',
          icon: <HiMapPin className="w-5 h-5 text-emerald-600" />,
          bg: 'bg-emerald-50',
          title: 'My Area & Development',
          subtitle: user.assembly || user.district || 'View Area Information'
        }
      ]
    },
    {
      title: 'Activity & Services',
      items: [
        {
          id: 'complaints',
          path: '/my-complaints',
          icon: <HiFolderOpen className="w-5 h-5 text-amber-600" />,
          bg: 'bg-amber-50',
          title: 'My Complaints (Jan Samasya)',
          subtitle: `${stats.complaints} Tickets Raised`
        },
        {
          id: 'events',
          path: '/events',
          icon: <HiCalendarDays className="w-5 h-5 text-blue-600" />,
          bg: 'bg-blue-50',
          title: 'Events & Programs',
          subtitle: `${stats.events} Events Registered`
        },
        {
          id: 'polls',
          path: '/polls',
          icon: <HiChartBar className="w-5 h-5 text-purple-600" />,
          bg: 'bg-purple-50',
          title: 'Public Polls Participation',
          subtitle: `${stats.polls} Polls Participated`
        }
      ]
    },
    {
      title: 'Account Settings',
      items: [
        {
          id: 'edit',
          path: '/register',
          icon: <HiPencilSquare className="w-5 h-5 text-slate-700" />,
          bg: 'bg-slate-100',
          title: 'Edit Area & Profile Details',
          subtitle: 'Update personal or area information'
        },
        {
          id: 'notifications',
          path: '/notifications',
          icon: <HiBell className="w-5 h-5 text-slate-700" />,
          bg: 'bg-slate-100',
          title: 'Notifications & Alerts',
          subtitle: 'Manage announcement preferences'
        },
        {
          id: 'privacy',
          path: '/privacy-policy',
          icon: <HiShieldCheck className="w-5 h-5 text-slate-700" />,
          bg: 'bg-slate-100',
          title: 'Privacy Policy',
          subtitle: 'Data security & privacy guidelines'
        },
        {
          id: 'terms',
          path: '/terms-conditions',
          icon: <HiDocumentText className="w-5 h-5 text-slate-700" />,
          bg: 'bg-slate-100',
          title: 'Terms & Conditions',
          subtitle: 'Platform terms & guidelines'
        }
      ]
    }
  ];

  const handleLogout = () => {
    storage.clear();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Top Header - Tenant Themed Sticky */}
      <div 
        className="shrink-0 px-4 py-3 relative overflow-hidden z-30 shadow-xs"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
      >
        <div className="flex items-center justify-between relative z-10 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white shrink-0"
            >
              <HiArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-base font-black text-white tracking-tight truncate">
              My Profile
            </h1>
          </div>
          <button 
            onClick={() => navigate('/register')} 
            className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl backdrop-blur-xs active:scale-95 transition-all shrink-0"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-16 h-16 rounded-2xl border-2 p-0.5 shrink-0 overflow-hidden bg-white shadow-xs"
              style={{ borderColor: primaryColor }}
            >
              <UserAvatar 
                src={user?.photo} 
                name={user?.name} 
                className="w-full h-full" 
                iconClassName="w-8 h-8"
                roundedClassName="rounded-xl" 
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h2 className="text-base font-black text-gray-900 truncate">
                  {isLoggedIn ? (user.name || 'Citizen User') : 'Guest User'}
                </h2>
                {isLoggedIn && user.isProfileComplete && <HiCheckBadge className="w-5 h-5 shrink-0" style={{ color: primaryColor }} />}
              </div>
              {isLoggedIn && user.mobile ? (
                <p className="text-xs text-gray-500 font-semibold mb-1.5">+91 {user.mobile}</p>
              ) : (
                <p className="text-xs text-gray-400 font-medium mb-1.5">Login to access profile services</p>
              )}
              
              <div className="flex items-center gap-1.5 flex-wrap">
                {isLoggedIn ? (
                  <span 
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-extrabold border"
                    style={{ 
                      backgroundColor: `${primaryColor}15`, 
                      color: primaryColor,
                      borderColor: `${primaryColor}30`
                    }}
                  >
                    <HiSparkles className="w-3 h-3" />
                    <span>Verified Citizen</span>
                  </span>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.7rem] font-black text-white shadow-xs active:scale-95 transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Login / Register</span>
                  </button>
                )}
                {user.assembly && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-gray-100 text-gray-600 truncate max-w-[180px]">
                    {user.assembly}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Activity Counters Row */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
            <div 
              onClick={() => navigate('/my-complaints')}
              className="rounded-2xl p-2 cursor-pointer active:scale-95 transition-all border"
              style={{ backgroundColor: `${primaryColor}0D`, borderColor: `${primaryColor}20` }}
            >
              <p className="text-base font-black" style={{ color: primaryColor }}>{stats.complaints}</p>
              <p className="text-[0.65rem] text-gray-600 font-bold">Complaints</p>
            </div>
            <div 
              onClick={() => navigate('/events')}
              className="bg-blue-50/50 border border-blue-100 rounded-2xl p-2 cursor-pointer hover:bg-blue-50 active:scale-95 transition-all"
            >
              <p className="text-base font-black text-blue-600">{stats.events}</p>
              <p className="text-[0.65rem] text-gray-600 font-bold">Events RSVP</p>
            </div>
            <div 
              onClick={() => navigate('/polls')}
              className="bg-purple-50/50 border border-purple-100 rounded-2xl p-2 cursor-pointer hover:bg-purple-50 active:scale-95 transition-all"
            >
              <p className="text-base font-black text-purple-600">{stats.polls}</p>
              <p className="text-[0.65rem] text-gray-600 font-bold">Polls Voted</p>
            </div>
          </div>
        </div>


        {/* Menu Sections List */}
        <div className="flex flex-col gap-4 pb-4">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">{section.title}</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer active:bg-gray-50 transition-colors ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900">{item.title}</h4>
                        <p className="text-[0.65rem] font-semibold text-gray-400 mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    <HiChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Action */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-black shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 mb-6"
            >
              <HiArrowRightOnRectangle className="w-4 h-4 stroke-[2.5]" />
              <span>Sign Out / Log Out</span>
            </button>
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
