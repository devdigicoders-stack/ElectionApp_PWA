import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';

export default function WorkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [activeTab, setActiveTab] = useState('Details');
  const [work, setWork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setIsLoading(true);
        const data = await api.getWorkById(id).catch(() => null);
        if (data) {
          setWork(data);
        } else {
          // Fallback fetch all to find match
          const list = await api.getWorks().catch(() => []);
          const worksList = Array.isArray(list) ? list : (list?.data || []);
          const found = worksList.find(w => (w._id || w.id) === id);
          setWork(found || null);
        }
      } catch (err) {
        console.warn('Error fetching work details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchWork();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: work?.title || 'Development Work',
        text: `Check out: ${work?.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div 
          className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
        ></div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Work record not found</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 text-white rounded-xl text-xs font-bold"
          style={{ backgroundColor: primaryColor }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const isCompleted = String(work.status || '').toLowerCase().includes('complete');
  const statusColor = isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden pb-24">
      
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
            {work.title}
          </h1>
        </div>
        <button onClick={handleShare} className="text-gray-500 p-2 hover:opacity-80 active:scale-95 transition-all" style={{ color: primaryColor }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar p-5">
        
        {/* Main Image */}
        <div className="relative w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-5 shadow-sm">
          <img 
            src={work.coverImageUrl || work.imageUrl || work.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600'} 
            alt={work.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${statusColor}`}>
              {work.status || 'In Progress'}
            </span>
          </div>
        </div>

        {/* Title and Category */}
        <div className="mb-4">
          <span 
            className="text-[0.68rem] font-bold uppercase tracking-wider block mb-1"
            style={{ color: primaryColor }}
          >
            {work.category || 'Development Work'}
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 leading-snug">
            {work.title}
          </h2>
        </div>

        {/* Location & Dates */}
        <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <svg className="w-4 h-4 shrink-0" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{work.location || work.area?.name || 'Local Area'}</span>
          </div>
          {work.startDate && (
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <svg className="w-4 h-4 shrink-0" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Started: {new Date(work.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {['Details', 'Gallery', 'Before/After'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-[0.8rem] sm:text-sm font-bold py-2 px-1 rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
              style={activeTab === tab ? { color: primaryColor } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Details */}
        {activeTab === 'Details' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900">Project Overview</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              {work.description || work.shortDescription || 'Development work is being actively monitored for high quality completion.'}
            </p>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-500">Category</span>
                <span className="font-bold text-gray-800">{work.category || 'Infrastructure'}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-500">Beneficiary Area</span>
                <span className="font-bold text-gray-800">{work.location || work.area?.name || 'Constituency'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Gallery */}
        {activeTab === 'Gallery' && (
          <div className="grid grid-cols-2 gap-2.5">
            {(work.images && work.images.length > 0 ? work.images : [work.coverImageUrl || work.image]).filter(Boolean).map((imgUrl, i) => (
              <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={imgUrl} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Before / After */}
        {activeTab === 'Before/After' && (
          <div className="flex flex-col gap-4">
            {work.beforeImageUrl ? (
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-3 py-1.5 text-[0.68rem] font-bold text-gray-700">Before Work</div>
                <img src={work.beforeImageUrl} alt="Before" className="w-full aspect-video object-cover" />
              </div>
            ) : null}
            {work.afterImageUrl ? (
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <div className="bg-green-100 px-3 py-1.5 text-[0.68rem] font-bold text-green-800">After Completion</div>
                <img src={work.afterImageUrl} alt="After" className="w-full aspect-video object-cover" />
              </div>
            ) : null}
            {!work.beforeImageUrl && !work.afterImageUrl && (
              <div className="py-8 text-center text-xs text-gray-400 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                Before / After photo verification will be posted soon.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Share Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe z-30 shadow-md flex gap-3">
        <button 
          onClick={handleShare} 
          className="flex-1 text-white rounded-2xl font-bold text-sm py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share Progress</span>
        </button>
      </div>

    </div>
  );
}
