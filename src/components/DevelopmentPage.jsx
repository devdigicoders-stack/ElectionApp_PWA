import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiMapPin, 
  HiXMark, 
  HiChevronDown, 
  HiFunnel, 
  HiMagnifyingGlass,
  HiSquares2X2,
  HiTableCells,
  HiArrowDownTray,
  HiEye,
  HiDocumentText
} from 'react-icons/hi2';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { toast } from 'react-toastify';
import { useTenant } from '../context/TenantContext';
import { useLanguage } from '../context/LanguageContext';
import { getMediaUrl } from '../utils/mediaUrl';
import { matchHindiEnglish } from '../utils/searchMatcher';

export default function DevelopmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { primaryColor, secondaryColor, config } = useTenant();
  
  const initialCategory = location.state?.category || new URLSearchParams(location.search).get('category') || 'All';
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'pdf'
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const tabsRef = useRef(null);
  const pdfPrintRef = useRef(null);
  const contentScrollRef = useRef(null);

  // Scroll to top helper
  const scrollToTop = () => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Pagination / Load More state (Initial 20 items per batch, loads all smoothly)
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter, searchQuery, selectedBlockId, selectedPanchayatId, selectedVillageId]);

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

  // Cascading options with bilingual Hindi + English (Hinglish/Phonetic) search
  const blockOptions = (areaTreeData.tree || []).filter(b => 
    !blockSearch.trim() || matchHindiEnglish(b.name, blockSearch)
  );
  
  const currentBlockNode = (areaTreeData.tree || []).find(b => String(b._id || b.id) === String(selectedBlockId));
  const rawPanchayatOptions = currentBlockNode?.children || [];
  const panchayatOptions = rawPanchayatOptions.filter(p => 
    !panchayatSearch.trim() || matchHindiEnglish(p.name, panchayatSearch)
  );

  const currentPanchayatNode = rawPanchayatOptions.find(p => String(p._id || p.id) === String(selectedPanchayatId));
  const rawVillageOptions = currentPanchayatNode?.children || [];
  const villageOptions = rawVillageOptions.filter(v => 
    !villageSearch.trim() || matchHindiEnglish(v.name, villageSearch)
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
        const list = await api.getAllWorks().catch(() => []);
        
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

  // Combined Area + Category + Search query filtering (Hindi + English)
  const filteredWorks = works.filter((w) => {
    // 1. Search Query Match (Supports Hindi and English transliteration)
    if (searchQuery.trim()) {
      const areaObjName = w.areaId?.name || w.area?.name || '';
      const textMatch = (
        matchHindiEnglish(w.title, searchQuery) ||
        matchHindiEnglish(w.description, searchQuery) ||
        matchHindiEnglish(areaObjName, searchQuery) ||
        matchHindiEnglish(w.location, searchQuery) ||
        matchHindiEnglish(w.category, searchQuery)
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

      // If Village is selected: Match Village ID or Village Name (Hindi & English)
      if (selectedVillageId) {
        const villageNode = villageOptions.find(v => String(v._id || v.id) === String(selectedVillageId));
        const villageName = villageNode?.name || '';
        const idMatches = itemAreaId && itemAreaId === String(selectedVillageId);
        const nameMatches = villageName && (
          matchHindiEnglish(combinedLocation, villageName) ||
          matchHindiEnglish(villageName, combinedLocation)
        );
        if (!idMatches && !nameMatches) return false;
      }
      // Else if Panchayat is selected: Match Panchayat ID, Panchayat Name or any child Village ID/name (Hindi & English)
      else if (selectedPanchayatId) {
        const panchayatNode = currentPanchayatNode;
        const panchayatName = panchayatNode?.name || '';
        const childVillageIds = (panchayatNode?.children || []).map(v => String(v._id || v.id));
        const childVillageNames = (panchayatNode?.children || []).map(v => v.name || '').filter(Boolean);

        const idMatches = (itemAreaId && itemAreaId === String(selectedPanchayatId)) || childVillageIds.includes(itemAreaId);
        const nameMatches = (panchayatName && matchHindiEnglish(combinedLocation, panchayatName)) || 
          childVillageNames.some(vn => matchHindiEnglish(combinedLocation, vn));

        if (!idMatches && !nameMatches) return false;
      }
      // Else if Block is selected: Match Block ID, Block Name or any child Panchayat / Village (Hindi & English)
      else if (selectedBlockId) {
        const blockNode = currentBlockNode;
        const blockName = blockNode?.name || '';
        
        // Collect all descendant IDs and names
        const descendantIds = [];
        const descendantNames = [];
        (blockNode?.children || []).forEach(p => {
          descendantIds.push(String(p._id || p.id));
          if (p.name) descendantNames.push(p.name);
          (p.children || []).forEach(v => {
            descendantIds.push(String(v._id || v.id));
            if (v.name) descendantNames.push(v.name);
          });
        });

        const idMatches = (itemAreaId && itemAreaId === String(selectedBlockId)) || descendantIds.includes(itemAreaId);
        const nameMatches = (blockName && matchHindiEnglish(combinedLocation, blockName)) || 
          descendantNames.some(dn => matchHindiEnglish(combinedLocation, dn));

        if (!idMatches && !nameMatches) return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('complete') || s.includes('पूर्ण')) {
      return { 
        label: t('statusCompleted') || 'कार्य पूर्ण', 
        color: 'bg-emerald-100 text-emerald-800 border border-emerald-300', 
        printColor: '#15803d', 
        printBg: '#dcfce7',
        type: 'completed'
      };
    }
    if (s.includes('progress') || s.includes('ongoing') || s.includes('प्रगति')) {
      return { 
        label: t('statusInProgress') || 'कार्य प्रगति पर', 
        color: 'bg-blue-100 text-blue-800 border border-blue-300', 
        printColor: '#1d4ed8', 
        printBg: '#dbeafe',
        type: 'in_progress'
      };
    }
    if (s.includes('approve') || s.includes('sanction') || s.includes('स्वीकृत')) {
      return { 
        label: t('statusApproved') || 'कार्य स्वीकृत', 
        color: 'bg-purple-100 text-purple-800 border border-purple-300', 
        printColor: '#b91c1c', 
        printBg: '#fee2e2',
        type: 'approved'
      };
    }
    return { 
      label: t('statusProposed') || 'प्रस्तावित मार्ग', 
      color: 'bg-rose-100 text-rose-800 border border-rose-300', 
      printColor: '#dc2626', 
      printBg: '#fee2e2',
      type: 'proposed'
    };
  };

  // Helper getters for Road & Development works
  const getWorkLength = (w) => {
    if (w.proposedLength) return String(w.proposedLength);
    if (w.length) return String(w.length);
    // Extract from title/desc if contains किमी / km
    const text = `${w.title || ''} ${w.description || ''}`;
    const kmMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:किमी|कि०मी०|km|किलोमीटर)/i);
    if (kmMatch) return `${kmMatch[1]} किमी०`;
    const meterMatch = text.match(/([0-9]+)\s*(?:मी०|मीटर|meter)/i);
    if (meterMatch) return `${meterMatch[1]} मी०`;
    return w.budget ? `₹ ${w.budget}` : '-';
  };

  const getWorkDepartment = (w) => {
    if (w.department) return w.department;
    if (w.agency) return w.agency;
    const text = `${w.title || ''} ${w.description || ''}`.toUpperCase();
    if (text.includes('PWD') || text.includes('पी०डब्ल्यू०डी') || text.includes('लोक निर्माण')) return 'PWD';
    if (text.includes('मंडी') || text.includes('MANDI')) return 'मंडी परिषद';
    if (text.includes('PMGSY') || text.includes('पीएमजीएसवाई')) return 'आर०ई०एस० PMGSY';
    if (text.includes('त्वरित') || text.includes('आर०ई०एस० त्वरित') || text.includes('RES TVARIT')) return 'आर०ई०एस० त्वरित';
    if (text.includes('राज्यांश') || text.includes('राज्यान्श')) return 'आर०ई०एस० राज्यांश';
    if (text.includes('RES') || text.includes('आर०ई०एस')) return 'आर०ई०एस०';
    return w.category || 'PWD';
  };

  const getWorkYear = (w) => {
    if (w.financialYear) return w.financialYear;
    if (w.year) return w.year;
    const text = `${w.title || ''} ${w.description || ''}`;
    const yrMatch = text.match(/20(2[0-9])[-–/](2[0-9])/);
    if (yrMatch) return `${yrMatch[1]}-${yrMatch[2]}`;
    if (w.startDate) {
      const yr = new Date(w.startDate).getFullYear().toString().slice(-2);
      const nextYr = (Number(yr) + 1).toString();
      return `${yr}-${nextYr}`;
    }
    return '25-26';
  };

  const getWorkBlock = (w) => {
    if (w.block) return w.block;
    if (w.areaId?.name) return w.areaId.name;
    if (w.area?.name) return w.area.name;
    const loc = w.location || '';
    if (loc.includes('रामपुर') || loc.toLowerCase().includes('rampur')) return 'रामपुर';
    if (loc.includes('रामनगर') || loc.toLowerCase().includes('ramnagar')) return 'रामनगर';
    if (loc.includes('मड़ियाहूँ') || loc.includes('मडियाहू') || loc.toLowerCase().includes('madiyahu')) return 'मड़ियाहूँ';
    return loc || 'मड़ियाहूँ';
  };

  // Status statistics for report card
  const statusStats = {
    total: filteredWorks.length,
    completed: filteredWorks.filter(w => {
      const s = String(w.status || '').toLowerCase();
      return s.includes('complete') || s.includes('पूर्ण');
    }).length,
    inProgress: filteredWorks.filter(w => {
      const s = String(w.status || '').toLowerCase();
      return s.includes('progress') || s.includes('ongoing') || s.includes('प्रगति');
    }).length,
    approved: filteredWorks.filter(w => {
      const s = String(w.status || '').toLowerCase();
      return s.includes('approve') || s.includes('sanction') || s.includes('स्वीकृत');
    }).length,
    proposed: filteredWorks.filter(w => {
      const s = String(w.status || '').toLowerCase();
      return !s.includes('complete') && !s.includes('पूर्ण') && !s.includes('progress') && !s.includes('ongoing') && !s.includes('प्रगति') && !s.includes('approve') && !s.includes('स्वीकृत');
    }).length,
  };

  // Download filtered works as PDF with formatted table & metadata
  const handleDownloadPdf = async () => {
    if (filteredWorks.length === 0) {
      toast.warn(t('noWorksFound'));
      return;
    }

    try {
      setIsGeneratingPdf(true);
      toast.info(t('generatingPdf'), { autoClose: 2000 });

      // Allow DOM to update printable ref
      await new Promise(r => setTimeout(r, 200));

      const element = pdfPrintRef.current;
      if (!element) {
        throw new Error('Printable element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1000
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Landscape A4 orientation in pt (842 x 595 pt)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add remaining pages if content overflows A4 height
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const safeCategoryName = (activeFilter || 'All').replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`Vikas-Karya-${safeCategoryName}-${timestamp}.pdf`);
      toast.success(language === 'hi' ? 'PDF सफलता पूर्वक डाउनलोड हो गया!' : 'PDF downloaded successfully!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error(language === 'hi' ? 'PDF जनरेट करने में समस्या आई' : 'Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
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
          onClick={() => {
            setShowAreaFilters(prev => !prev);
            scrollToTop();
          }}
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

      <div ref={contentScrollRef} className="flex-1 overflow-y-auto w-full relative scroll-smooth">
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
                    onClick={() => {
                      clearAreaFilter();
                      scrollToTop();
                    }}
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
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2.5 flex flex-col gap-2 animate-fade-in max-h-72 ring-1 ring-black/5">
                        <div className="relative">
                          <HiMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="ब्लॉक खोजें (Search)..."
                            value={blockSearch}
                            onChange={(e) => setBlockSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all leading-normal"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-48 flex flex-col gap-1 pr-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBlockId('');
                              setSelectedPanchayatId('');
                              setSelectedVillageId('');
                              setShowBlockDropdown(false);
                              setBlockSearch('');
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all leading-relaxed ${
                              !selectedBlockId ? 'bg-orange-50 text-orange-700 font-extrabold' : 'text-gray-700 hover:bg-gray-50'
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
                              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all leading-relaxed whitespace-normal break-words ${
                                String(b._id || b.id) === String(selectedBlockId)
                                  ? 'bg-orange-50 text-orange-700 font-extrabold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                          {blockOptions.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-3 font-medium">कोई ब्लॉक नहीं मिला</div>
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
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2.5 flex flex-col gap-2 animate-fade-in max-h-72 ring-1 ring-black/5">
                        <div className="relative">
                          <HiMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="पंचायत खोजें (Search)..."
                            value={panchayatSearch}
                            onChange={(e) => setPanchayatSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all leading-normal"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-48 flex flex-col gap-1 pr-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPanchayatId('');
                              setSelectedVillageId('');
                              setShowPanchayatDropdown(false);
                              setPanchayatSearch('');
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all leading-relaxed ${
                              !selectedPanchayatId ? 'bg-orange-50 text-orange-700 font-extrabold' : 'text-gray-700 hover:bg-gray-50'
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
                              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all leading-relaxed whitespace-normal break-words ${
                                String(p._id || p.id) === String(selectedPanchayatId)
                                  ? 'bg-orange-50 text-orange-700 font-extrabold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                          {panchayatOptions.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-3 font-medium">कोई पंचायत नहीं मिली</div>
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
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2.5 flex flex-col gap-2 animate-fade-in max-h-72 ring-1 ring-black/5">
                        <div className="relative">
                          <HiMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="गांव खोजें (Search)..."
                            value={villageSearch}
                            onChange={(e) => setVillageSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all leading-normal"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto max-h-48 flex flex-col gap-1 pr-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVillageId('');
                              setShowVillageDropdown(false);
                              setVillageSearch('');
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all leading-relaxed ${
                              !selectedVillageId ? 'bg-orange-50 text-orange-700 font-extrabold' : 'text-gray-700 hover:bg-gray-50'
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
                              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all leading-relaxed whitespace-normal break-words ${
                                String(v._id || v.id) === String(selectedVillageId)
                                  ? 'bg-orange-50 text-orange-700 font-extrabold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {v.name}
                            </button>
                          ))}
                          {villageOptions.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-3 font-medium">कोई गांव नहीं मिला</div>
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

          {/* View Toggle Bar (Only 2 Modes: Card View vs PDF Report Card) & PDF Download Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setViewMode('card');
                  scrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'card' 
                    ? 'bg-white text-gray-900 shadow-xs font-black' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <HiSquares2X2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'कार्ड दृश्य' : (t('cardView') || 'Cards')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('pdf');
                  scrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'pdf' 
                    ? 'bg-white text-red-600 shadow-xs font-black' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <HiDocumentText className="w-4 h-4 text-red-500" />
                <span>{language === 'hi' ? 'PDF रिपोर्ट कार्ड' : (t('pdfView') || 'PDF Report Card')}</span>
              </button>
            </div>

            {/* Quick PDF Download Button */}
            <button
              type="button"
              disabled={isGeneratingPdf || filteredWorks.length === 0}
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-white shadow-sm hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
              title="Download PDF format"
            >
              <HiArrowDownTray className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isGeneratingPdf ? t('generatingPdf') : t('downloadPdf')}</span>
              <span className="sm:hidden">{isGeneratingPdf ? 'PDF...' : 'PDF'}</span>
            </button>
          </div>

          {/* Works Content (Cards or Table) */}
          {isLoading ? (
            <LoadingSpinner message={t('loading')} />
          ) : filteredWorks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Count Indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                <span>{t('totalWorksFound')}: <strong className="text-gray-800">{filteredWorks.length}</strong></span>
                {viewMode === 'card' && (
                  <span>दिखा रहे हैं: {Math.min(visibleCount, filteredWorks.length)} / {filteredWorks.length}</span>
                )}
                {viewMode === 'pdf' && (
                  <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-md text-[11px] font-black border border-red-200">
                    📄 PDF प्रपत्र सक्रिय
                  </span>
                )}
              </div>

              {/* 1. CARD VIEW (Traditional view) */}
              {viewMode === 'card' && (
                <>
                  {filteredWorks.slice(0, visibleCount).map((work) => {
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

                  {/* Load More Button for Pagination */}
                  {visibleCount < filteredWorks.length && (
                    <div className="pt-2 pb-6 flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                        className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-95"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span>और कार्य लोड करें (Load More)</span>
                        <span className="text-[11px] opacity-80 font-normal">
                          (+{Math.min(PAGE_SIZE, filteredWorks.length - visibleCount)} और)
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisibleCount(filteredWorks.length)}
                        className="text-[11px] font-bold text-gray-500 hover:text-gray-800 transition-colors py-1"
                      >
                        सभी {filteredWorks.length} कार्य एक साथ दिखाएं (Show All)
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* PDF REPORT CARD VIEW (Exact layout matching the PDF document) */}
              {viewMode === 'pdf' && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col p-4 sm:p-6 transition-all">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider">
                        PDF प्रपत्र दृश्य 
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-95 active:scale-95 transition-all"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <HiArrowDownTray className="w-4 h-4" />
                      <span>{isGeneratingPdf ? 'PDF तैयार हो रहा है...' : 'PDF डाउनलोड करें'}</span>
                    </button>
                  </div>

                  {/* Report Card Page Container */}
                  <div className="w-full bg-[#fdfdfd] border border-gray-300 rounded-xl p-4 sm:p-6 shadow-xs overflow-x-auto">
                    {/* Header: Leader, Area, Title */}
                    <div className="text-center pb-4 border-b border-gray-200">
                      <h2 className="text-lg sm:text-xl font-black text-[#dc2626] tracking-wide mb-0.5">
                        {config?.branding?.leaderName || 'डॉ. आर. के. पटेल, विधायक, मड़ियाहूँ'}
                      </h2>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#7c2d12] mb-1">
                        {config?.tenant?.constituency || 'मड़ियाहूँ विधानसभा क्षेत्र, 370'}
                      </h3>
                      <h4 className="text-base sm:text-lg font-black text-[#0f766e] flex items-center justify-center gap-2">
                        <span>सड़क एवं संपर्क मार्ग विकास कार्य — रिपोर्ट कार्ड</span>
                      </h4>

                      {/* Summary Counters Banner */}
                      <div className="mt-3">
                        <div className="text-sm font-extrabold text-[#dc2626]">
                          {filteredWorks.length} विकास कार्यों का विवरण
                        </div>
                        <div className="text-xs font-bold text-gray-700 mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                          <span className="text-emerald-700 font-black">{statusStats.completed} कार्य पूर्ण</span>
                          <span>•</span>
                          <span className="text-blue-700 font-black">{statusStats.inProgress} कार्य प्रगति पर</span>
                          <span>•</span>
                          <span className="text-purple-700 font-black">{statusStats.approved} कार्य स्वीकृत</span>
                          <span>•</span>
                          <span className="text-rose-700 font-black">प्रस्तावित {statusStats.proposed}</span>
                        </div>
                      </div>

                      {/* Major Work Categories Pills */}
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex flex-col items-center gap-1 text-[11px] font-bold text-gray-800">
                        <span className="text-xs font-black text-rose-700">प्रमुख कार्य</span>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-700">
                          <span>🔹 सड़क का चौड़ीकरण एवं सुदृढ़ीकरण</span>
                          <span>🔹 ग्रामीण क्षेत्रों में नवीन पिच रोड एवं सी.सी. रोड निर्माण</span>
                          <span>🔹 विशेष मरम्मत कार्य</span>
                          <span>🔹 इंटरलॉकिंग कार्य</span>
                        </div>
                      </div>

                      {/* Meta Information Bar (Blocks, Departments & Financial Years) */}
                      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-2 text-[11px] font-semibold text-gray-700 flex flex-col gap-1 text-center">
                        <div>
                          <strong className="text-cyan-800">विकास खण्ड:</strong> रामपुर | रामनगर | मड़ियाहूँ
                        </div>
                        <div>
                          <strong className="text-gray-900">विभाग:</strong> लोक निर्माण विभाग (PWD) | मंडी परिषद | आर.ई.एस. त्वरित | आर.ई.एस. राज्यांश | PMGSY
                        </div>
                        <div className="text-amber-800 font-bold">
                          वित्तीय वर्ष 2022–23 से 2026–27 तक के कार्यों का संकलित विवरण
                        </div>
                      </div>
                    </div>

                    {/* PDF-Style Table */}
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400 text-xs text-left">
                        <thead>
                          <tr className="bg-gray-100 text-gray-900 font-black text-[10px] uppercase border-b-2 border-gray-400">
                            <th className="border border-gray-400 p-2 text-center w-12">क्र०सं०</th>
                            <th className="border border-gray-400 p-2 min-w-[200px]">कार्य का नाम</th>
                            <th className="border border-gray-400 p-2 text-center min-w-[100px]">प्रस्तावित लम्बाई</th>
                            <th className="border border-gray-400 p-2 text-center min-w-[85px]">विकास खण्ड</th>
                            <th className="border border-gray-400 p-2 text-center min-w-[80px]">विभाग</th>
                            <th className="border border-gray-400 p-2 text-center min-w-[70px]">वित्तीय वर्ष</th>
                            <th className="border border-gray-400 p-2 text-center min-w-[95px]">कार्य की स्थिति</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredWorks.map((work, idx) => {
                            const badge = getStatusBadge(work.status);
                            const lengthText = getWorkLength(work);
                            const blockText = getWorkBlock(work);
                            const deptText = getWorkDepartment(work);
                            const yearText = getWorkYear(work);

                            return (
                              <tr 
                                key={work._id || idx}
                                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                              >
                                <td className="border border-gray-400 p-2 text-center font-bold text-gray-700">
                                  {idx + 1}
                                </td>
                                <td className="border border-gray-400 p-2 font-semibold text-gray-900 leading-snug">
                                  {work.title}
                                </td>
                                <td className="border border-gray-400 p-2 text-center font-bold text-gray-800 whitespace-nowrap">
                                  {lengthText}
                                </td>
                                <td className="border border-gray-400 p-2 text-center font-medium text-gray-800 whitespace-nowrap">
                                  {blockText}
                                </td>
                                <td className="border border-gray-400 p-2 text-center font-bold text-gray-800 whitespace-nowrap">
                                  {deptText}
                                </td>
                                <td className="border border-gray-400 p-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                  {yearText}
                                </td>
                                <td className="border border-gray-400 p-2 text-center whitespace-nowrap font-bold">
                                  <span 
                                    className="inline-block px-1.5 py-0.5 rounded text-[10px]"
                                    style={{
                                      color: badge.printColor,
                                      backgroundColor: badge.printBg
                                    }}
                                  >
                                    {badge.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* PDF Footer inside container */}
                    <div className="mt-4 pt-3 border-t border-gray-300 flex items-center justify-between text-[11px] font-bold text-gray-600">
                      <span>जन-हित में पारदर्शिता एवं समग्र विकास रिपोर्ट कार्ड</span>
                      <span>कुल कार्य: {filteredWorks.length} | दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-6">
              <p className="text-sm font-bold text-gray-700 mb-1">{t('noWorksFound')}</p>
              <p className="text-xs text-gray-400">{t('noWorksFoundDesc')}</p>
            </div>
          )}

        </div>
      </div>

      {/* Hidden High-Definition Print Template for jsPDF Export (Matches Road Work Report Card PDF) */}
      <div 
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '1000px', zIndex: -10 }}
        aria-hidden="true"
      >
        <div 
          ref={pdfPrintRef} 
          className="bg-white p-8 text-black"
          style={{ width: '1000px', minHeight: '600px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}
        >
          {/* Document Header - Exact layout as user's road report card */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '900', color: '#dc2626' }}>
              {config?.branding?.leaderName || 'डॉ. आर. के. पटेल, विधायक, मड़ियाहूँ'}
            </h1>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#7c2d12' }}>
              {config?.tenant?.constituency || 'मड़ियाहूँ विधानसभा क्षेत्र, 370'}
            </h2>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '900', color: '#0f766e' }}>
              सड़क एवं संपर्क मार्ग विकास कार्य — रिपोर्ट कार्ड
            </h3>

            {/* Summary Counters Banner */}
            <div style={{ margin: '8px 0', fontSize: '16px', fontWeight: '900', color: '#dc2626' }}>
              {filteredWorks.length} विकास कार्यों का विवरण
            </div>
            <div style={{ margin: '4px 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
              <span style={{ color: '#15803d' }}>{statusStats.completed} कार्य पूर्ण</span>,{' '}
              <span style={{ color: '#1d4ed8' }}>{statusStats.inProgress} कार्य प्रगति पर</span>,{' '}
              <span style={{ color: '#7e22ce' }}>{statusStats.approved} कार्य स्वीकृत</span>,{' '}
              <span style={{ color: '#dc2626' }}>प्रस्तावित {statusStats.proposed}</span>
            </div>

            {/* Major Work Categories */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', margin: '8px auto', maxWidth: '800px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#b91c1c', marginBottom: '4px' }}>प्रमुख कार्य</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <span>🔹 सड़क का चौड़ीकरण एवं सुदृढ़ीकरण</span>
                <span>🔹 ग्रामीण क्षेत्रों नवीन पिच रोड एवं सी.सी. रोड निर्माण</span>
                <span>🔹 विशेष मरम्मत कार्य</span>
                <span>🔹 इंटरलॉकिंग कार्य</span>
              </div>
            </div>

            {/* Meta Information Bar (Blocks, Departments & Financial Years) */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', marginTop: '10px', fontSize: '11px', lineHeight: '1.6', color: '#334155' }}>
              <div><strong style={{ color: '#0891b2' }}>विकास खण्ड:</strong> रामपुर | रामनगर | मड़ियाहूँ</div>
              <div><strong style={{ color: '#0f172a' }}>विभाग:</strong> लोक निर्माण विभाग (PWD) | मंडी परिषद | आर.एस. त्वरित | आर.एस. राज्यांश | PMGSY</div>
              <div style={{ fontWeight: '800', color: '#c2410c' }}>
                वित्तीय वर्ष 2022–23 से 2026–27 तक के कार्यों का संकलित विवरण
              </div>
            </div>
          </div>

          {/* Applied Filter Info Banner if Area / Search applied */}
          {isAreaFilterActive && (
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px', padding: '6px 12px', marginBottom: '12px', fontSize: '11px', fontWeight: 'bold', color: '#92400e' }}>
              चयनित क्षेत्र फ़िल्टर: {[
                currentBlockNode?.name,
                currentPanchayatNode?.name,
                rawVillageOptions.find(v => String(v._id || v.id) === String(selectedVillageId))?.name
              ].filter(Boolean).join(' ➔ ')}
            </div>
          )}

          {/* Clean Printable Table - Exact 7 columns as road report card */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px', textAlign: 'left', border: '1.5px solid #64748b' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1.5px solid #64748b' }}>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 4px', width: '38px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>क्र0सं0</th>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 8px', fontWeight: '900', color: '#0f172a' }}>कार्य का नाम</th>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 6px', width: '90px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>प्रस्तावित लम्बाई</th>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 6px', width: '80px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>विकास खण्ड</th>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 6px', width: '85px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>विभाग</th>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 6px', width: '65px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>वित्तीय वर्ष</th>
                <th style={{ border: '1px solid #94a3b8', padding: '6px 6px', width: '95px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>कार्य की स्थिति</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorks.map((work, idx) => {
                const badge = getStatusBadge(work.status);
                const lengthText = getWorkLength(work);
                const blockText = getWorkBlock(work);
                const deptText = getWorkDepartment(work);
                const yearText = getWorkYear(work);

                return (
                  <tr 
                    key={work._id || idx} 
                    style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fcfcfd' }}
                  >
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 4px', textAlign: 'center', fontWeight: 'bold', color: '#475569' }}>
                      {idx + 1}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4' }}>
                      {work.title}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 6px', textAlign: 'center', fontWeight: 'bold', color: '#1e293b' }}>
                      {lengthText}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 6px', textAlign: 'center', color: '#1e293b' }}>
                      {blockText}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 6px', textAlign: 'center', fontWeight: 'bold', color: '#0f172a' }}>
                      {deptText}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 6px', textAlign: 'center', fontWeight: '600', color: '#334155' }}>
                      {yearText}
                    </td>
                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 6px', textAlign: 'center' }}>
                      <span 
                        style={{ 
                          display: 'inline-block',
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '9.5px', 
                          fontWeight: 'bold',
                          color: badge.printColor || '#1e293b', 
                          backgroundColor: badge.printBg || '#f1f5f9' 
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Document Footer */}
          <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
            <div>जन-सेवा एवं पारदर्शी विकास कार्यों का डिजिटल रिकॉर्ड</div>
            <div>पृष्ठ 1 | कुल कार्य: {filteredWorks.length}</div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

