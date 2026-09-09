import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ComplaintPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    category: '',
    area: '',
    title: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Complaint submitted successfully!');
    setTimeout(() => {
      navigate('/my-complaints');
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white border-b border-gray-100 z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-[#1e293b] ml-2 tracking-wide">Jan Samasya</h1>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-5 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">Select Category <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] appearance-none"
              >
                <option value="">Select category</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Road Maintenance">Road Maintenance</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">Select Area</label>
            <div className="relative">
              <select 
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
                className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] appearance-none"
              >
                <option value="">Select area</option>
                <option value="North Zone">North Zone</option>
                <option value="South Zone">South Zone</option>
                <option value="East Zone">East Zone</option>
                <option value="West Zone">West Zone</option>
                <option value="Central">Central</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">Complaint Title <span className="text-red-500">*</span></label>
            <input 
              type="text"
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">Description <span className="text-red-500">*</span></label>
            <textarea 
              placeholder="Enter details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full h-32 bg-white border border-gray-200 rounded-xl p-4 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] resize-none"
            ></textarea>
          </div>

          {/* Upload Photos */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-bold text-gray-800 flex items-center justify-between">
              Upload Photos <span className="text-xs text-gray-400 font-semibold">(Max 5)</span>
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button type="button" className="w-24 h-24 shrink-0 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-[#f37920] hover:bg-orange-50/30 transition-all text-gray-400 hover:text-[#f37920]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-bold">Add</span>
              </button>
              
              {/* Mock Uploaded Photos */}
              <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden relative border border-gray-200">
                <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=200" alt="Upload" className="w-full h-full object-cover" />
                <button type="button" className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 pb-8">
            <button
              type="submit"
              className="w-full h-14 bg-[#f37920] hover:bg-[#e25d14] text-white font-bold text-lg rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center active:scale-[0.98]"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
