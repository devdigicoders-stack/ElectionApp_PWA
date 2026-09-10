import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';
import UserAvatar from './UserAvatar';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { 
  HiShare, 
  HiArrowDownTray, 
  HiQrCode, 
  HiCheckBadge, 
  HiSparkles,
  HiUserPlus,
  HiArrowLeft,
  HiCheck, 
  HiStar 
} from 'react-icons/hi2';

export default function MembershipPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, leaderName } = useTenant();
  const [activeView, setActiveView] = useState('card'); // 'card' | 'form'
  const [userProfile, setUserProfile] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tenantConfig, setTenantConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    voterId: '',
    address: ''
  });

  useEffect(() => {
    const user = storage.getUser() || {};
    setUserProfile(user);

    const loadMembership = async () => {
      try {
        // Fetch tenant config and official membership card
        const [cardRes, memRes, configRes] = await Promise.allSettled([
          api.getMyMembershipCard(),
          api.getMyMembership(),
          api.getConfig()
        ]);

        if (configRes.status === 'fulfilled' && configRes.value) {
          setTenantConfig(configRes.value);
        }

        const cardData = cardRes.status === 'fulfilled' ? cardRes.value : null;

        if (cardData && (cardData.membershipNumber || cardData.membership)) {
          const m = cardData.membership || cardData;
          setMembershipData({
            id: m.membershipNumber || cardData.membershipNumber || `MEM-${Math.floor(100000 + Math.random() * 900000)}`,
            name: m.user?.name || user.name || 'Citizen Member',
            phone: m.user?.mobile || user.mobile || '',
            designation: m.designation || 'सक्रिय सदस्य (Active Member)',
            district: user.district || '',
            assembly: user.assembly || '',
            joinedDate: m.approvedAt ? new Date(m.approvedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
            validThru: m.expiresAt ? new Date(m.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Lifetime',
            status: m.status === 'approved' ? 'Active' : (m.status || 'Active'),
            cardUrl: m.cardUrl || cardData.cardUrl,
            verificationUrl: m.verificationUrl || cardData.verificationUrl
          });
        } else if (user?.membership) {
          const m = user.membership;
          setMembershipData({
            id: m.membershipNumber || 'DEMO-000001',
            name: user.name || 'Citizen Member',
            phone: user.mobile || '',
            designation: m.designation || 'मंडल अध्यक्ष (Block President)',
            district: user.district || 'Varanasi',
            assembly: user.assembly || 'UP',
            joinedDate: m.approvedAt ? new Date(m.approvedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '09 Sep 2026',
            validThru: 'Lifetime',
            status: m.status === 'approved' ? 'Active' : (m.status || 'Active'),
            cardUrl: m.cardUrl
          });
        }
      } catch (err) {
        console.warn('Membership fetch error:', err);
      }
    };

    loadMembership();

    setFormData({
      name: user.name || '',
      phone: user.mobile || '',
      voterId: user.customFields?.voter_id || user.voter_id || '',
      address: user.district ? `${user.village || ''}, ${user.ward || ''}, ${user.district}` : ''
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Name and Phone are required');
      return;
    }

    const newMember = {
      ...formData,
      id: `MEM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      district: userProfile?.district || 'Local',
      assembly: userProfile?.vidhanSabha || userProfile?.assembly || 'Constituency',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      validThru: '31 Dec 2030',
      status: 'Active',
      appliedAt: new Date().toISOString()
    };

    storage.addMembership(newMember);
    setMembershipData(newMember);
    toast.success('Membership Card Generated Successfully!');
    setActiveView('card');
  };

  const handleShareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: `${leaderName} Digital Membership Card`,
        text: `I am an active member! Member ID: ${membershipData?.id}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      toast.info(`Card ID Copied: ${membershipData?.id}`);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">
            Party Membership
          </h1>
        </div>

        {/* View Switcher */}
        <div className="flex bg-gray-100/90 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setActiveView('card')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeView === 'card' ? 'text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
            style={{ backgroundColor: activeView === 'card' ? primaryColor : undefined }}
          >
            My Card
          </button>
          <button 
            onClick={() => setActiveView('form')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeView === 'form' ? 'text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
            style={{ backgroundColor: activeView === 'form' ? primaryColor : undefined }}
          >
            New Form
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-4">
        
        {activeView === 'card' && membershipData ? (
          <div className="flex flex-col gap-5 max-w-md mx-auto">
            
            {/* Digital Identity Card (Themed) */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] text-white border border-slate-700 p-6 flex flex-col justify-between aspect-[1.58/1]">
              
              {/* Background watermark / art */}
              <div 
                className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-25"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div 
                className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-25"
                style={{ backgroundColor: secondaryColor }}
              ></div>

              {/* Card Top */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={tenantConfig?.branding?.logoUrl || "/image copy 3.png"} 
                    alt="Logo" 
                    className="w-10 h-10 object-contain drop-shadow" 
                    onError={(e) => { e.target.src = '/image copy 3.png'; }}
                  />
                  <div>
                    <h3 
                      className="text-sm font-black tracking-wider leading-none uppercase"
                      style={{ color: primaryColor }}
                    >
                      {tenantConfig?.branding?.leaderName || tenantConfig?.tenant?.name || leaderName || 'JAN SAMPARK'}
                    </h3>
                    <p className="text-[0.6rem] font-bold text-gray-300 tracking-widest mt-0.5">
                      {tenantConfig?.branding?.tagline || 'OFFICIAL MEMBERSHIP CARD'}
                    </p>
                  </div>
                </div>
                <span 
                  className="px-2 py-0.5 rounded-full text-[0.6rem] font-extrabold border"
                  style={{ 
                    backgroundColor: `${secondaryColor}25`, 
                    color: secondaryColor,
                    borderColor: `${secondaryColor}50` 
                  }}
                >
                  {membershipData.status || 'Active'}
                </span>
              </div>

              {/* Card Middle: Photo + Details */}
              <div className="flex items-center gap-4 my-2 relative z-10">
                <div 
                  className="w-16 h-16 rounded-2xl border-2 p-0.5 overflow-hidden shrink-0 shadow-md bg-white"
                  style={{ borderColor: primaryColor }}
                >
                  <UserAvatar 
                    src={userProfile?.photo} 
                    name={membershipData.name || userProfile?.name} 
                    className="w-full h-full" 
                    iconClassName="w-8 h-8"
                    roundedClassName="rounded-xl"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-black text-white leading-tight truncate">
                    {membershipData.name || userProfile?.name || 'Citizen Member'}
                  </h2>
                  <p className="text-xs font-semibold text-gray-300 mt-0.5">
                    {membershipData.phone || userProfile?.mobile ? `+91 ${membershipData.phone || userProfile?.mobile}` : ''}
                  </p>
                  {(membershipData.district || membershipData.assembly) && (
                    <p 
                      className="text-[0.68rem] font-bold truncate mt-0.5"
                      style={{ color: secondaryColor }}
                    >
                      {[membershipData.district, membershipData.assembly].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Bottom: ID & QR Code */}
              <div className="flex items-end justify-between pt-3 border-t border-slate-700/80 relative z-10">
                <div>
                  <span className="text-[0.55rem] font-bold text-gray-400 uppercase tracking-wider block">Membership Number</span>
                  <span className="text-xs font-mono font-black tracking-wider" style={{ color: primaryColor }}>{membershipData.id}</span>
                  <span className="text-[0.6rem] text-gray-400 block mt-0.5">Valid Thru: {membershipData.validThru || '2030'}</span>
                </div>
                
                {/* QR Mock */}
                <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-inner">
                  <div className="w-full h-full grid grid-cols-3 gap-0.5 bg-black p-0.5 rounded-lg">
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleShareCard}
                className="py-3.5 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
              >
                <HiShare className="w-4 h-4" />
                <span>Share Card</span>
              </button>

              <button 
                onClick={() => toast.success('Card downloaded as HD image!')}
                className="py-3.5 bg-white border border-gray-200 text-gray-800 font-extrabold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <HiArrowDownTray className="w-4 h-4 text-gray-600" />
                <span>Download</span>
              </button>
            </div>

            {/* Member Privileges List */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                <HiStar className="w-4 h-4" style={{ color: primaryColor }} />
                <span>Member Privileges & Rights</span>
              </h3>
              <div className="space-y-2.5">
                {[
                  "Official participation in party general meetings",
                  "Direct priority appointment channel with representative",
                  "Invites to state & central public rallies",
                  "Access to exclusive volunteer & leadership drives"
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                    <span 
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] font-black shrink-0 mt-0.5"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      <HiCheck className="w-3 h-3" />
                    </span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Membership Form */
          <div className="max-w-md mx-auto">
            {/* Banner */}
            <div 
              className="w-full px-6 py-6 text-center rounded-3xl mb-5 shadow-sm text-white"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
            >
              <h2 className="text-xl font-black mb-1">New Membership Drive</h2>
              <p className="text-white/80 text-xs font-semibold">Join the largest political movement and receive your instant digital membership card.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" 
                  placeholder="Enter full name" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Mobile Number <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" 
                  placeholder="10 digit mobile" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Voter ID / EPIC No. (Optional)</label>
                <input 
                  type="text" 
                  value={formData.voterId}
                  onChange={e => setFormData({...formData, voterId: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" 
                  placeholder="e.g. ABC1234567" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Address Details</label>
                <textarea 
                  rows="2"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none resize-none" 
                  placeholder="Village / Ward, District" 
                />
              </div>

              <button 
                type="submit" 
                className="mt-2 w-full h-12 text-white font-extrabold text-sm rounded-xl shadow-md active:scale-95 transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Generate Digital Card
              </button>
            </form>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}


