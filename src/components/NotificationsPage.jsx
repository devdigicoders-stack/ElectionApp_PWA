import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Inbox');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const notifications = [
    { id: 1, title: 'Urgent Meeting Scheduled', message: 'All volunteers must gather at the main office by 5 PM today.', time: '2 hours ago', type: 'alert', read: false },
    { id: 2, title: 'New Event Added', message: 'The Jan Sabha in Varanasi has been confirmed for 25th Sep.', time: '5 hours ago', type: 'info', read: true },
    { id: 3, title: 'Thank you for registering', message: 'Your profile has been verified successfully as a Party Worker.', time: '1 day ago', type: 'success', read: true },
  ];

  const [sendForm, setSendForm] = useState({
    title: '',
    message: '',
    targetRole: 'All',
    targetArea: 'All'
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!sendForm.title || !sendForm.message) return;
    
    // Show mock toast
    setToast({ visible: true, message: 'Notification broadcasted successfully!' });
    setSendForm({ title: '', message: '', targetRole: 'All', targetArea: 'All' });
    
    setTimeout(() => {
      setToast({ visible: false, message: '' });
      setActiveTab('Inbox');
    }, 2000);
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'alert': return (
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
      );
      case 'success': return (
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      );
      default: return (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      );
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center px-4 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900 ml-2">Notifications</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-4 border-b border-gray-100 shrink-0">
        <button 
          onClick={() => setActiveTab('Inbox')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'Inbox' ? 'border-[#f37920] text-[#f37920]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Inbox
        </button>
        <button 
          onClick={() => setActiveTab('Send')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'Send' ? 'border-[#f37920] text-[#f37920]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Send Broadcast
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        
        {/* INBOX TAB */}
        {activeTab === 'Inbox' && (
          <div className="p-4 flex flex-col gap-3">
            {notifications.map(note => (
              <div key={note.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${note.read ? 'border-gray-100' : 'border-[#f37920]/30 shadow-[#f37920]/5'} flex gap-4 transition-all active:scale-[0.98]`}>
                {getIconForType(note.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${note.read ? 'text-gray-900' : 'text-gray-900'}`}>{note.title}</h3>
                    {!note.read && <span className="w-2.5 h-2.5 rounded-full bg-[#f37920] shrink-0 mt-1"></span>}
                  </div>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed mb-2">{note.message}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{note.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEND BROADCAST TAB */}
        {activeTab === 'Send' && (
          <div className="p-5 animate-in fade-in duration-200">
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                <div>
                  <h4 className="text-sm font-bold text-orange-900">Broadcast Message</h4>
                  <p className="text-xs text-orange-700 mt-1 leading-relaxed font-medium">Send push notifications directly to users' phones based on their roles and geographic area.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSend} className="flex flex-col gap-5">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Notification Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Urgent Meeting Setup"
                  value={sendForm.title}
                  onChange={(e) => setSendForm({...sendForm, title: e.target.value})}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 placeholder:font-normal focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Message Body</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Write your broadcast message here..."
                  value={sendForm.message}
                  onChange={(e) => setSendForm({...sendForm, message: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 placeholder:font-normal focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Role</label>
                  <select 
                    value={sendForm.targetRole}
                    onChange={(e) => setSendForm({...sendForm, targetRole: e.target.value})}
                    className="w-full h-12 px-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] appearance-none"
                  >
                    <option value="All">All Roles</option>
                    <option value="Supporter">Supporters</option>
                    <option value="Volunteer">Volunteers</option>
                    <option value="Worker">Party Workers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Area</label>
                  <select 
                    value={sendForm.targetArea}
                    onChange={(e) => setSendForm({...sendForm, targetArea: e.target.value})}
                    className="w-full h-12 px-3 border border-gray-200 rounded-xl bg-white outline-none text-sm font-semibold text-gray-800 focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] appearance-none"
                  >
                    <option value="All">All Areas</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 h-14 bg-[#f37920] hover:bg-[#e25d14] text-white font-bold text-[15px] rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Send Broadcast
              </button>
            </form>

          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 text-white px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-bold">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
