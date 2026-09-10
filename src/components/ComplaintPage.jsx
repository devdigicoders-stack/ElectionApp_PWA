import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { 
  HiArrowLeft, 
  HiPlus, 
  HiXMark, 
  HiCheck, 
  HiSparkles,
  HiClock,
  HiPhoto,
  HiMapPin,
  HiLightBulb,
  HiOutlineClipboardDocumentCheck
} from 'react-icons/hi2';
import { 
  FaDroplet, 
  FaRoad, 
  FaBoltLightning, 
  FaBroom, 
  FaLightbulb, 
  FaGraduationCap, 
  FaHospital, 
  FaClipboardList,
  FaPhoneVolume
} from 'react-icons/fa6';

export default function ComplaintPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { primaryColor, secondaryColor } = useTenant();

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'guidelines'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [urgency, setUrgency] = useState('Normal'); // 'Normal' | 'High' | 'Emergency'
  const [areasList, setAreasList] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  
  const [formData, setFormData] = useState({
    landmark: '',
    title: '',
    description: ''
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);

  // Helper function to resolve dynamic category icons and background colors
  const getCategoryTheme = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('water') || lower.includes('jal') || lower.includes('pipeline')) {
      return { icon: <FaDroplet className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50', nameHi: 'जल आपूर्ति' };
    }
    if (lower.includes('road') || lower.includes('pothole') || lower.includes('sadak') || lower.includes('infra')) {
      return { icon: <FaRoad className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50', nameHi: 'सड़क व निर्माण' };
    }
    if (lower.includes('elect') || lower.includes('light') || lower.includes('power') || lower.includes('bijli')) {
      return { icon: <FaBoltLightning className="w-5 h-5 text-yellow-500" />, bg: 'bg-yellow-50', nameHi: 'बिजली व लाइट' };
    }
    if (lower.includes('sanitat') || lower.includes('drain') || lower.includes('garbage') || lower.includes('safai')) {
      return { icon: <FaBroom className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', nameHi: 'सफाई व नाली' };
    }
    if (lower.includes('school') || lower.includes('educat') || lower.includes('shiksha')) {
      return { icon: <FaGraduationCap className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50', nameHi: 'शिक्षा व विद्यालय' };
    }
    if (lower.includes('health') || lower.includes('hospital') || lower.includes('swasthya') || lower.includes('clinic')) {
      return { icon: <FaHospital className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50', nameHi: 'स्वास्थ्य केंद्र' };
    }
    return { icon: <FaClipboardList className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-100', nameHi: 'अन्य समस्या' };
  };

  // Fetch areas and complaint categories dynamically from backend
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Area Tree
      try {
        const res = await api.getAreaTree().catch(() => null);
        let extractedAreas = [];
        if (res && res.tree && Array.isArray(res.tree)) {
          const flatten = (nodes) => {
            let result = [];
            nodes.forEach(node => {
              result.push({ _id: node._id, name: node.name, code: node.code });
              if (node.children && node.children.length > 0) {
                result = result.concat(flatten(node.children));
              }
            });
            return result;
          };
          extractedAreas = flatten(res.tree);
        } else if (Array.isArray(res)) {
          extractedAreas = res.map(a => ({ _id: a._id, name: a.name, code: a.code }));
        }

        if (extractedAreas.length > 0) {
          setAreasList(extractedAreas);
          setSelectedAreaId(extractedAreas[0]._id);
        }
      } catch (err) {
        console.warn('Could not load areas:', err);
      }

      // 2. Fetch Complaint Categories dynamically
      try {
        const catRes = await api.getComplaintCategories().catch(() => null);
        const catList = Array.isArray(catRes) ? catRes : (catRes?.data || []);
        if (catList.length > 0) {
          const mapped = catList.map(c => {
            const theme = getCategoryTheme(c.name || '');
            return {
              id: c.name,
              name: c.name,
              nameHi: theme.nameHi,
              description: c.description || '',
              icon: theme.icon,
              bg: theme.bg
            };
          });
          setCategories(mapped);
          setSelectedCategory(mapped[0].id);
        } else {
          // Fallback defaults
          const defaultList = [
            { id: 'Roads & Infrastructure', name: 'Roads & Potholes', nameHi: 'सड़क व गड्ढे', icon: <FaRoad className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
            { id: 'Electricity & Street Lights', name: 'Electricity / Light', nameHi: 'बिजली व लाइट', icon: <FaBoltLightning className="w-5 h-5 text-yellow-500" />, bg: 'bg-yellow-50' },
            { id: 'Water Supply & Pipelines', name: 'Water Supply', nameHi: 'जल आपूर्ति', icon: <FaDroplet className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
            { id: 'Sanitation & Garbage', name: 'Sanitation & Drains', nameHi: 'सफाई व नाली', icon: <FaBroom className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
            { id: 'Health & Hospitals', name: 'Health & Clinic', nameHi: 'स्वास्थ्य केंद्र', icon: <FaHospital className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50' },
            { id: 'Education & Schools', name: 'Schools & Education', nameHi: 'शिक्षा व स्कूल', icon: <FaGraduationCap className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50' },
            { id: 'Other / Miscellaneous', name: 'Other Grievances', nameHi: 'अन्य समस्या', icon: <FaClipboardList className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-100' },
          ];
          setCategories(defaultList);
          setSelectedCategory(defaultList[0].id);
        }
      } catch (catErr) {
        console.warn('Could not load complaint categories:', catErr);
      }
    };

    fetchData();
  }, []);

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }

    const newImageUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setImages((prev) => [...prev, ...newImageUrls]);
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.info('Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error('Please choose a complaint category');
      return;
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please enter problem title and description');
      return;
    }

    // Check auth
    const token = api.getToken();
    if (!token) {
      toast.info('Please log in to register your complaint');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload selected files if any
      let uploadedUrls = [];
      const filesToUpload = images.filter(img => img.file).map(img => img.file);
      if (filesToUpload.length > 0) {
        try {
          const uploadRes = await api.uploadFiles('complaints', filesToUpload);
          if (uploadRes && Array.isArray(uploadRes.urls)) {
            uploadedUrls = uploadRes.urls;
          }
        } catch (uploadErr) {
          console.warn('File upload warning, continuing with local paths:', uploadErr);
        }
      }

      // Priority mapping
      let priorityValue = 'medium';
      if (urgency.toLowerCase() === 'emergency' || urgency.toLowerCase() === 'urgent') {
        priorityValue = 'urgent';
      } else if (urgency.toLowerCase() === 'high') {
        priorityValue = 'high';
      } else if (urgency.toLowerCase() === 'normal' || urgency.toLowerCase() === 'low') {
        priorityValue = 'medium';
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() + (formData.landmark ? ` (Landmark: ${formData.landmark.trim()})` : ''),
        category: selectedCategory,
        areaId: selectedAreaId || undefined,
        priority: priorityValue,
        attachments: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      };

      // Call live Backend API
      await api.createComplaint(payload);
      toast.success('Complaint Ticket generated successfully!');
      setTimeout(() => {
        navigate('/my-complaints');
      }, 800);
    } catch (err) {
      console.error('Complaint submit error:', err);
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        toast.error('Please login first to submit a grievance ticket');
        navigate('/login');
        return;
      }
      toast.error(err.message || 'Failed to submit complaint. Please check fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">
            Jan Samasya
          </h1>
        </div>

        {/* View Switcher Tabs in Header */}
        <div className="flex bg-gray-100/90 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'new' ? 'text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
            style={activeTab === 'new' ? { backgroundColor: primaryColor } : {}}
          >
            New Form
          </button>
          <button 
            onClick={() => setActiveTab('guidelines')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'guidelines' ? 'text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
            style={activeTab === 'guidelines' ? { backgroundColor: primaryColor } : {}}
          >
            Process & SLA
          </button>
        </div>
      </div>

      {/* Auto-Slide Carousel Container */}
      <div className="flex-1 w-full overflow-hidden relative">
        <div 
          className="flex h-full w-[200%] transition-transform duration-500 ease-in-out"
          style={{ transform: activeTab === 'new' ? 'translateX(0%)' : 'translateX(-50%)' }}
        >
          
          {/* Slide 1: New Complaint Form */}
          <div className="w-1/2 h-full overflow-y-auto">
            <div className="p-4 pb-28 flex flex-col gap-5 max-w-lg mx-auto">
              
              {/* Step 1: Category Selection Grid */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      1
                    </span>
                    <h2 className="text-sm font-black text-gray-900">Select Category</h2>
                  </div>
                  <span className="text-[0.65rem] font-bold text-red-500">* Required</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                          isSelected 
                            ? 'shadow-sm scale-[1.02]' 
                            : 'border-gray-100 bg-gray-50/70 hover:bg-gray-100 hover:border-gray-200'
                        }`}
                        style={isSelected ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10` } : {}}
                      >
                        {isSelected && (
                          <div 
                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <HiCheck className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-all ${cat.bg} shadow-xs`}>
                          {cat.icon}
                        </div>
                        <span 
                          className="text-xs font-bold leading-tight"
                          style={isSelected ? { color: primaryColor } : { color: '#1f2937' }}
                        >
                          {cat.name}
                        </span>
                        {cat.nameHi && (
                          <span className="text-[0.62rem] font-medium text-gray-400 mt-0.5">
                            {cat.nameHi}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Location & Urgency */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span 
                    className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    2
                  </span>
                  <h2 className="text-sm font-black text-gray-900">Area & Urgency</h2>
                </div>

                {/* Area Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <HiMapPin className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Constituency / Zone</span>
                  </label>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => setSelectedAreaId(e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-800 outline-none"
                    style={{ outlineColor: primaryColor }}
                  >
                    {areasList.length > 0 ? (
                      areasList.map(a => (
                        <option key={a._id} value={a._id}>
                          {a.name} {a.code ? `(${a.code})` : ''}
                        </option>
                      ))
                    ) : (
                      <option value="">Constituency / Area</option>
                    )}
                  </select>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Specific Location / Landmark (वार्ड / मोहल्ला)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Shiv Mandir, Gali No. 4, Sigra"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-semibold text-gray-800 outline-none"
                    style={{ outlineColor: primaryColor }}
                  />
                </div>

                {/* Urgency Level Tabs */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Priority / Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'Normal', label: 'Normal (48h)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                      { key: 'High', label: 'High (24h)', color: 'bg-amber-50 text-amber-700 border-amber-300' },
                      { key: 'Emergency', label: 'Urgent (12h)', color: 'bg-rose-50 text-rose-700 border-rose-300' }
                    ].map((lvl) => (
                      <button
                        key={lvl.key}
                        type="button"
                        onClick={() => setUrgency(lvl.key)}
                        className={`py-2 px-1 rounded-xl text-[0.7rem] font-extrabold border transition-all ${
                          urgency === lvl.key 
                            ? `${lvl.color} shadow-sm ring-2` 
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                        style={urgency === lvl.key ? { ringColor: primaryColor } : {}}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Complaint Subject & Details */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span 
                    className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    3
                  </span>
                  <h2 className="text-sm font-black text-gray-900">Complaint Details</h2>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Subject / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main road drainage overflow issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-semibold text-gray-800 outline-none"
                    style={{ outlineColor: primaryColor }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Problem Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Samasya ka pura vivaran likhein (Since when is this issue happening, who is affected)..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-800 outline-none resize-none"
                    style={{ outlineColor: primaryColor }}
                  ></textarea>
                </div>

                {/* Attach Photos / Evidence */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <HiPhoto className="w-4 h-4" style={{ color: primaryColor }} />
                      <span>Attach Photos ({images.length}/5)</span>
                    </label>
                    <span className="text-[0.65rem] text-gray-400 font-semibold">Geo-tagged photos resolve faster</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImagePick}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="w-20 h-20 shrink-0 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
                        style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}50`, color: primaryColor }}
                      >
                        <HiPlus className="w-5 h-5 stroke-[2.5]" />
                        <span className="text-[0.65rem] font-bold">Add Photo</span>
                      </button>
                    )}

                    {images.map((item, idx) => (
                      <div key={idx} className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden relative border border-gray-200 bg-gray-100">
                        <img src={item.url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm"
                        >
                          <HiXMark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Submit Form Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-4 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl active:scale-[0.98] transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <HiSparkles className="w-5 h-5" />
                <span>Generate Ticket & Submit</span>
              </button>

            </div>
          </div>

          {/* Slide 2: Guidelines & SLA Tab */}
          <div className="w-1/2 h-full overflow-y-auto">
            <div className="p-4 pb-20 flex flex-col gap-4 max-w-lg mx-auto">
              
              {/* SLA Banner */}
              <div 
                className="rounded-3xl p-5 text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <HiClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Guaranteed Redressal Timeline</h3>
                    <p className="text-xs text-white/90">Every ticket is tracked with strict SLAs</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
                  <div className="bg-white/10 rounded-xl p-2">
                    <p className="text-lg font-black">12h</p>
                    <p className="text-[0.65rem] font-bold text-white/90">Urgent Issues</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2">
                    <p className="text-lg font-black">24-48h</p>
                    <p className="text-[0.65rem] font-bold text-white/90">Normal Works</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2">
                    <p className="text-lg font-black">100%</p>
                    <p className="text-[0.65rem] font-bold text-white/90">Digital Track</p>
                  </div>
                </div>
              </div>

              {/* 5-Step Process */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                  <HiOutlineClipboardDocumentCheck className="w-5 h-5" style={{ color: primaryColor }} />
                  <span>How Your Complaint Is Resolved</span>
                </h3>

                <div className="space-y-4 relative pl-3">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                  {[
                    { step: 1, title: 'Ticket Generated', desc: 'Unique CMP tracking ID assigned with timestamp' },
                    { step: 2, title: 'Ward Officer Review', desc: 'Central leader team reviews priority and jurisdiction' },
                    { step: 3, title: 'Field Team Dispatched', desc: 'Department engineer assigned on site with deadline' },
                    { step: 4, title: 'Work Execution & Proof', desc: 'Resolution work conducted with on-site completion photos' },
                    { step: 5, title: 'Citizen Verification', desc: 'Citizen rates satisfaction or can reopen if unsatisfied' }
                  ].map((st) => (
                    <div key={st.step} className="flex items-start gap-3.5 relative z-10">
                      <div 
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {st.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">{st.title}</h4>
                        <p className="text-[0.7rem] font-medium text-gray-500 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Helpline Cards */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <FaPhoneVolume className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">Direct Helpline Assistance</h4>
                    <p className="text-[0.7rem] text-gray-400 font-medium">Toll Free: 1800-111-2222</p>
                  </div>
                </div>
                <a
                  href="tel:18001112222"
                  className="px-3.5 py-1.5 text-white rounded-xl text-xs font-bold shadow-md active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Call
                </a>
              </div>

              <button
                onClick={() => setActiveTab('new')}
                className="w-full py-3.5 bg-gray-900 text-white font-black text-xs rounded-2xl active:scale-95 transition-all mt-1"
              >
                Start Filing Complaint →
              </button>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
