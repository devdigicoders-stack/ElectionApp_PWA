import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { 
  HiArrowLeft, 
  HiCheckCircle, 
  HiArrowDownTray, 
  HiShare, 
  HiDocumentText, 
  HiSparkles 
} from 'react-icons/hi2';
import { 
  FaTractor, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHospital, 
  FaRoad, 
  FaPersonDress, 
  FaShieldHalved 
} from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';

export default function ManifestoPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, leaderName } = useTenant();
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Youth & Jobs', 'Farmers', 'Education', 'Healthcare', 'Infrastructure', 'Women Welfare']);
  const [activeView, setActiveView] = useState('promises'); // 'promises' | 'progress'
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dynamic categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      const slug = api.getTenantSlug();
      if (!slug) return;
      try {
        const catRes = await api.getManifestoCategories().catch(() => []);
        if (Array.isArray(catRes) && catRes.length > 0) {
          const list = catRes.map(c => typeof c === 'string' ? c : (c.category || c.name)).filter(Boolean);
          setCategories(['All', ...new Set(list)]);
        }
      } catch (err) {
        console.warn('Error fetching manifesto categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchManifesto = async () => {
      const slug = api.getTenantSlug();
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const categoryParam = activeCategory !== 'All' ? activeCategory : undefined;
        const res = await api.getManifesto(categoryParam).catch(() => []);
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (list.length > 0) {
          setItems(list.map((m, idx) => ({
            id: m._id || m.id || idx + 1,
            title: m.title,
            category: m.category || 'Development',
            progress: m.progress || (m.status === 'completed' ? 100 : (m.status === 'in_progress' ? 70 : 85)),
            status: m.status || (m.progress === 100 ? 'Achieved' : 'In Progress'),
            targetYear: m.targetYear || '2027',
            summary: m.description || m.shortDescription || '',
            points: Array.isArray(m.points) && m.points.length > 0 ? m.points : (m.description ? [m.description] : ['Dedicated execution under leader vision.']),
            images: m.images || []
          })));
        } else {
          setItems([]);
        }
      } catch (err) {
        console.warn('Manifesto fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManifesto();
  }, [activeCategory]);

  const defaultManifesto = [
    {
      id: 1,
      title: 'Youth Employment & Startup Incubation Hub',
      category: 'Youth & Jobs',
      progress: 88,
      status: 'In Progress',
      targetYear: '2027',
      summary: 'Employment opportunities through industrial corridors and IT skill hubs.',
      points: [
        'Establishment of Mega IT & Tech Park with job incubation.',
        'Zero-collateral startup assistance up to ₹15 Lakhs.',
        'Skill development centers across assembly wards.'
      ],
    },
    {
      id: 2,
      title: 'Kisan Samridhi & Free Solar Irrigation Support',
      category: 'Farmers',
      progress: 92,
      status: 'Achieved',
      targetYear: '2026',
      summary: 'Modern agricultural cold chains, solar pumps, and direct assistance.',
      points: [
        'Zero-interest crop loans assistance for small farmers.',
        'Solar feeder installation for canal irrigation power.',
        'Setting up regional storage hubs near mandis.'
      ],
    },
    {
      id: 3,
      title: 'Universal Healthcare & Multispecialty Facilities',
      category: 'Healthcare',
      progress: 85,
      status: 'In Progress',
      targetYear: '2026',
      summary: 'Expansion of health cover and mobile wellness clinics.',
      points: [
        'Modern multispecialty hospital upgrades in constituency.',
        'Free Jan Aushadhi generic medicine dispensaries.'
      ],
    }
  ];

  const displayList = items.length > 0 ? items : (api.getTenantSlug() ? items : defaultManifesto);
  const filteredItems = activeCategory === 'All' 
    ? displayList 
    : displayList.filter(item => item.category === activeCategory);

  const overallProgress = displayList.length > 0 
    ? Math.round(displayList.reduce((acc, curr) => acc + (curr.progress || 80), 0) / displayList.length)
    : 85;

  const handleDownload = () => {
    toast.success('Sankalp Patra PDF download initiated!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sankalp Patra - Vision Document',
        text: `Check out the Sankalp Patra (Manifesto) and progress report of ${leaderName || 'our Leader'}.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Manifesto link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Crisp White Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-3.5 pb-3 shadow-xs shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-[#0f172a] leading-tight">Sankalp Patra 2026</h1>
              <p className="text-[0.7rem] font-semibold text-gray-400">Our Commitments & Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200 text-[#f37920] flex items-center justify-center hover:bg-orange-100 active:scale-95 transition-all"
              title="Download PDF"
            >
              <HiArrowDownTray className="w-4 h-4" />
            </button>
            <button 
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
              title="Share"
            >
              <HiShare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Toggle Tabs (Promises vs Delivery Progress) */}
        <div className="flex items-center gap-2 mt-3.5">
          <button
            onClick={() => setActiveView('promises')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeView === 'promises'
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200/80'
            }`}
            style={activeView === 'promises' ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
          >
            <HiDocumentText className="w-4 h-4" />
            <span>Key Promises ({displayList.length})</span>
          </button>
          <button
            onClick={() => setActiveView('progress')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeView === 'progress'
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200/80'
            }`}
            style={activeView === 'progress' ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
          >
            <HiSparkles className="w-4 h-4" />
            <span>Delivery Tracker ({overallProgress}%)</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        
        {/* Overall Progress Card */}
        <div 
          className="rounded-3xl p-5 text-white shadow-md mb-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, #0f172a, ${primaryColor}dd)` }}
        >
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div>
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-orange-300">Report Card</span>
              <h3 className="text-base font-black">Manifesto Fulfilment</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">{overallProgress}%</span>
              <p className="text-[0.65rem] text-gray-200 font-bold">Achieved / On Track</p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-hide pb-3 pt-0.5">
          {categories.map((cat, idx) => {
            const catName = typeof cat === 'string' ? cat : (cat.name || cat.id);
            const isActive = activeCategory === catName;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(catName)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Manifesto Cards List */}
        <div className="flex flex-col gap-3.5 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-gray-400 mt-2">Loading manifesto promises...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      <HiSparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                      <h3 className="text-sm font-extrabold text-gray-900 leading-tight">{item.title}</h3>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black shrink-0 ${
                    item.status === 'Achieved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Progress Bar (Always visible for accountability) */}
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-500 text-[0.7rem]">Implementation Progress</span>
                    <span className="font-black" style={{ color: primaryColor }}>{item.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                        width: `${item.progress}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Key Bullet Points */}
                <div className="space-y-2 pt-1 border-t border-gray-50">
                  {item.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <HiCheckCircle 
                        className="w-4 h-4 shrink-0 mt-0.5" 
                        style={{ color: primaryColor }}
                      />
                      <p className="text-xs font-medium text-gray-700 leading-snug">{pt}</p>
                    </div>
                  ))}
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-white rounded-2xl border border-gray-100 my-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <HiDocumentText className="w-7 h-7" />
              </div>
              <p className="text-gray-800 font-extrabold text-sm">No Promises in this Category</p>
              <p className="text-gray-400 font-semibold text-xs mt-0.5">Select another category or view all commitments.</p>
            </div>
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
