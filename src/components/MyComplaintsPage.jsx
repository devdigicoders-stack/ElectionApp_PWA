import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { getMediaUrl } from '../utils/mediaUrl';
import { 
  HiFolderOpen, 
  HiXMark, 
  HiCheck, 
  HiBolt, 
  HiStar, 
  HiArrowLeft, 
  HiPlus, 
  HiArrowRight 
} from 'react-icons/hi2';
import { FaStar } from 'react-icons/fa6';

export default function MyComplaintsPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [activeTab, setActiveTab] = useState('All');
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const tabs = ['All', 'Pending', 'In Progress', 'Resolved'];

  const stages = [
    { key: 'Submitted', label: 'Submitted', desc: 'Complaint registered by citizen' },
    { key: 'Under Review', label: 'Under Review', desc: 'Admin checking priority' },
    { key: 'Assigned', label: 'Assigned', desc: 'Assigned to Ward Officer' },
    { key: 'In Progress', label: 'In Progress', desc: 'Work execution on site' },
    { key: 'Resolved', label: 'Resolved', desc: 'Resolution verified & completed' }
  ];

  const tabRefs = useRef({});

  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = api.getToken();
      if (!token) {
        setIsUnauthorized(true);
        setIsLoading(false);
        // Load local offline complaints if any
        const localComplaints = storage.getUser()?.pwa_complaints || [];
        if (localComplaints.length > 0) {
          setComplaints(localComplaints);
        }
        return;
      }

      try {
        setIsLoading(true);
        setIsUnauthorized(false);
        const res = await api.getMyComplaints();
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (list.length > 0) {
          const formatted = list.map(c => {
            const rawImages = (Array.isArray(c.attachments) && c.attachments.length > 0)
              ? c.attachments
              : ((Array.isArray(c.mediaUrls) && c.mediaUrls.length > 0) ? c.mediaUrls : (c.images || []));
            
            const resolvedImages = rawImages.map(img => getMediaUrl(img));

            return {
              id: c.complaintNumber || c._id || `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
              _id: c._id,
              title: c.title,
              category: c.category,
              area: c.areaId?.name || c.landmark || 'Constituency',
              landmark: c.landmark || '',
              urgency: c.priority || 'Normal',
              description: c.description,
              status: c.status === 'resolved' || c.status === 'closed' ? 'Resolved' : (c.status === 'in_progress' ? 'In Progress' : 'Pending'),
              date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
              images: resolvedImages,
              timeline: c.timeline || []
            };
          });
          setComplaints(formatted);
        } else {
          setComplaints([]);
        }
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('unauthorized')) {
          setIsUnauthorized(true);
        }
        console.warn('Error fetching complaints:', err);
        setComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStageIndex = (status) => {
    if (status === 'Resolved') return 4;
    if (status === 'In Progress') return 3;
    if (status === 'Assigned') return 2;
    if (status === 'Under Review') return 1;
    return 0;
  };

  const handleReopen = (complaintId) => {
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'In Progress' };
      }
      return c;
    });
    setComplaints(updated);
    storage.setUser({ ...storage.getUser(), pwa_complaints: updated });
    toast.info('Complaint has been reopened for review!');
    setSelectedComplaint(prev => prev ? { ...prev, status: 'In Progress' } : null);
  };

  const handleRatingSubmit = () => {
    toast.success(`Thank you for rating ${rating} stars! Feedback recorded.`);
    setShowFeedbackModal(false);
    setFeedback('');
  };

  const activeTabIndex = tabs.indexOf(activeTab);

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">
            Jan Samasya / Complaints
          </h1>
        </div>

        <button 
          onClick={() => navigate('/complaint')} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <HiPlus className="w-4 h-4 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white px-4 py-2 border-b border-gray-100 shrink-0 z-10">
        <div 
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-hide py-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map(tab => {
            const count = tab === 'All' ? complaints.length : complaints.filter(c => c.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button 
                key={tab}
                ref={el => (tabRefs.current[tab] = el)}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isActive 
                    ? 'text-white shadow-xs' 
                    : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200/80'
                }`}
                style={isActive ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto-Slide Tab Content Container */}
      <div className="flex-1 w-full overflow-hidden relative">
        <div 
          className="flex h-full w-[400%] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeTabIndex * 25}%)` }}
        >
          {tabs.map((tab) => {
            const list = tab === 'All' ? complaints : complaints.filter(c => c.status === tab);
            return (
              <div key={tab} className="w-1/4 h-full overflow-y-auto p-4">
                <div className="flex flex-col gap-3 pb-4">
                  {isLoading ? (
                    <LoadingSpinner message="शिकायतें लोड हो रही हैं..." />
                  ) : list.length > 0 ? (
                    list.map(complaint => (
                      <div 
                        key={complaint.id} 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3.5 items-center relative active:scale-[0.98] transition-transform cursor-pointer hover:border-gray-300"
                      >
                        <div 
                          className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border flex items-center justify-center relative shadow-xs"
                          style={{ 
                            backgroundColor: `${primaryColor}12`, 
                            borderColor: `${primaryColor}25` 
                          }}
                        >
                          {Array.isArray(complaint.images) && complaint.images.length > 0 && complaint.images[0] ? (
                            <img 
                              src={complaint.images[0]} 
                              alt={complaint.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <HiFolderOpen 
                              className="w-7 h-7" 
                              style={{ color: primaryColor }} 
                            />
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[0.65rem] font-extrabold text-gray-400">{complaint.id}</span>
                            <span className="text-[0.65rem] font-semibold text-gray-400">{complaint.date}</span>
                          </div>
                          <h3 className="text-sm font-extrabold text-gray-900 leading-tight truncate mb-1">{complaint.title}</h3>
                          <p className="text-[0.7rem] text-gray-500 line-clamp-1 mb-2">{complaint.description || complaint.category}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wider border ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                            <span className="text-[0.7rem] font-bold ml-auto flex items-center gap-1" style={{ color: primaryColor }}>
                              <span>View Timeline</span>
                              <HiArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 text-center p-6 bg-white rounded-2xl border border-gray-100 my-4">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                      >
                        <HiFolderOpen className="w-7 h-7" />
                      </div>
                      <p className="text-gray-800 font-extrabold text-sm">
                        {isUnauthorized ? 'Login to View Your Complaints' : `No ${tab !== 'All' ? tab : ''} Complaints Found`}
                      </p>
                      <p className="text-gray-400 font-semibold text-xs mt-0.5 max-w-xs mb-3">
                        {isUnauthorized 
                          ? 'Please login with your mobile number to track registered grievances and status updates in real-time.' 
                          : 'Submit your issues or queries anytime'}
                      </p>
                      {isUnauthorized ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="px-5 py-2 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Login Now
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/complaint')}
                          className="px-4 py-2 bg-gray-100 text-gray-800 font-extrabold text-xs rounded-xl active:scale-95 transition-all"
                        >
                          File New Complaint
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (Apply / File Complaint) */}
      <button
        onClick={() => navigate('/complaint')}
        className="fixed bottom-24 right-5 z-40 text-white px-4 py-3.5 rounded-full shadow-lg flex items-center gap-2 font-extrabold text-xs active:scale-95 transition-all"
        style={{ backgroundColor: primaryColor }}
      >
        <HiPlus className="w-4 h-4 stroke-[2.5]" />
        <span>File Complaint</span>
      </button>

      {/* Complaint Detail & Status Timeline Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <span className="text-[0.7rem] font-extrabold text-gray-400">{selectedComplaint.id}</span>
                <h3 className="text-base font-extrabold text-gray-900 leading-snug">{selectedComplaint.title}</h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto flex flex-col gap-5">
              
              {/* Image & Details */}
              <div 
                className="flex flex-col gap-3 border p-3.5 rounded-2xl"
                style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}20` }}
              >
                <div className="flex gap-3 items-center">
                  <div 
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-white flex items-center justify-center shadow-xs"
                    style={{ borderColor: `${primaryColor}30` }}
                  >
                    {Array.isArray(selectedComplaint.images) && selectedComplaint.images.length > 0 && selectedComplaint.images[0] ? (
                      <img 
                        src={selectedComplaint.images[0]} 
                        alt="Complaint" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <HiFolderOpen className="w-8 h-8" style={{ color: primaryColor }} />
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-[0.7rem] font-bold" style={{ color: primaryColor }}>Category: {selectedComplaint.category || 'General'}</span>
                    <p className="text-xs font-semibold text-gray-700 mt-1 line-clamp-2">{selectedComplaint.description}</p>
                    <span className="text-[0.65rem] text-gray-400 mt-1">Area: {selectedComplaint.area || 'Constituency'}</span>
                  </div>
                </div>

                {/* Additional Attached Photos Carousel / Row if multiple */}
                {Array.isArray(selectedComplaint.images) && selectedComplaint.images.length > 1 && (
                  <div className="pt-2 border-t border-gray-200/50">
                    <span className="text-[0.65rem] font-extrabold text-gray-500 mb-1.5 block">Attached Evidence ({selectedComplaint.images.length})</span>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {selectedComplaint.images.map((imgUrl, i) => (
                        <a key={i} href={imgUrl} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-white block">
                          <img 
                            src={imgUrl} 
                            alt={`Proof ${i+1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/health_center.jpg';
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Timeline Stepper */}
              <div>
                <h4 className="text-sm font-extrabold text-gray-900 mb-4">Resolution Progress Timeline</h4>
                <div className="flex flex-col gap-4 relative pl-3">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                  {stages.map((stg, idx) => {
                    const currentStageIdx = getStageIndex(selectedComplaint.status);
                    const isPassed = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div key={stg.key} className="flex items-start gap-3.5 relative z-10">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${isPassed ? 'text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}
                          style={isPassed ? { backgroundColor: primaryColor } : {}}
                        >
                          {isPassed ? <HiCheck className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex flex-col pt-0.5">
                          <span 
                            className={`text-xs font-extrabold ${isPassed && !isCurrent ? 'text-gray-900' : !isPassed ? 'text-gray-400' : ''}`}
                            style={isCurrent ? { color: primaryColor } : {}}
                          >
                            {stg.label}
                          </span>
                          <span className="text-[0.7rem] font-semibold text-gray-500 leading-tight mt-0.5">
                            {stg.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons for Resolved vs Active */}
              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                {selectedComplaint.status === 'Resolved' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowFeedbackModal(true)}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <HiStar className="w-4 h-4" />
                      <span>Rate & Review</span>
                    </button>
                    <button 
                      onClick={() => handleReopen(selectedComplaint.id)}
                      className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 active:scale-95 transition-all"
                    >
                      Reopen Issue
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      toast.success('Representative office notified for priority attention!');
                    }}
                    className="w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <HiBolt className="w-4 h-4" />
                    <span>Send Reminder / Follow-up</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Feedback & Star Rating Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-scale-up">
            <h3 className="text-base font-extrabold text-gray-900 text-center mb-1">Rate Resolution</h3>
            <p className="text-xs text-gray-500 font-semibold text-center mb-4">How satisfied are you with the quick response?</p>
            
            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4 text-2xl">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setRating(star)}
                  className={`transition-transform hover:scale-125 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                >
                  <FaStar className="w-6 h-6" />
                </button>
              ))}
            </div>

            <textarea 
              rows="3"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Write a short feedback comment (optional)..."
              className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:ring-1 mb-4"
              style={{ outlineColor: primaryColor }}
            />

            <div className="flex gap-2">
              <button onClick={() => setShowFeedbackModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button 
                onClick={handleRatingSubmit} 
                className="flex-1 py-2.5 text-white rounded-xl text-xs font-bold shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
