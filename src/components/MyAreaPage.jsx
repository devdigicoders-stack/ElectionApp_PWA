import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { useLanguage } from '../context/LanguageContext';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { getMediaUrl } from '../utils/mediaUrl';
import { 
  HiWrenchScrewdriver, 
  HiArrowLeft, 
  HiMapPin
} from 'react-icons/hi2';

export default function MyAreaPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const { t } = useLanguage();
  const [userArea, setUserArea] = useState({
    district: '',
    assembly: '',
    block: '',
    panchayat: '',
    village: '',
    ward: '',
    booth: '',
    displayArea: ''
  });
  const [areaWorks, setAreaWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to test if a string looks like a 24-character hexadecimal MongoDB ObjectId
  const isMongoId = (val) => Boolean(val && typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val.trim()));

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch live citizen profile
      let user = storage.getUser() || {};
      let areaInfo = null;
      const token = storage.getToken();
      if (token) {
        try {
          const profileRes = await api.getCitizenProfile().catch(() => null);
          if (profileRes) {
            const freshUser = profileRes.profile || profileRes.data || profileRes;
            areaInfo = profileRes.area || null;
            user = { ...user, ...freshUser };
            storage.setUser(user);
          }
        } catch (e) {
          console.warn('Could not fetch live profile:', e);
        }
      }

      let userBlock = user.areaDetails?.block || user.block || '';
      let userPanchayat = user.areaDetails?.panchayat || user.panchayat || '';
      let userVillage = user.areaDetails?.village || user.village || '';
      let breadcrumbText = areaInfo?.breadcrumbText || (user.assembly && user.assembly.includes('➔') ? user.assembly : '');

      if (areaInfo?.breadcrumbs && Array.isArray(areaInfo.breadcrumbs)) {
        areaInfo.breadcrumbs.forEach(item => {
          const lvl = String(item.levelName || item.type || '').toLowerCase();
          if (lvl.includes('block') || item.levelOrder === 1) userBlock = item.name;
          else if (lvl.includes('panchayat') || item.levelOrder === 2) userPanchayat = item.name;
          else if (lvl.includes('village') || lvl.includes('gram') || item.levelOrder === 3) userVillage = item.name;
        });
      } else if (breadcrumbText && breadcrumbText.includes('➔')) {
        const parts = breadcrumbText.split('➔').map(s => s.trim()).filter(Boolean);
        if (parts[0]) userBlock = parts[0];
        if (parts[1]) userPanchayat = parts[1];
        if (parts[2]) userVillage = parts[2];
      }

      // Filter out any raw ObjectId that might have leaked into user.area
      if (isMongoId(userVillage)) userVillage = '';
      if (isMongoId(userPanchayat)) userPanchayat = '';
      if (isMongoId(userBlock)) userBlock = '';

      const userDistrict = isMongoId(user.district) ? '' : (user.district || user.city || '');
      const userAssembly = isMongoId(user.assembly) ? '' : (user.assembly || user.vidhanSabha || '');
      const userWard = isMongoId(user.ward) ? '' : (user.ward || '');
      const userBooth = isMongoId(user.booth) ? '' : (user.booth || '');
      const userAreaId = user.areaId || user.area?._id || user.area?.id || '';

      const displayList = [userBlock, userPanchayat, userVillage, userWard].filter(s => s && !isMongoId(s));
      const displayArea = displayList.length > 0 
        ? displayList.join(' ➔ ') 
        : (breadcrumbText && !breadcrumbText.includes('No area') ? breadcrumbText : (userAssembly || 'Local Constituency'));

      setUserArea({
        district: userDistrict,
        assembly: userAssembly,
        block: userBlock,
        panchayat: userPanchayat,
        village: userVillage,
        ward: userWard,
        booth: userBooth,
        displayArea
      });

      const slug = api.getTenantSlug();
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const rawWorks = await api.getAllWorks().catch(() => []);

        // Flexible Area Matcher for Citizen Area
        const matchesUserArea = (item) => {
          if (!item) return false;

          // 1. Direct ID matching (Area ID can be string or populated object)
          const itemAreaId = item.areaId?._id || item.areaId?.id || (typeof item.areaId === 'string' ? item.areaId : '') || item.area?._id || item.area?.id || item.targetArea?._id || '';
          if (userAreaId && itemAreaId && String(itemAreaId) === String(userAreaId)) {
            return true;
          }

          // 2. Extract area name from areaId object or area fields
          const areaObjName = item.areaId?.name || item.areaId?.title || item.area?.name || item.targetArea?.name || item.areaName || '';

          const filters = [userWard, userVillage, userBooth, userPanchayat, userBlock, userAssembly, userDistrict]
            .filter(Boolean)
            .map(s => String(s).toLowerCase().trim())
            .filter(s => s.length > 1);

          // If user hasn't set any specific sub-area yet, show all constituency works
          if (filters.length === 0) {
            return true;
          }

          const itemFields = [
            areaObjName,
            item.location,
            item.constituency,
            item.ward,
            item.village,
            item.panchayat,
            item.block,
            item.assembly,
            item.district
          ].filter(Boolean).map(s => String(s).toLowerCase().trim());

          const combinedItemText = `${itemFields.join(' ')} ${String(item.title || '').toLowerCase()} ${String(item.description || '').toLowerCase()}`;

          // Check if any part of user's area hierarchy matches this work
          return filters.some(f => combinedItemText.includes(f));
        };

        const filteredWorks = rawWorks.filter(matchesUserArea);
        // Fallback: If strict match found 0 works, display all available works for the constituency
        setAreaWorks(filteredWorks.length > 0 ? filteredWorks : rawWorks);
      } catch (err) {
        console.warn('Error fetching area data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Top Header */}
      <div 
        className="shrink-0 px-4 pt-4 pb-6 relative overflow-hidden text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center justify-between mb-2 relative z-10 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all shrink-0 text-white"
            >
              <HiArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-black text-white tracking-tight truncate">
              {t('myArea') || 'My Area'}
            </h1>
          </div>
          <button 
            onClick={() => navigate('/complete-profile')} 
            className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl backdrop-blur-xs active:scale-95 transition-all shrink-0"
          >
            Change Area
          </button>
        </div>

        <div className="flex items-center gap-1.5 relative z-10 text-white/95 text-xs font-semibold px-1">
          <HiMapPin className="w-4 h-4 text-white shrink-0" />
          <p className="truncate">
            {userArea.displayArea || 'Local Constituency'}
          </p>
        </div>
      </div>

      {/* Main Content: Development Works in My Area Only */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiWrenchScrewdriver className="w-5 h-5" style={{ color: primaryColor }} />
            <h2 className="text-base font-extrabold text-gray-900">
              {t('developmentWorks')} ({areaWorks.length})
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="क्षेत्रीय कार्य लोड हो रहे हैं..." />
          </div>
        ) : areaWorks.length > 0 ? (
          <div className="flex flex-col gap-3 pb-6">
            {areaWorks.map(work => {
              const statusText = work.status || 'Active';
              const isCompleted = String(statusText).toLowerCase().includes('complete');
              const isInProgress = String(statusText).toLowerCase().includes('progress') || String(statusText).toLowerCase().includes('ongoing');

              return (
                <div 
                  key={work._id || work.id} 
                  onClick={() => navigate(`/works/${work._id || work.id}`)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs cursor-pointer active:scale-[0.99] transition-transform flex gap-3.5 hover:border-gray-200"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                    <img
                      src={getMediaUrl(work.coverImageUrl || work.img, '/highway_project.jpg')}
                      alt={work.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/highway_project.jpg'; }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
                        <span 
                          className={`text-[0.65rem] font-black px-2 py-0.5 rounded-md ${
                            isCompleted 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : isInProgress
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {statusText}
                        </span>

                        <span className="text-[0.65rem] font-bold text-gray-400 truncate">
                          {work.areaId?.name || work.area?.name || work.location || userArea.village || userArea.panchayat || userArea.block || 'Constituency'}
                        </span>
                      </div>

                      <p className="text-xs font-extrabold text-gray-900 line-clamp-2 leading-snug">
                        {work.title}
                      </p>
                    </div>

                    {work.description && (
                      <p className="text-[0.7rem] text-gray-500 font-medium line-clamp-1 mt-1">
                        {work.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200 shadow-xs mt-2">
            <HiWrenchScrewdriver className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">{t('ongoingWorksInfo') || 'आपके क्षेत्र में अभी कोई कार्य दर्ज नहीं है।'}</p>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">
              {userArea.displayArea || 'No Area Specified'}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

