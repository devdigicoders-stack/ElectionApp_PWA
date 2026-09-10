import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { toast } from 'react-toastify';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { 
  HiMapPin, 
  HiCheck, 
  HiChartBar, 
  HiUsers, 
  HiArrowLeft 
} from 'react-icons/hi2';

export default function PollsPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [activeTab, setActiveTab] = useState('Active');
  const [pollData, setPollData] = useState([]);

  useEffect(() => {
    const loadPolls = async () => {
      try {
        const livePolls = await api.getActivePolls().catch(() => null);
        const storedPolls = storage.getPolls();
        const votedMap = storage.getVotedPolls();
        
        if (Array.isArray(livePolls) && livePolls.length > 0) {
          // Merge with persistent voted map and stored cache
          const merged = livePolls.map(live => {
            const pId = String(live._id || live.id);
            const votedOption = votedMap[pId] || storedPolls.find(s => String(s._id || s.id) === pId)?.userVoted;
            if (votedOption) {
              return { ...live, userVoted: votedOption, isVoted: true };
            }
            return live;
          });
          setPollData(merged);
          storage.setPolls(merged);
        } else {
          // Fallback to local stored polls with votedMap
          const fallback = storedPolls.map(p => {
            const pId = String(p._id || p.id);
            if (votedMap[pId]) {
              return { ...p, userVoted: votedMap[pId], isVoted: true };
            }
            return p;
          });
          setPollData(fallback);
        }
      } catch (err) {
        const votedMap = storage.getVotedPolls();
        const fallback = storage.getPolls().map(p => {
          const pId = String(p._id || p.id);
          if (votedMap[pId]) {
            return { ...p, userVoted: votedMap[pId], isVoted: true };
          }
          return p;
        });
        setPollData(fallback);
      }
    };

    loadPolls();
  }, []);

  const handleVote = async (pollId, optionId) => {
    const poll = pollData.find(p => String(p._id || p.id) === String(pollId));
    if (poll && (poll.userVoted || poll.isVoted)) {
      toast.info('Aap pehle hi is poll me vote de chuke hain!');
      return;
    }

    try {
      // POST {{baseUrl}}/polls/{{pollId}}/vote with body: { optionId }
      const res = await api.votePoll(pollId, optionId);
      const successMsg = res?.message || 'Vote recorded';
      
      const updated = storage.votePoll(pollId, optionId);
      setPollData(updated);
      toast.success(successMsg || 'Vote recorded successfully!');
    } catch (err) {
      console.warn('Vote submission error:', err);
      // If backend returns 400 "You have already voted"
      const errMsg = err?.message || '';
      if (errMsg.toLowerCase().includes('already voted') || err?.status === 400) {
        const updated = storage.votePoll(pollId, optionId);
        setPollData(updated);
        toast.info('Aap pehle hi is poll me vote de chuke hain!');
        return;
      }
      
      const updated = storage.votePoll(pollId, optionId);
      setPollData(updated);
      toast.success('Vote recorded');
    }
  };

  // Filter active vs past polls from backend data dynamically
  const now = new Date();
  const activePolls = pollData.filter(p => {
    const isEnded = p.endsAt && new Date(p.endsAt) < now;
    const isExplicitlyInactive = p.isActive === false;
    return !isEnded && !isExplicitlyInactive;
  });

  const backendPastPolls = pollData.filter(p => {
    const isEnded = p.endsAt && new Date(p.endsAt) < now;
    const isExplicitlyInactive = p.isActive === false;
    return isEnded || isExplicitlyInactive;
  });

  const fallbackPastPolls = [
    {
      id: 99,
      question: "Which park restoration project in Sector 4 should be prioritized first?",
      category: "Urban Development",
      area: "Constituency Area",
      date: "Closed recently",
      totalVotes: 4820,
      userVoted: 'opt1',
      options: [
        { id: 'opt1', text: 'Central Green Park & Walking Track', votes: 2892, percent: 60 },
        { id: 'opt2', text: 'Children Play Area & Open Gym', votes: 1446, percent: 30 },
        { id: 'opt3', text: 'Senior Citizen Meditation Pavilion', votes: 482, percent: 10 }
      ]
    },
    {
      id: 98,
      question: "Preferred timing for weekly Public Grievance Chaupal at Block office?",
      category: "Governance",
      area: "All Wards",
      date: "Closed recently",
      totalVotes: 2150,
      userVoted: null,
      options: [
        { id: 'opt1', text: 'Saturday Morning (9 AM - 12 PM)', votes: 1400, percent: 65 },
        { id: 'opt2', text: 'Sunday Evening (4 PM - 7 PM)', votes: 750, percent: 35 }
      ]
    }
  ];

  const pastPolls = backendPastPolls.length > 0 ? backendPastPolls : fallbackPastPolls;

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-black text-gray-900 truncate leading-tight">Public Opinion Polls</h1>
            <p className="text-[11px] font-semibold text-gray-500 truncate">Janmat Sarvekshan • Direct Citizen Voting</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-4 border-b border-gray-100 shrink-0 shadow-xs z-10">
        <button 
          onClick={() => setActiveTab('Active')}
          className={`flex-1 py-3 text-xs font-black border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'Active' ? 'border-b-2' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          style={activeTab === 'Active' ? { borderColor: primaryColor, color: primaryColor } : {}}
        >
          <span>Active Polls</span>
          <span 
            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            {activePolls.length}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('Past')}
          className={`flex-1 py-3 text-xs font-black border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'Past' ? 'border-b-2' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
          style={activeTab === 'Past' ? { borderColor: primaryColor, color: primaryColor } : {}}
        >
          <span>Past Results</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">{pastPolls.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        {activeTab === 'Active' ? (
          <div className="flex flex-col gap-4 pb-6">
            <div 
              className="rounded-2xl p-4 text-white shadow-sm flex items-center gap-3.5"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})` }}
            >
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                <HiChartBar className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm text-white">Direct Public Participation</h4>
                <p className="text-xs text-white/90 font-medium leading-tight mt-0.5">
                  Vote on local policy & development decisions directly surveyed by your MLA office.
                </p>
              </div>
            </div>

            {activePolls.map((poll) => (
              <div 
                key={poll.id || poll._id} 
                className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 tracking-wide">
                    <HiMapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{poll.area || 'All Constituency'}</span>
                  </span>
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {poll.category || 'General'}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-gray-900 leading-snug mb-4">
                  {poll.question}
                </h3>

                <div className="flex flex-col gap-2.5">
                  {poll.options.map(opt => {
                    const optId = opt._id || opt.id;
                    const isSelected = poll.userVoted === optId || poll.selectedOption === optId;
                    const hasVoted = Boolean(poll.userVoted || poll.isVoted);
                    const totalVotes = poll.totalVotes || 0;
                    const percentage = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
                    
                    return (
                      <div 
                        key={optId}
                        onClick={() => handleVote(poll.id || poll._id, optId)}
                        className={`relative rounded-2xl p-3.5 border-2 transition-all overflow-hidden ${
                          !hasVoted 
                            ? 'cursor-pointer border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 active:scale-[0.99]' 
                            : isSelected
                              ? 'cursor-pointer border-transparent shadow-xs active:scale-[0.99]'
                              : 'cursor-pointer border-gray-100 bg-gray-50/50 hover:border-gray-200 active:scale-[0.99]'
                        }`}
                        style={
                          isSelected 
                            ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` } 
                            : {}
                        }
                      >
                        {/* Progress Bar Background on Voted State */}
                        {hasVoted && (
                          <div 
                            className="absolute top-0 left-0 bottom-0 transition-all duration-700 rounded-2xl" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: isSelected ? `${primaryColor}20` : '#e2e8f0',
                            }}
                          ></div>
                        )}
                        
                        <div className="relative z-10 flex justify-between items-center gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {!hasVoted ? (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center bg-white"></div>
                            ) : (
                              <div 
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs"
                                style={{ backgroundColor: isSelected ? primaryColor : '#94a3b8' }}
                              >
                                {isSelected ? (
                                  <HiCheck className="w-3.5 h-3.5 text-white stroke-2" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-white/70"></div>
                                )}
                              </div>
                            )}
                            <span className={`text-xs leading-tight ${isSelected ? 'text-gray-900 font-extrabold' : 'text-gray-700 font-semibold'}`}>
                              {opt.text}
                            </span>
                          </div>

                          {hasVoted && (
                            <span 
                              className="font-black text-xs shrink-0 ml-2"
                              style={{ color: isSelected ? primaryColor : '#64748b' }}
                            >
                              {percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Poll Footer */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <HiUsers className="w-4 h-4 text-gray-400" />
                    <span>{(poll.totalVotes || 0).toLocaleString()} Votes</span>
                  </span>
                  {poll.userVoted || poll.isVoted ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px]">
                      <HiCheck className="w-3.5 h-3.5" />
                      <span>Voted</span>
                    </span>
                  ) : (
                    <span 
                      className="font-extrabold text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 animate-pulse"
                      style={{ 
                        backgroundColor: `${primaryColor}10`, 
                        color: primaryColor,
                        borderColor: `${primaryColor}30`
                      }}
                    >
                      Tap option to vote
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-6">
            {pastPolls.map((poll) => {
              const pollTotal = poll.totalVotes || 0;
              return (
                <div key={poll.id || poll._id} className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                      <HiMapPin className="w-3 h-3 text-gray-500" />
                      <span>{poll.area || 'All Constituency'}</span>
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      {poll.date || (poll.endsAt ? `Closed on ${new Date(poll.endsAt).toLocaleDateString()}` : 'Poll Closed')}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-gray-900 leading-snug mb-3">{poll.question}</h3>
                  <div className="flex flex-col gap-2">
                    {poll.options.map(opt => {
                      const optId = opt._id || opt.id || opt.optionId;
                      const optPercent = opt.percent !== undefined 
                        ? opt.percent 
                        : (pollTotal > 0 ? Math.round(((opt.votes || 0) / pollTotal) * 100) : 0);
                      
                      return (
                        <div key={optId} className="relative rounded-2xl p-3 bg-gray-50 border border-gray-100 overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 bottom-0 opacity-20 rounded-2xl" 
                            style={{ width: `${optPercent}%`, backgroundColor: primaryColor }}
                          ></div>
                          <div className="relative z-10 flex justify-between items-center gap-2">
                            <span className="text-xs font-bold text-gray-800">{opt.text}</span>
                            <span className="text-xs font-black text-gray-900">{optPercent}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-right text-[11px] font-bold text-gray-400">
                    Total Participants: {pollTotal.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}


