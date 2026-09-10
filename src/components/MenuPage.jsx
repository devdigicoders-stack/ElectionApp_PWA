import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { 
  HiUser, 
  HiBell, 
  HiChartBar, 
  HiFolderOpen, 
  HiNewspaper, 
  HiPhoto, 
  HiVideoCamera, 
  HiShieldCheck, 
  HiDocumentText, 
  HiIdentification, 
  HiHandRaised, 
  HiDocumentDuplicate, 
  HiPaintBrush, 
  HiMapPin, 
  HiLanguage,
  HiChevronRight
} from 'react-icons/hi2';
import { toast } from 'react-toastify';

export default function MenuPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('hi'); // 'hi' | 'en'

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
    toast.success(`Language set to ${nextLang === 'hi' ? 'हिंदी (Hindi)' : 'English'}`);
  };

  const menuSections = [
    {
      title: 'Profile & Identity',
      items: [
        {
          id: 'profile',
          title: 'My Profile',
          subtitle: 'View member ID & details',
          path: '/my-profile',
          bgColor: 'bg-orange-50',
          icon: <HiUser className="w-5 h-5 text-[#f37920]" />
        },
        {
          id: 'membership',
          title: 'Party Membership',
          subtitle: 'Digital card & verification QR',
          path: '/membership',
          bgColor: 'bg-blue-50',
          icon: <HiIdentification className="w-5 h-5 text-blue-600" />
        },
        {
          id: 'volunteer',
          title: 'Volunteer / Karyakarta',
          subtitle: 'Tasks, leaderboard & drives',
          path: '/volunteer',
          bgColor: 'bg-indigo-50',
          icon: <HiHandRaised className="w-5 h-5 text-indigo-600" />
        }
      ]
    },
    {
      title: 'Citizen Services',
      items: [
        {
          id: 'area',
          title: 'My Area & Development',
          subtitle: 'Track local constituency works',
          path: '/my-area',
          bgColor: 'bg-emerald-50',
          icon: <HiMapPin className="w-5 h-5 text-emerald-600" />
        },
        {
          id: 'my-complaints',
          title: 'Jan Samasya (Complaints)',
          subtitle: 'Track status & file grievances',
          path: '/my-complaints',
          bgColor: 'bg-amber-50',
          icon: <HiFolderOpen className="w-5 h-5 text-amber-600" />
        },
        {
          id: 'polls',
          title: 'Public Polls',
          subtitle: 'Vote on public policies',
          path: '/polls',
          bgColor: 'bg-purple-50',
          icon: <HiChartBar className="w-5 h-5 text-purple-600" />
        },
        {
          id: 'manifesto',
          title: 'Sankalp Patra (Manifesto)',
          subtitle: 'Vision & delivery tracker',
          path: '/manifesto',
          bgColor: 'bg-rose-50',
          icon: <HiDocumentDuplicate className="w-5 h-5 text-rose-600" />
        }
      ]
    },
    {
      title: 'Media & Updates',
      items: [
        {
          id: 'latest',
          title: 'Latest Updates',
          subtitle: 'News, press & announcements',
          path: '/latest-updates',
          bgColor: 'bg-teal-50',
          icon: <HiNewspaper className="w-5 h-5 text-teal-600" />
        },
        {
          id: 'photo',
          title: 'Photo Gallery',
          subtitle: 'High definition rally albums',
          path: '/photo-gallery',
          bgColor: 'bg-pink-50',
          icon: <HiPhoto className="w-5 h-5 text-pink-600" />
        },
        {
          id: 'poster',
          title: 'Festival Poster Studio',
          subtitle: 'Generate photo greeting cards',
          path: '/poster-generator',
          bgColor: 'bg-amber-50',
          icon: <HiPaintBrush className="w-5 h-5 text-amber-600" />
        },
        {
          id: 'video',
          title: 'Video Gallery',
          subtitle: 'Speeches, clips & interviews',
          path: '/video-gallery',
          bgColor: 'bg-violet-50',
          icon: <HiVideoCamera className="w-5 h-5 text-violet-600" />
        }
      ]
    },
    {
      title: 'Preferences & Legal',
      items: [
        {
          id: 'notifications',
          title: 'Notifications & Alerts',
          subtitle: 'Manage announcement alerts',
          path: '/notifications',
          bgColor: 'bg-slate-100',
          icon: <HiBell className="w-5 h-5 text-slate-700" />
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Data protection standards',
          path: '/privacy-policy',
          bgColor: 'bg-slate-100',
          icon: <HiShieldCheck className="w-5 h-5 text-slate-700" />
        },
        {
          id: 'terms',
          title: 'Terms & Conditions',
          subtitle: 'Usage guidelines & terms',
          path: '/terms-conditions',
          bgColor: 'bg-slate-100',
          icon: <HiDocumentText className="w-5 h-5 text-slate-700" />
        }
      ]
    }
  ];

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Crisp White Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-3.5 pb-3 shadow-xs shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-[#0f172a] leading-tight">All Features & Menu</h1>
            <p className="text-[0.7rem] font-semibold text-gray-400">BJP Jansampark Portal</p>
          </div>
          
          {/* Language Toggle Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#f37920] text-xs font-black active:scale-95 transition-all"
          >
            <HiLanguage className="w-4 h-4" />
            <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="flex flex-col gap-5 pb-6">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                {section.title}
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer active:bg-gray-50 transition-colors ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900">{item.title}</h4>
                        {item.subtitle && (
                          <p className="text-[0.65rem] font-semibold text-gray-400 mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <HiChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* App Version Info */}
          <div className="text-center pt-2">
            <p className="text-xs font-extrabold text-gray-400">BJP Jansampark PWA</p>
            <p className="text-[0.65rem] font-semibold text-gray-400 mt-0.5">Version 2.4.0 • Viksit Bharat Initiative</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
