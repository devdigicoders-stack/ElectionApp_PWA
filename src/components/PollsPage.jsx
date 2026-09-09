import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function PollsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');
  
  // Mock data for polls
  const polls = [
    {
      id: 1,
      question: "Which sector needs immediate attention in your area?",
      options: [
        { id: 'opt1', text: 'Road Infrastructure', votes: 45 },
        { id: 'opt2', text: 'Water Supply', votes: 30 },
        { id: 'opt3', text: 'Healthcare Facilities', votes: 15 },
        { id: 'opt4', text: 'Education', votes: 10 }
      ],
      totalVotes: 100,
      voted: null,
      status: 'active',
      date: 'Closes in 2 days'
    },
    {
      id: 2,
      question: "Are you satisfied with the recent cleanliness drive?",
      options: [
        { id: 'opt1', text: 'Very Satisfied', votes: 120 },
        { id: 'opt2', text: 'Somewhat Satisfied', votes: 50 },
        { id: 'opt3', text: 'Neutral', votes: 20 },
        { id: 'opt4', text: 'Dissatisfied', votes: 10 }
      ],
      totalVotes: 200,
      voted: 'opt1',
      status: 'active',
      date: 'Closes in 5 hours'
    }
  ];

  const [pollData, setPollData] = useState(polls);

  const handleVote = (pollId, optionId) => {
    setPollData(prevPolls => prevPolls.map(poll => {
      if (poll.id === pollId && !poll.voted) {
        return {
          ...poll,
          voted: optionId,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    }));
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-white shadow-sm z-20">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold text-[#1e293b] ml-1 tracking-wide">Public Polls</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-4 border-b border-gray-100 shrink-0 shadow-sm z-10">
        <button 
          onClick={() => setActiveTab('Active')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'Active' ? 'border-[#f37920] text-[#f37920]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Active Polls
        </button>
        <button 
          onClick={() => setActiveTab('Past')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'Past' ? 'border-[#f37920] text-[#f37920]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Past Results
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        {activeTab === 'Active' ? (
          <div className="flex flex-col gap-5 pb-6">
            {pollData.filter(p => p.status === 'active').map((poll) => (
              <div key={poll.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-[1.05rem] font-bold text-gray-900 leading-snug">{poll.question}</h3>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-bold bg-orange-50 text-orange-600 uppercase tracking-wider">
                    {poll.date}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {poll.options.map(opt => {
                    const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                    const isSelected = poll.voted === opt.id;
                    
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => handleVote(poll.id, opt.id)}
                        className={`relative rounded-xl p-3 border-2 transition-all cursor-pointer ${isSelected ? 'border-[#f37920] bg-orange-50/30' : poll.voted ? 'border-gray-100 bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        {/* Progress Bar Background */}
                        {poll.voted && (
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-xl opacity-20 transition-all duration-1000 ${isSelected ? 'bg-[#f37920]' : 'bg-gray-400'}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        )}
                        
                        <div className="relative z-10 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {!poll.voted ? (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                            ) : (
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#f37920]' : 'bg-gray-300'}`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            )}
                            <span className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{opt.text}</span>
                          </div>
                          {poll.voted && (
                            <span className={`font-bold text-sm ${isSelected ? 'text-[#f37920]' : 'text-gray-500'}`}>{percentage}%</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {poll.voted && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-500">
                    <span>Total Votes: {poll.totalVotes}</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Voted
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 font-medium text-sm">No past polls available.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
