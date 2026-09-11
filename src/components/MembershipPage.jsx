import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import UserAvatar from './UserAvatar';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { useLanguage } from '../context/LanguageContext';
import { getMediaUrl } from '../utils/mediaUrl';
import {
  HiShare,
  HiArrowDownTray,
  HiCheckBadge,
  HiSparkles,
  HiArrowLeft,
  HiCheck,
  HiStar,
  HiClock,
  HiXCircle,
  HiArrowPath,
} from 'react-icons/hi2';

// ─── Status badge helper ────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    approved: { label: 'APPROVED', bg: '#dcfce7', color: '#166534', dot: '#16a34a' },
    pending: { label: 'PENDING REVIEW', bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04' },
    rejected: { label: 'REJECTED', bg: '#fee2e2', color: '#991b1b', dot: '#dc2626' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider" style={{ backgroundColor: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
}

export default function MembershipPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { primaryColor, secondaryColor, leaderName } = useTenant();
  const cardRef = useRef(null);

  const [view, setView] = useState('loading'); // 'loading' | 'no-app' | 'form' | 'pending' | 'rejected' | 'card'
  const [userProfile, setUserProfile] = useState(null);
  const [membershipData, setMembershipData] = useState(null); // approved card data
  const [membershipStatus, setMembershipStatus] = useState(null); // raw membership doc
  const [tenantConfig, setTenantConfig] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    voterId: '',
    address: '',
    designation: '',
  });

  const loadData = useCallback(async () => {
    setView('loading');
    let user = storage.getUser() || {};
    try {
      const liveProfile = await api.getCitizenProfile().catch(() => null);
      if (liveProfile?.profile) {
        user = { ...user, ...liveProfile.profile };
        storage.setUser(user);
      }
    } catch { }

    setUserProfile(user);
    setFormData({
      name: user.name || '',
      phone: user.mobile || '',
      voterId: user.customFields?.voter_id || user.voter_id || '',
      address: user.district ? [user.village, user.ward, user.district].filter(Boolean).join(', ') : '',
      designation: '',
    });

    try {
      // Fetch config
      const configRes = await api.getConfig().catch(() => null);
      if (configRes) setTenantConfig(configRes);

      // First check if a membership application exists
      const memRes = await api.getMyMembership().catch(() => null);

      if (!memRes) {
        // No application at all — check token
        if (!api.getToken()) {
          navigate('/login', { state: { from: '/membership' } });
          return;
        }
        setView('no-app');
        return;
      }

      setMembershipStatus(memRes);
      const status = memRes.status;

      if (status === 'pending') {
        setView('pending');
        return;
      }
      if (status === 'rejected') {
        setView('rejected');
        return;
      }
      if (status === 'approved') {
        // Try to get the card details
        const cardRes = await api.getMyMembershipCard().catch(() => null);
        if (cardRes && cardRes.hasCard) {
          const user_ = memRes?.userId || cardRes?.member || user;
          const photo = (typeof user_ === 'object' ? (user_?.profilePhoto || user_?.photo) : null) || user?.profilePhoto || user?.photo || null;
          setMembershipData({
            membershipNumber: cardRes.membershipNumber,
            name: (typeof user_ === 'object' ? user_?.name : null) || user.name || 'Member',
            phone: (typeof user_ === 'object' ? user_?.mobile : null) || user.mobile || '',
            photo,
            designation: cardRes.designation || memRes.designation || 'Active Member',
            approvedAt: cardRes.approvedAt ? new Date(cardRes.approvedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
            validThru: cardRes.expiresAt ? new Date(cardRes.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Lifetime',
            cardUrl: cardRes.cardUrl ? getMediaUrl(cardRes.cardUrl) : null,
            downloadUrl: cardRes.downloadUrl,
            verificationUrl: cardRes.verificationUrl,
          });
          setView('card');
        } else {
          // Approved but card not yet generated
          setView('pending');
        }
        return;
      }
      setView('no-app');
    } catch {
      setView('no-app');
    }
  }, [navigate]);

  useEffect(() => {
    if (!api.getToken()) {
      navigate('/login', { state: { from: '/membership' } });
      return;
    }
    loadData();

    const handleProfileUpdate = (e) => {
      const updatedUser = e?.detail || storage.getUser();
      if (updatedUser) {
        setUserProfile(updatedUser);
        const photo = updatedUser.profilePhoto || updatedUser.photo || null;
        setMembershipData(prev => prev ? { ...prev, photo } : prev);
      }
    };

    window.addEventListener('pwa_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('pwa_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, [loadData, navigate]);

  // ── Submit form ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and Phone are required');
      return;
    }
    setSubmitting(true);
    try {
      await api.applyMembership({
        designation: formData.designation || 'Active Member',
        customData: {
          name: formData.name,
          phone: formData.phone,
          voterId: formData.voterId,
          address: formData.address,
        },
      });
      toast.success('✅ Application submitted! Awaiting approval.');
      await loadData();
    } catch (err) {
      if (err?.message?.includes('already exists')) {
        toast.info('Application already submitted — refreshing status...');
        await loadData();
      } else {
        toast.error(err?.message || 'Submission failed, please try again');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Download card as PNG via browser print ──────────────────────────────
  const handleDownload = async () => {
    if (membershipData?.cardUrl) {
      // Download backend-generated card image directly
      try {
        setDownloading(true);
        const link = document.createElement('a');
        link.href = membershipData.cardUrl;
        link.download = `membership-card-${membershipData.membershipNumber}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Card download started!');
      } catch {
        toast.error('Download failed');
      } finally {
        setDownloading(false);
      }
    } else {
      // Fallback: print card section
      window.print();
      toast.info('Use browser print → Save as PDF');
    }
  };

  // ── Share card ──────────────────────────────────────────────────────────
  const handleShare = async () => {
    const text = `I am a verified member! ID: ${membershipData?.membershipNumber}`;
    const url = membershipData?.verificationUrl || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${leaderName} Membership`, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success('Details copied to clipboard!');
      }
    } catch { }
  };

  // ── Card UI component ───────────────────────────────────────────────────
  const MemberCard = () => (
    <div ref={cardRef} className="relative w-full rounded-3xl overflow-hidden shadow-2xl text-white border border-slate-700 p-5 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0b1329 0%, #131e3a 50%, #0f172a 100%)', minHeight: 220 }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: primaryColor }} />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: secondaryColor || primaryColor }} />

      {/* Top row: logo + org name + status */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {tenantConfig?.branding?.logoUrl && (
            <img src={tenantConfig.branding.logoUrl} alt="Logo" className="w-9 h-9 object-contain rounded-full" onError={e => e.target.style.display = 'none'} />
          )}
          <div>
            <p className="text-xs font-black tracking-widest uppercase leading-none" style={{ color: primaryColor }}>
              {tenantConfig?.branding?.leaderName || leaderName || 'JAN SAMPARK'}
            </p>
            <p className="text-[0.55rem] font-bold text-gray-400 tracking-widest mt-0.5 uppercase">{t('membershipCardTitle')}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-extrabold border" style={{ backgroundColor: `${secondaryColor}25`, color: secondaryColor || '#f59e0b', borderColor: `${secondaryColor}50` }}>
          ✓ {t('activeStatus')}
        </span>
      </div>

      {/* Middle: photo + member details */}
      <div className="flex items-center gap-4 my-3 relative z-10">
        <div className="w-16 h-16 rounded-2xl border-2 overflow-hidden shrink-0 shadow-lg bg-transparent flex items-center justify-center" style={{ borderColor: primaryColor }}>
          <UserAvatar
            src={membershipData?.photo || userProfile?.profilePhoto || userProfile?.photo}
            name={membershipData?.name || userProfile?.name}
            className="w-full h-full"
            iconClassName="w-8 h-8"
            roundedClassName="rounded-xl"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-white leading-tight truncate">{membershipData?.name || userProfile?.name}</h2>
          <p className="text-xs text-gray-300 font-medium mt-0.5">{membershipData?.designation}</p>
          {membershipData?.phone && <p className="text-[0.65rem] text-gray-400 mt-0.5">+91 {membershipData.phone}</p>}
        </div>
      </div>

      {/* Bottom: ID number + QR pattern + dates */}
      <div className="flex items-end justify-between border-t border-slate-700/60 pt-3 relative z-10">
        <div>
          <span className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-wider block">{t('membershipNumber')}</span>
          <span className="text-sm font-mono font-black tracking-wider" style={{ color: primaryColor }}>{membershipData?.membershipNumber}</span>
          <span className="text-[0.6rem] text-gray-400 block mt-0.5">{t('memberSince')}: {membershipData?.approvedAt} · {t('validLifetime')}</span>
        </div>
        {/* QR visual */}
        <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-inner">
          <div className="w-full h-full grid grid-cols-3 gap-0.5 bg-black p-0.5 rounded-lg">
            {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((v, i) => (
              <div key={i} className={`rounded-sm ${v ? 'bg-white' : 'bg-black'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 active:scale-95 shrink-0">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-[#1e293b] truncate">{t('membershipCardTitle')}</h1>
        </div>
        {view !== 'loading' && view !== 'form' && (
          <button onClick={loadData} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 active:scale-95">
            <HiArrowPath className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full p-4">

        {/* LOADING */}
        {view === 'loading' && (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="सदस्यता लोड हो रही है..." />
          </div>
        )}

        {/* NO APPLICATION — Show Join Banner + CTA */}
        {view === 'no-app' && (
          <div className="max-w-md mx-auto flex flex-col gap-5">
            <div className="rounded-3xl overflow-hidden shadow-xl text-white p-8 text-center relative" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor}cc)` }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <HiCheckBadge className="w-14 h-14 mx-auto mb-3 opacity-90" />
              <h2 className="text-xl font-black mb-2">Join the Movement</h2>
              <p className="text-white/80 text-sm font-medium">Become an official member and get your digital membership card instantly.</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
              {[
                'Official digital membership card with QR code',
                'Priority appointment with representative',
                'Invitations to state & central rallies',
                'Access to volunteer & leadership drives',
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm font-semibold text-gray-700">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    <HiCheck className="w-3 h-3" />
                  </span>
                  {b}
                </div>
              ))}
            </div>
            <button onClick={() => setView('form')} className="w-full h-14 text-white font-extrabold text-sm rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}>
              <HiSparkles className="w-5 h-5" />
              Apply for Membership
            </button>
          </div>
        )}

        {/* FORM */}
        {view === 'form' && (
          <div className="max-w-md mx-auto flex flex-col gap-4">
            <div className="rounded-3xl text-white p-5 text-center shadow-md" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor}cc)` }}>
              <h2 className="text-lg font-black">Membership Application</h2>
              <p className="text-white/80 text-xs mt-1">Fill the form below to apply for your official membership</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Enter your full name', required: true },
                { label: 'Mobile Number', key: 'phone', type: 'tel', placeholder: '10-digit mobile number', required: true },
                { label: 'Voter ID / EPIC No. (Optional)', key: 'voterId', type: 'text', placeholder: 'e.g. ABC1234567', required: false },
                { label: 'Designation (Optional)', key: 'designation', type: 'text', placeholder: 'e.g. Ward Secretary, Block President', required: false },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-800">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                  <input
                    type={f.type}
                    value={formData[f.key]}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-800">Address / Village / Ward</label>
                <textarea rows={2} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none" placeholder="Village / Ward, District" />
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setView('no-app')} className="flex-1 h-12 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 active:scale-95 transition-all">Back</button>
                <button type="submit" disabled={submitting} className="flex-1 h-12 text-white font-extrabold text-sm rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-70" style={{ backgroundColor: primaryColor }}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PENDING */}
        {view === 'pending' && (
          <div className="max-w-md mx-auto flex flex-col gap-4 items-center text-center pt-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#fef9c3' }}>
              <HiClock className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Application Under Review</h2>
            <p className="text-gray-500 text-sm font-medium">आपका आवेदन जमा हो गया है। अनुमोदन होने के बाद आपका Digital Membership Card यहाँ दिखेगा।</p>
            <StatusBadge status="pending" />
            <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-left space-y-2">
              <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Application Details</p>
              <div className="space-y-1.5">
                {membershipStatus?.createdAt && (
                  <div className="flex justify-between text-xs font-medium text-gray-600">
                    <span>Applied On</span>
                    <span className="font-bold">{new Date(membershipStatus.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-medium text-gray-600">
                  <span>Status</span>
                  <span className="font-bold text-yellow-600">Pending Approval</span>
                </div>
              </div>
            </div>
            <button onClick={loadData} className="w-full h-12 rounded-xl font-bold text-sm text-white shadow-md active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>
              Refresh Status
            </button>
          </div>
        )}

        {/* REJECTED */}
        {view === 'rejected' && (
          <div className="max-w-md mx-auto flex flex-col gap-4 items-center text-center pt-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fee2e2' }}>
              <HiXCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Application Rejected</h2>
            {membershipStatus?.rejectionReason && (
              <p className="text-sm text-red-600 font-medium bg-red-50 px-4 py-2 rounded-xl">Reason: {membershipStatus.rejectionReason}</p>
            )}
            <p className="text-gray-500 text-sm">Please contact your area coordinator or re-apply.</p>
          </div>
        )}

        {/* APPROVED CARD */}
        {view === 'card' && membershipData && (
          <div className="flex flex-col gap-5 max-w-md mx-auto">

            {/* Digital Card */}
            <MemberCard />

            {/* If backend has a pre-generated image, show it as well */}
            {membershipData.cardUrl && (
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t('officialIssuedCard')}</p>
                <img
                  src={membershipData.cardUrl}
                  alt="Membership Card"
                  className="w-full rounded-xl border border-gray-200 shadow-sm"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShare}
                className="py-3.5 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
              >
                <HiShare className="w-4 h-4" />
                {t('shareCard')}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="py-3.5 bg-white border border-gray-200 text-gray-800 font-extrabold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70"
              >
                <HiArrowDownTray className="w-4 h-4 text-gray-600" />
                {downloading ? 'Saving...' : t('downloadCard')}
              </button>
            </div>

            {/* Member Privileges */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                <HiStar className="w-4 h-4" style={{ color: primaryColor }} />
                Member Privileges & Rights
              </h3>
              <div className="space-y-2.5">
                {[
                  'Official participation in party general meetings',
                  'Direct priority appointment channel with representative',
                  'Invites to state & central public rallies',
                  'Access to exclusive volunteer & leadership drives',
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] font-black shrink-0 mt-0.5" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      <HiCheck className="w-3 h-3" />
                    </span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}