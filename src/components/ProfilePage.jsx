import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    dob: '',
    gender: '',
    area: '',
    role: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-20">
        <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="ml-1">
          <h1 className="text-xl font-extrabold text-[#1e293b] leading-tight">Edit Profile</h1>
          <p className="text-xs font-semibold text-gray-400">Update your personal information</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6 pb-6 overflow-y-auto">
        
        {/* Upload Photo */}
        <div className="flex flex-col items-center mb-8 shrink-0">
          <label className="flex flex-col items-center cursor-pointer">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2 shadow-inner overflow-hidden relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <span className="text-xs font-bold text-gray-700">Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* Form Fields */}
        <form className="flex-1 flex flex-col gap-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm font-semibold">
                +91
              </span>
              <input
                type="tel"
                name="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                className="w-full h-12 px-4 border border-gray-200 rounded-r-xl bg-white outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Date of Birth</label>
            <div className="relative w-full">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all appearance-none"
                style={{ color: formData.dob ? '#1f2937' : '#9ca3af' }}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Gender</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#f37920] border-gray-300 focus:ring-[#f37920] accent-[#f37920]"
                />
                <span className="text-sm font-semibold text-gray-800">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#f37920] border-gray-300 focus:ring-[#f37920] accent-[#f37920]"
                />
                <span className="text-sm font-semibold text-gray-800">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#f37920] border-gray-300 focus:ring-[#f37920] accent-[#f37920]"
                />
                <span className="text-sm font-semibold text-gray-800">Other</span>
              </label>
            </div>
          </div>

          {/* Select Your Area */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Your Area</label>
            <div className="relative w-full">
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all appearance-none"
                style={{ color: formData.area ? '#1f2937' : '#9ca3af' }}
              >
                <option value="" disabled hidden>Select State/Area</option>
                <option value="Delhi" className="text-gray-800">Delhi</option>
                <option value="Maharashtra" className="text-gray-800">Maharashtra</option>
                <option value="Uttar Pradesh" className="text-gray-800">Uttar Pradesh</option>
                <option value="Gujarat" className="text-gray-800">Gujarat</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Select Role */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Role / Designation</label>
            <div className="relative w-full">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all appearance-none"
                style={{ color: formData.role ? '#1f2937' : '#9ca3af' }}
              >
                <option value="" disabled hidden>Select your role</option>
                <option value="Supporter" className="text-gray-800">Supporter</option>
                <option value="Volunteer" className="text-gray-800">Volunteer</option>
                <option value="Party Worker" className="text-gray-800">Party Worker</option>
                <option value="Leader" className="text-gray-800">Local Leader</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

        </form>
        
        {/* Save Button */}
        <div className="mt-8 shrink-0 pb-4">
          <button
            onClick={() => navigate('/my-profile')}
            className="w-full h-14 bg-[#f37920] hover:bg-[#e25d14] text-white font-bold text-lg rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
