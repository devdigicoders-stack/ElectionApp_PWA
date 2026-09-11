import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { api } from '../services/api';
import { getMediaUrl } from '../utils/mediaUrl';

export default function SplashPage() {
  const navigate = useNavigate();
  const { branding, primaryColor, secondaryColor, leaderName, tagline, logoUrl } = useTenant();
  const [dynamicConfig, setDynamicConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const loadSplashConfig = async () => {
      try {
        const res = await api.getConfig().catch(() => null);
        if (res) {
          const cfgData = res?.branding ? res : (res?.data || res);
          setDynamicConfig(cfgData);
        }
      } catch (e) {
        console.warn('Error fetching splash config:', e);
      }
    };
    loadSplashConfig();
  }, []);

  const activeBranding = dynamicConfig?.branding || dynamicConfig?.data?.branding || branding;
  const activePrimary = activeBranding?.primaryColor || primaryColor || '#FF7802';
  const activeSecondary = activeBranding?.secondaryColor || secondaryColor || '#190F4B';
  const activeLeader = activeBranding?.leaderName || leaderName || '';
  const activeTagline = activeBranding?.tagline || tagline || '';
  const activeLogo = activeBranding?.logoUrl || activeBranding?.logo || logoUrl || '';

  // Multi-step splashScreens array support from API
  const splashScreens = Array.isArray(activeBranding?.splashScreens) && activeBranding.splashScreens.length > 0
    ? activeBranding.splashScreens
    : null;

  const totalSteps = splashScreens ? splashScreens.length : 1;
  const activeScreen = splashScreens ? splashScreens[currentStep] : null;

  // Single media fallback if splashScreens array is not present
  const singleSplashMedia = activeBranding?.splashMediaUrl || activeBranding?.splashScreenUrl || activeBranding?.splashVideoUrl || activeBranding?.splashImageUrl || activeBranding?.splashUrl || null;
  
  const currentMediaUrl = activeScreen?.mediaUrl 
    ? getMediaUrl(activeScreen.mediaUrl) 
    : (singleSplashMedia ? getMediaUrl(singleSplashMedia) : null);

  const isVideo = currentMediaUrl && (
    currentMediaUrl.endsWith('.mp4') ||
    currentMediaUrl.endsWith('.webm') ||
    currentMediaUrl.endsWith('.ogg') ||
    currentMediaUrl.includes('/video/') ||
    currentMediaUrl.includes('format=mp4') ||
    activeScreen?.mediaType === 'video'
  );

  const handleSkipToLogin = () => {
    localStorage.setItem('pwa_has_seen_splash', 'true');
    navigate('/login', { replace: true });
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('pwa_has_seen_splash', 'true');
      navigate('/login', { replace: true });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: (!currentMediaUrl)
          ? `linear-gradient(180deg, ${activePrimary} 0%, ${activeSecondary} 100%)`
          : '#000000',
      }}
    >
      {/* Top action bar: "Open App" button */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={handleSkipToLogin}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md bg-black/50 border border-white/20 hover:bg-black/70 active:scale-95 transition-all flex items-center gap-1"
        >
          <span>Open App</span>
          <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Media / Splash Screen from Backend API */}
      {currentMediaUrl ? (
        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-black">
          {isVideo ? (
            <video
              key={currentMediaUrl}
              src={currentMediaUrl}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              key={currentMediaUrl}
              src={currentMediaUrl}
              alt="Splash Screen"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      ) : (
        /* Dynamic Theme Background when no media uploaded yet */
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{
            background: `linear-gradient(180deg, ${activePrimary} 0%, ${activeSecondary} 100%)`
          }}
        />
      )}

      {/* Spacer / Container for Dots */}
      <div className="w-full flex flex-col items-center justify-end z-10 flex-grow pb-4 pointer-events-none">
        {/* Dots Pagination Indicator for Multi-step Splash */}
        {totalSteps > 1 && (
          <div className="flex items-center gap-2 mb-2 z-20 pointer-events-auto">
            {splashScreens.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-white shadow-lg' : 'w-2 bg-white/50'
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar with Prev & Next (both compact) */}
      <div className="w-full p-6 z-20 relative flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <button
          onClick={handlePrevStep}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white/90 bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Prev</span>
        </button>

        <button
          onClick={handleNextStep}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl flex items-center gap-1.5 active:scale-95 transition-all"
          style={{ backgroundColor: activePrimary }}
        >
          <span>{currentStep === totalSteps - 1 ? 'Open App' : 'Next'}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
