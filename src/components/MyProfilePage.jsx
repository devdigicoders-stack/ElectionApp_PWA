import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MyProfilePage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'area',
      icon: (
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[#f37920]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      ),
      title: 'My Area',
      subtitle: 'Lucknow, UP'
    },
    {
      id: 'edit',
      icon: (
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      ),
      title: 'Edit Profile'
    },
    {
      id: 'notifications',
      icon: (
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      ),
      title: 'Notifications'
    },
    {
      id: 'language',
      icon: (
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      ),
      title: 'Language',
      subtitle: 'English'
    },
    {
      id: 'privacy',
      icon: (
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      ),
      title: 'Privacy Policy'
    },
    {
      id: 'terms',
      icon: (
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      ),
      title: 'Terms & Conditions'
    },
    {
      id: 'about',
      icon: (
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      title: 'About App',
      subtitle: 'v1.0.0'
    }
  ];

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden pb-[72px]">
      
      {/* App Bar */}
      <div className="flex justify-between items-center px-4 py-4 shrink-0 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-20">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">My Profile</h1>
        </div>
        <button className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="p-5 flex flex-col gap-4">
          
          {/* User Info Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full border-2 border-green-500 p-0.5 shrink-0 overflow-hidden">
              <img src="/profile_avatar.jpg" alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold text-[#1e293b] leading-tight mb-1">Gaurav Kumar</h2>
              <p className="text-gray-500 font-semibold text-sm mb-2">+91 98765 43210</p>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-wide bg-green-100 text-green-700">
                  Active Member
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="flex flex-col">
            {menuItems.map((item, idx) => {
              const handleMenuClick = () => {
                if (item.id === 'edit') navigate('/profile');
                if (item.id === 'notifications') navigate('/notifications');
                if (item.id === 'privacy') navigate('/privacy-policy');
                if (item.id === 'terms') navigate('/terms-conditions');
                if (item.id === 'complaints') navigate('/my-complaints');
                if (item.id === 'photo') navigate('/photo-gallery');
                if (item.id === 'video') navigate('/video-gallery');
              };

              return (
              <div 
                key={item.id} 
                onClick={handleMenuClick}
                className={`flex items-center justify-between py-3 cursor-pointer active:bg-gray-50 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[#1e293b] text-[0.95rem]">{item.title}</span>
                    {item.id === 'area' && item.subtitle && (
                      <span className="text-xs font-semibold text-gray-500 mt-0.5">{item.subtitle}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.id !== 'area' && item.subtitle && (
                    <span className="text-xs font-semibold text-gray-500">{item.subtitle}</span>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="pt-4 pb-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 text-red-600 font-bold text-[1.05rem] hover:bg-red-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
