import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiArrowLeft, HiMapPin, HiXMark, HiChevronDown, HiFunnel, HiMagnifyingGlass } from 'react-icons/hi2';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { toast } from 'react-toastify';
import { useTenant } from '../context/TenantContext';
import { useLanguage } from '../context/LanguageContext';
import { getMediaUrl } from '../utils/mediaUrl';

export default function DevelopmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { primaryColor, secondaryColor } = useTenant();
  
  const initialCategory = location.state?.category || new URLSearchParams(location.search).get('category') || 'All';
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const tabsRef = useRef(null);

  // Area Hierarchy State (Block -> Gram Panchayat -> Village)
  const [areaTreeData, setAreaTreeData] = useState({ levels: [], tree: [] });
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [selectedPanchayatId, setSelectedPanchayatId] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');
  const [showAreaFilters, setShowAreaFilters] = useState(false);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [showPanchayatDropdown, setShowPanchayatDropdown] = useState(false);
  const [showVillageDropdown, setShowVillageDropdown] = useState(false);
  const [blockSearch, setBlockSearch] = useState('');
  const [panchayatSearch, setPanchayatSearch] = useState('');
  const [villageSearch, setVillageSearch] = useState('');

  useEffect(() => {
    const cat = location.state?.category || new URLSearchParams(location.search).get('category');
    if (cat) {
      setActiveFilter(cat);
    }
  }, [location.state, location.search]);

  // Fetch Area Tree for cascading hierarchy filter
  useEffect(() => {
    const fetchAreaTree = async () => {
      try {
        const areaRes = await api.getAreaTree().catch(() => null);
        if (areaRes) {
          const rawLevels = areaRes.levels || [];
          const filteredLevels = rawLevels.filter(lvl => {
            const name = String(lvl?.name || lvl?.type || '').toLowerCase();
            return !name.includes('ward') && !name.includes('वार्ड');
          });
          setAreaTreeData({
            ...areaRes,
            levels: filteredLevels,
            tree: areaRes.tree || []
          });
        }
      } catch (err) {
        console.warn('Error loading area tree in DevelopmentPage:', err);
      }
    };

    fetchAreaTree();
  }, []);

  // Cascading options
  const blockOptions = (areaTreeData.tree || []).filter(b => 
    !blockSearch.trim() || (b.name || '').toLowerCase().includes(blockSearch.toLowerCase())
  );
  
  const currentBlockNode = (areaTreeData.tree || []).find(b => String(b._id || b.id) === String(selectedBlockId));
  const rawPanchayatOptions = currentBlockNode?.children || [];
  const panchayatOptions = rawPanchayatOptions.filter(p => 
    !panchayatSearch.trim() || (p.name || '').toLowerCase().includes(panchayatSearch.toLowerCase())
  );

  const currentPanchayatNode = rawPanchayatOptions.find(p => String(p._id || p.id) === String(selectedPanchayatId));
  const rawVillageOptions = currentPanchayatNode?.children || [];
  const villageOptions = rawVillageOptions.filter(v => 
    !villageSearch.trim() || (v.name || '').toLowerCase().includes(villageSearch.toLowerCase())
  );

  const handleBlockChange = (e) => {
    setSelectedBlockId(e.target.value);
    setSelectedPanchayatId('');
    setSelectedVillageId('');
    setPanchayatSearch('');
    setVillageSearch('');
  };

  const handlePanchayatChange = (e) => {
    setSelectedPanchayatId(e.target.value);
    setSelectedVillageId('');
    setVillageSearch('');
  };

  const handleVillageChange = (e) => {
    setSelectedVillageId(e.target.value);
  };

  const clearAreaFilter = () => {
    setSelectedBlockId('');
    setSelectedPanchayatId('');
    setSelectedVillageId('');
    setBlockSearch('');
    setPanchayatSearch('');
    setVillageSearch('');
  };

  const isAreaFilterActive = Boolean(selectedBlockId || selectedPanchayatId || selectedVillageId);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true);
        const res = await api.getWorks({ limit: 100 }).catch(() => []);
        const list = Array.isArray(res) 
          ? res 
          : (Array.isArray(res?.data?.data) 
            ? res.data.data 
            : (Array.isArray(res?.data) 
              ? res.data 
              : (Array.isArray(res?.items) ? res.items : [])));
        
        // Dynamically extract unique categories from all works
        const dynamicCats = [
          'All',
          ...Array.from(new Set(list.map(w => (w.category || '').trim()).filter(Boolean)))
        ];
        setCategories(dynamicCats);

        if (!activeFilter || activeFilter === 'All') {
          setWorks(list);
        } else {
          setWorks(list.filter(w => (w.category || '').trim().toLowerCase() === activeFilter.trim().toLowerCase()));
        }
      } catch (err) {
        console.warn('Error fetching works:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [activeFilter]);

  // Auto-scroll horizontal category tabs so next tabs become visible
  useEffect(() => {
    if (!tabsRef.current || categories.length <= 3) return;
    const el = tabsRef.current;
    const step = 110;
    const timer = setInterval(() => {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 5) return;
      if (el.scrollLeft + step >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 2800);

    return () => clearInterval(timer);
  }, [categories.length]);

  // Combined Area + Category + Search query filtering
  const filteredWorks = works.filter((w) => {
    // 1. Search Query Match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const areaObjName = w.areaId?.name || w.area?.name || '';
      const textMatch = (
        (w.title && w.title.toLowerCase().includes(q)) ||
        (w.description && w.description.toLowerCase().includes(q)) ||
        (areaObjName && areaObjName.toLowerCase().includes(q)) ||
        (w.location && w.location.toLowerCase().includes(q)) ||
        (w.category && w.category.toLowerCase().includes(q))
      );
      if (!textMatch) return false;
    }

    // 2. Area Hierarchy Filter Match
    if (isAreaFilterActive) {
      const itemAreaId = String(w.areaId?._id || w.areaId?.id || (typeof w.areaId === 'string' ? w.areaId : '') || w.area?._id || w.area?.id || w.targetArea?._id || '');
      const areaObjName = (w.areaId?.name || w.area?.name || w.targetArea?.name || w.areaName || '').toLowerCase();
      const locationText = (w.location || '').toLowerCase();
      const titleText = (w.title || '').toLowerCase();
      const combinedLocation = `${areaObjName} ${locationText} ${titleText}`;

      // If Village is selected: Match Village ID or Village Name
      if (selectedVillageId) {
        const villageNode = villageOptions.find(v => String(v._id || v.id) === String(selectedVillageId));
        const villageName = (villageNode?.name || '').toLowerCase();
        const idMatches = itemAreaId && itemAreaId === String(selectedVillageId);
        const nameMatches = villageName && combinedLocation.includes(villageName);
        if (!idMatches && !nameMatches) return false;
      }
      // Else if Panchayat is selected: Match Panchayat ID, Panchayat Name or any child Village ID/name
      else if (selectedPanchayatId) {
        const panchayatNode = currentPanchayatNode;
        const panchayatName = (panchayatNode?.name || '').toLowerCase();
        const childVillageIds = (panchayatNode?.children || []).map(v => String(v._id || v.id));
        const childVillageNames = (panchayatNode?.children || []).map(v => (v.name || '').toLowerCase()).filter(Boolean);

        const idMatches = (itemAreaId && itemAreaId === String(selectedPanchayatId)) || childVillageIds.includes(itemAreaId);
        const nameMatches = (panchayatName && combinedLocation.includes(panchayatName)) || childVillageNames.some(vn => combinedLocation.includes(vn));

        if (!idMatches && !nameMatches) return false;
      }
      // Else if Block is selected: Match Block ID, Block Name or any child Panchayat / Village
      else if (selectedBlockId) {
        const blockNode = currentBlockNode;
        const blockName = (blockNode?.name || '').toLowerCase();
        
        // Collect all descendant IDs and names
        const descendantIds = [];
        const descendantNames = [];
        (blockNode?.children || []).forEach(p => {
          descendantIds.push(String(p._id || p.id));
          if (p.name) descendantNames.push(p.name.toLowerCase());
          (p.children || []).forEach(v => {
            descendantIds.push(String(v._id || v.id));
            if (v.name) descendantNames.push(v.name.toLowerCase());
          });
        });

        const idMatches = (itemAreaId && itemAreaId === String(selectedBlockId)) || descendantIds.includes(itemAreaId);
        const nameMatches = (blockName && combinedLocation.includes(blockName)) || descendantNames.some(dn => combinedLocation.includes(dn));

        if (!idMatches && !nameMatches) return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('complete')) {
      return { label: t('completed'), color: 'bg-green-100 text-green-700' };
    }
    if (s.includes('progress') || s.includes('ongoing')) {
      return { label: t('inProgress'), color: 'bg-blue-100 text-blue-700' };
    }
    return { label: t('planned'), color: 'bg-purple-100 text-purple-700' };
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">
            {t('worksTitle')}
          </h1>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowAreaFilters(prev => !prev)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-95 shrink-0 ${
            isAreaFilterActive || showAreaFilters
              ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
          style={isAreaFilterActive ? { borderColor: primaryColor, color: primaryColor } : {}}
        >
          <HiFunnel className="w-3.5 h-3.5" />
          <span>{isAreaFilterActive ? 'Filter Active' : 'Area Filter'}</span>
          {isAreaFilterActive && (
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="p-4 flex flex-col gap-4">
          
          {/* Area Hierarchy Filter Box (Block -> Gram Panchayat -> Village) */}
          {(showAreaFilters || isAreaFilterActive) && (
            <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <HiMapPin className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>क्षेत्र अनुसार फ़िल्टर करें (Area Filter)</span>
                </div>
                {isAreaFilterActive && (
                  <button
                    onClick={clearAreaFilter}
                    className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 active:scale-95"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                    <span>फ़िल्टर हटाएं (Reset)</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Custom Searchable Block Dropdown */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                    1. ब्लॉक (Block)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlockDropdown(prev => !prev);
                        setShowPanchayatDropdown(false);
                        setShowVillageDropdown(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 flex items-center justify-between hover:bg-white focus:border-orange-500 transition-all text-left"
                    >
                      <span className="truncate">
                        {currentBlockNode ? currentBlockNode.name : 'सभी ब्लॉक (All Blocks)'}
                      </span>
                      <HiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showBlockDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showBlockDropdown && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 flex flex-col gap-1.5 animate-fade-in max-h-60">
                        <div className="relative">
                          <HiMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="ब्लॉक खोजें (Search)..."
                            value={blockSearch}
                            onChange={(e) => setBlockSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5 pr-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBlockId('');
                              setSelectedPanchayatId('');
                              setSelectedVillageId('');
                              setShowBlockDropdown(false);
                              setBlockSearch('');
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                              !selectedBlockId ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            सभी ब्लॉक (All Blocks)
                          </button>
                          {blockOptions.map(b => (
                            <button
                              key={b._id || b.id}
                              type="button"
                              onClick={() => {
                                setSelectedBlockId(String(b._id || b.id));
                                setSelectedPanchayatId('');
                                setSelectedVillageId('');
                                setShowBlockDropdown(false);
                                setBlockSearch('');
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all truncate ${
                                String(b._id || b.id) === String(selectedBlockId)
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                          {blockOptions.length === 0 && (
                            <div className="text-[11px] text-gray-400 text-center py-2">कोई ब्लॉक नहीं मिला</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Custom Searchable Gram Panchayat Dropdown */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                    2. ग्राम पंचायत (Panchayat)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!selectedBlockId || rawPanchayatOptions.length === 0}
                      onClick={() => {
                        setShowPanchayatDropdown(prev => !prev);
                        setShowBlockDropdown(false);
                        setShowVillageDropdown(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 flex items-center justify-between hover:bg-white focus:border-orange-500 transition-all text-left disabled:opacity-50 disabled:bg-gray-100"
                    >
                      <span className="truncate">
                        {!selectedBlockId 
                          ? 'पहले ब्लॉक चुनें' 
                          : currentPanchayatNode 
                          ? currentPanchayatNode.name 
                          : 'सभी ग्राम पंचायत (All)'}
                      </span>
                      <HiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showPanchayatDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showPanchayatDropdown && selectedBlockId && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 flex flex-col gap-1.5 animate-fade-in max-h-60">
                        <div className="relative">
                          <HiMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="पंचायत खोजें (Search)..."
                            value={panchayatSearch}
                            onChange={(e) => setPanchayatSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5 pr-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPanchayatId('');
                              setSelectedVillageId('');
                              setShowPanchayatDropdown(false);
                              setPanchayatSearch('');
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                              !selectedPanchayatId ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            सभी ग्राम पंचायत (All)
                          </button>
                          {panchayatOptions.map(p => (
                            <button
                              key={p._id || p.id}
                              type="button"
                              onClick={() => {
                                setSelectedPanchayatId(String(p._id || p.id));
                                setSelectedVillageId('');
                                setShowPanchayatDropdown(false);
                                setPanchayatSearch('');
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all truncate ${
                                String(p._id || p.id) === String(selectedPanchayatId)
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                          {panchayatOptions.length === 0 && (
                            <div className="text-[11px] text-gray-400 text-center py-2">कोई पंचायत नहीं मिली</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Custom Searchable Village Dropdown */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                    3. ग्राम / गांव (Village)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!selectedPanchayatId || rawVillageOptions.length === 0}
                      onClick={() => {
                        setShowVillageDropdown(prev => !prev);
                        setShowBlockDropdown(false);
                        setShowPanchayatDropdown(false);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 flex items-center justify-between hover:bg-white focus:border-orange-500 transition-all text-left disabled:opacity-50 disabled:bg-gray-100"
                    >
                      <span className="truncate">
                        {!selectedPanchayatId 
                          ? 'पहले पंचायत चुनें' 
                          : rawVillageOptions.find(v => String(v._id || v.id) === String(selectedVillageId))?.name || 'सभी गांव (All Villages)'}
                      </span>
                      <HiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showVillageDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showVillageDropdown && selectedPanchayatId && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 flex flex-col gap-1.5 animate-fade-in max-h-60">
                        <div className="relative">
                          <HiMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="गांव खोजें (Search)..."
                            value={villageSearch}
                            onChange={(e) => setVillageSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5 pr-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVillageId('');
                              setShowVillageDropdown(false);
                              setVillageSearch('');
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                              !selectedVillageId ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            सभी गांव (All Villages)
                          </button>
                          {villageOptions.map(v => (
                            <button
                              key={v._id || v.id}
                              type="button"
                              onClick={() => {
                                setSelectedVillageId(String(v._id || v.id));
                                setShowVillageDropdown(false);
                                setVillageSearch('');
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all truncate ${
                                String(v._id || v.id) === String(selectedVillageId)
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {v.name}
                            </button>
                          ))}
                          {villageOptions.length === 0 && (
                            <div className="text-[11px] text-gray-400 text-center py-2">कोई गांव नहीं मिला</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Selection Breadcrumb summary */}
              {isAreaFilterActive && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                  <span className="font-bold text-gray-900">चयनित क्षेत्र:</span>
                  <span>
                    {[
                      currentBlockNode?.name,
                      currentPanchayatNode?.name,
                      rawVillageOptions.find(v => String(v._id || v.id) === String(selectedVillageId))?.name
                    ].filter(Boolean).join(' ➔ ')}
                  </span>
                  <span className="ml-auto font-black" style={{ color: primaryColor }}>
                    ({filteredWorks.length} कार्य मिले)
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none sm:text-sm font-medium transition-shadow shadow-sm"
              style={{ outlineColor: primaryColor }}
              placeholder={t('searchWorksPlaceholder')}
            />
          </div>

          {/* Filter Chips with Auto Slide */}
          <div 
            ref={tabsRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 scroll-smooth"
          >
            {categories.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === filter 
                    ? 'text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                style={activeFilter === filter ? { backgroundColor: primaryColor } : {}}
              >
                {filter === 'All' ? t('allFilter') : filter}
              </button>
            ))}
          </div>

          {/* Works List */}
          {isLoading ? (
            <LoadingSpinner message={t('loading')} />
          ) : filteredWorks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredWorks.map((work) => {
                const badge = getStatusBadge(work.status);
                const workId = work._id || work.id;
                const rawImg = (Array.isArray(work.images) && work.images.length > 0 ? work.images[0] : null) ||
                  work.coverImageUrl ||
                  work.imageUrl ||
                  work.image ||
                  work.coverImage ||
                  null;
                const workImage = rawImg ? getMediaUrl(rawImg) : null;

                return (
                  <div 
                    key={workId} 
                    onClick={() => {
                      if (!storage.isRegistered()) {
                        toast.warn('ऐप इस्तेमाल करने के लिए रजिस्ट्रेशन करना जरूरी है!', { toastId: 'reg-req' });
                        window.dispatchEvent(new CustomEvent('pwa_open_registration'));
                        return;
                      }
                      navigate(`/works/${workId}`);
                    }}
                    className="bg-white rounded-2xl p-3.5 flex gap-4 shadow-sm border border-gray-100 items-center cursor-pointer transition-transform active:scale-[0.98] hover:shadow-md hover:border-gray-300"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative flex items-center justify-center">
                      {workImage ? (
                        <img 
                          src={workImage} 
                          alt={work.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-full h-full items-center justify-center flex-col text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200 ${workImage ? 'hidden' : 'flex'}`}
                      >
                        <span className="text-2xl">🏗️</span>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col flex-1 py-1 min-w-0">
                      <span 
                        className="text-[0.62rem] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: primaryColor }}
                      >
                        {work.category || 'Development'}
                      </span>
                      <h3 className="text-sm font-extrabold text-gray-900 leading-tight mb-1 line-clamp-2">{work.title}</h3>
                      <p className="text-xs text-gray-500 font-semibold mb-2 line-clamp-1">{work.areaId?.name || work.area?.name || work.location || 'Local Area'}</p>
                      
                      {/* Badge */}
                      <div className="mt-auto">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-bold tracking-wide ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-6">
              <p className="text-sm font-bold text-gray-700 mb-1">{t('noWorksFound')}</p>
              <p className="text-xs text-gray-400">{t('noWorksFoundDesc')}</p>
            </div>
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  );
}

