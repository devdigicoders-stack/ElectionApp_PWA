import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MenuPage() {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'My Account',
      items: [
        {
          id: 'profile',
          title: 'My Profile',
          subtitle: 'View & edit your profile',
          path: '/my-profile',
          bgColor: 'bg-orange-50',
          iconColor: 'text-[#f37920]',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage your alerts',
          path: '/notifications',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Services',
      items: [
        {
          id: 'polls',
          title: 'Public Polls',
          subtitle: 'Vote on public matters',
          path: '/polls',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          id: 'complaint',
          title: 'Jan Samasya',
          subtitle: 'Submit a complaint',
          path: '/complaint',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        },
        {
          id: 'my-complaints',
          title: 'My Complaints',
          subtitle: 'Track your complaints',
          path: '/my-complaints',
          bgColor: 'bg-amber-50',
          iconColor: 'text-amber-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Media',
      items: [
        {
          id: 'latest',
          title: 'Latest Updates',
          subtitle: 'News & announcements',
          path: '/latest-updates',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          )
        },
        {
          id: 'photo',
          title: 'Photo Gallery',
          subtitle: 'Browse all photos',
          path: '/photo-gallery',
          bgColor: 'bg-pink-50',
          iconColor: 'text-pink-500',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          id: 'video',
          title: 'Video Gallery',
          subtitle: 'Watch speeches & events',
          path: '/video-gallery',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.871v6.258a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: '',
          path: '/privacy-policy',
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )
        },
        {
          id: 'terms',
          title: 'Terms & Conditions',
          subtitle: '',
          path: '/terms-conditions',
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-white shadow-sm z-20">
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-[#1e293b] leading-tight">Menu</h1>
          <p className="text-xs font-semibold text-gray-400">All features & settings</p>
        </div>
        {/* Profile Avatar - tap to go to profile */}
        <div
          onClick={() => navigate('/my-profile')}
          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#f37920] transition-all"
        >
          <svg className="w-6 h-6 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full px-4 py-5">
        <div className="flex flex-col gap-6 pb-4">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3 px-1">{section.title}</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {section.items.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer active:bg-gray-50 transition-colors ${idx !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-extrabold text-[#1e293b] text-sm">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs font-semibold text-gray-400 mt-0.5">{item.subtitle}</span>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* App Version */}
          <p className="text-center text-xs font-semibold text-gray-400 pb-2">BJP Jansampark v1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
