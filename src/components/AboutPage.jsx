import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import BottomNav from './BottomNav';
import { FaStar } from 'react-icons/fa6';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';

export default function AboutPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, tenantConfig: contextTenantConfig } = useTenant();
  const [activeTab, setActiveTab] = useState('Overview');
  const [leader, setLeader] = useState(null);
  const [tenantConfig, setTenantConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSlug = api.getTenantSlug();
    if (!currentSlug) {
      setIsLoading(false);
      return;
    }

    const fetchLeader = async () => {
      try {
        setIsLoading(true);
        const [leaderRes, configRes] = await Promise.all([
          api.getAboutLeader().catch(() => null),
          api.getConfig().catch(() => null)
        ]);

        if (leaderRes) setLeader(leaderRes);
        if (configRes) setTenantConfig(configRes);
      } catch (err) {
        console.warn('Error fetching leader bio:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeader();
  }, []);

  const config = tenantConfig || contextTenantConfig;
  const leaderName = leader?.name || config?.branding?.leaderName || 'जन प्रतिनिधि';
  const designation = leader?.designation || 'Leader / Public Representative';
  const bio = leader?.bio || leader?.shortBio || config?.branding?.tagline || 'समर्पित जन सेवा, सर्वांगीण विकास और जन-कल्याण हमारा मुख्य उद्देश्य है।';
  const photoUrl = leader?.photoUrl || config?.branding?.leaderPhotoUrl || '/profile_avatar.jpg';

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden pb-[72px]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">
            About {leaderName}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        
        {/* Banner Section */}
        <div className="relative w-full aspect-[4/3] bg-gray-200 shrink-0 overflow-hidden sm:rounded-b-3xl">
          <img 
            src={leader?.bannerUrl || photoUrl} 
            alt={leaderName} 
            className="w-full h-full object-cover object-top" 
            onError={(e) => { e.target.src = '/profile_avatar.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
            <div className="text-white">
              <span 
                className="text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                {designation}
              </span>
              <h2 className="text-lg font-black mt-1 leading-tight">{leaderName}</h2>
            </div>
          </div>
        </div>

        <div className="px-5 py-6">
          
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 mb-6 rounded-xl">
            {['Overview', 'Journey', 'Vision'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-sm font-bold py-2 rounded-lg transition-all ${activeTab === tab ? 'text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                style={activeTab === tab ? { backgroundColor: primaryColor } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'Overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{leaderName}</h2>
              <p className="text-sm font-bold text-gray-500 mb-4">{designation}</p>

              <p className="text-sm text-gray-700 leading-relaxed font-medium mb-6">
                {bio}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-xl font-black" style={{ color: primaryColor }}>70+</span>
                  <span className="text-[0.65rem] font-bold text-gray-500 text-center uppercase tracking-wider mt-1">Awards</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-xl font-black" style={{ color: primaryColor }}>20+</span>
                  <span className="text-[0.65rem] font-bold text-gray-500 text-center uppercase tracking-wider mt-1">Years of Service</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-xl font-black" style={{ color: primaryColor }}>1</span>
                  <span className="text-[0.65rem] font-bold text-gray-500 text-center uppercase tracking-wider mt-1">Vision</span>
                  <span className="text-[0.6rem] font-semibold text-gray-400 text-center leading-none mt-0.5">Viksit Bharat</span>
                </div>
              </div>

              {/* Quote Block */}
              <div 
                className="rounded-2xl p-5 border mb-6 relative overflow-hidden"
                style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}25` }}
              >
                <p 
                  className="relative z-10 text-[0.95rem] font-extrabold italic leading-snug text-center"
                  style={{ color: primaryColor }}
                >
                  "Sabka Saath, Sabka Vikas,<br/>Sabka Vishwas, Sabka Prayas"
                </p>
              </div>

              {/* Dummy Extra Content for Scrolling */}
              <div className="space-y-4 pb-8">
                <h3 className="font-bold text-gray-900">Key Achievements</h3>
                {[
                  { title: "Digital Governance", desc: "Empowering every citizen with transparent technology services." },
                  { title: "Infrastructure & Roads", desc: "Transforming the constituency into a high-connectivity hub." },
                  { title: "Clean & Green Living", desc: "Sustainable cleanliness drives and public health parks for all." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Journey */}
          {activeTab === 'Journey' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">Political & Public Journey</h2>
              <p className="text-xs text-gray-500 font-semibold mb-6">Key milestones in lifetime dedication to the people</p>

              <div className="flex flex-col gap-6 relative pl-3">
                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                {(leader?.journey || [
                  { year: '2001', title: 'Grassroots Social Worker', desc: 'Started welfare drives for local farmers and rural children in constituency.' },
                  { year: '2012', title: 'Public Representative', desc: 'Led major community development and infrastructure projects across villages.' },
                  { year: '2019', title: 'Legislative Representative', desc: 'Championed citizen welfare programs, youth empowerment, and rural health.' },
                  { year: 'Present', title: `Serving People of ${config?.tenant?.name || 'Constituency'}`, desc: 'Spearheading smart clinics, transparent governance, and direct Jan Samasya redressal.' }
                ]).map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5 relative z-10">
                    <div 
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {i + 1}
                    </div>
                    <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-4 flex-1">
                      <span 
                        className="text-[0.65rem] font-extrabold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                      >
                        {item.year}
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900 mt-1">{item.title}</h4>
                      <p className="text-xs font-semibold text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Vision */}
          {activeTab === 'Vision' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">Vision & 5 Pillars</h2>
              <p className="text-xs text-gray-500 font-semibold mb-6">Building an empowered and prosperous constituency</p>

              <div className="grid grid-cols-1 gap-3.5">
                {[
                  { title: '1. Quality Education & Skill Training', desc: 'Smart schools and digital learning centers in every Gram Panchayat.' },
                  { title: '2. 24x7 Clean Drinking Water & Sanitation', desc: 'Piped water connection to every household with proper drainage systems.' },
                  { title: '3. Accessible Primary Healthcare', desc: 'Upgrading community health centers with free diagnostics and medicines.' },
                  { title: '4. Modern Road & Highway Network', desc: 'Pothole-free village roads and fast connectivity to main markets.' },
                  { title: '5. Transparent Digital Governance', desc: '100% resolution of public complaints within 48-72 hours via Jan Samasya portal.' }
                ].map((pillar, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      <FaStar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-tight">{pillar.title}</h4>
                      <p className="text-xs font-semibold text-gray-600 mt-1 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
