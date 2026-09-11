import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { api } from '../services/api';
import { getMediaUrl } from '../utils/mediaUrl';

export default function SplashPage() {
  const navigate = useNavigate();
  const { branding, primaryColor, secondaryColor, leaderName, tagline, logoUrl } = useTenant();
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // Check if tenant has custom splash media (video or image)
  // Branding can have splashMediaUrl, splashVideoUrl, splashImageUrl, or heroBannerUrl
  const splashMedia = branding?.splashMediaUrl || branding?.splashVideoUrl || branding?.splashImageUrl || branding?.splashUrl || null;
  const resolvedSplashMedia = splashMedia ? getMediaUrl(splashMedia) : null;

  // Determine if media is a video
  const isVideo = resolvedSplashMedia && (
    resolvedSplashMedia.endsWith('.mp4') ||
    resolvedSplashMedia.endsWith('.webm') ||
    resolvedSplashMedia.endsWith('.ogg') ||
    resolvedSplashMedia.includes('/video/') ||
    resolvedSplashMedia.includes('format=mp4') ||
    branding?.splashMediaType === 'video'
  );

  const handleOpenApp = () => {
    localStorage.setItem('pwa_has_seen_splash', 'true');
    navigate('/home', { replace: true });
  };

  useEffect(() => {
    // If it's a video, we let user interact or auto-forward when appropriate, or timeout after 5 seconds
    const timer = setTimeout(() => {
      handleOpenApp();
    }, isVideo ? 6000 : 3500);

    return () => clearTimeout(timer);
  }, [isVideo]);

  return (
    <div 
      className="relative w-full h-screen flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: (!resolvedSplashMedia)
          ? `linear-gradient(180deg, ${primaryColor || '#EA580C'} 0%, ${secondaryColor || '#111827'} 100%)`
          : '#000000',
      }}
    >
      {/* Top action bar: "Open App" button */}
      <div className="absolute top-6 right-6 z-30 flex items-center">
        <button
          onClick={handleOpenApp}
          className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md bg-black/40 border border-white/20 hover:bg-black/60 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <span>Open App</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Background Media (Video or Image if provided) */}
      {resolvedSplashMedia ? (
        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-black">
          {isVideo ? (
            <video
              src={resolvedSplashMedia}
              autoPlay
              muted
              playsInline
              loop
              onEnded={handleOpenApp}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={resolvedSplashMedia}
              alt="Splash"
              onLoad={() => setMediaLoaded(true)}
              className="w-full h-full object-cover"
            />
          )}
          {/* Subtle gradient overlay to make buttons/branding readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
        </div>
      ) : null}

      {/* Default Splash Layout when no full-bleed media is provided */}
      {!resolvedSplashMedia && (
        <>
          {/* Top Section: Logo & Slogan */}
          <div className="w-full flex flex-col items-center pt-14 px-6 z-10 flex-grow">
            <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md p-3 flex items-center justify-center shadow-xl border border-white/20 mb-6">
              <img
                src={logoUrl || '/image copy 3.png'}
                alt="App Logo"
                className="max-w-full max-h-full object-contain drop-shadow-md"
                onError={(e) => { e.target.src = '/image copy 3.png'; }}
              />
            </div>

            <h1 className="text-2xl font-black text-white text-center drop-shadow-md tracking-wide">
              {leaderName || 'जनप्रतिनिधि'}
            </h1>
            
            {tagline && (
              <p className="text-sm text-white/90 text-center font-medium mt-2 max-w-xs drop-shadow">
                {tagline}
              </p>
            )}

            {/* Hindi Slogans */}
            <div className="flex flex-col items-center space-y-1.5 text-white/95 font-bold text-lg tracking-wide drop-shadow-md mt-8" style={{ fontFamily: 'sans-serif' }}>
              <p>सबका साथ</p>
              <p>सबका विकास</p>
              <p>सबका विश्वास</p>
              <p>सबका प्रयास</p>
            </div>
          </div>

          {/* Bottom Section: Silhouette & Monuments */}
          <div className="w-full relative flex flex-col items-center justify-end z-10 mt-auto">
            <img
              src="/image copy.png"
              alt="Monuments"
              className="w-full h-auto object-cover object-bottom opacity-85"
            />
          </div>
        </>
      )}

      {/* Bottom Floating "Open App" Bar */}
      <div className="w-full p-6 z-20 relative">
        <button
          onClick={handleOpenApp}
          className="w-full py-3.5 rounded-xl font-bold text-base text-white shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{ backgroundColor: primaryColor || '#EA580C' }}
        >
          <span>Open App</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
