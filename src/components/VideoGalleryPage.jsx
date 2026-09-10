import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import BottomNav from './BottomNav';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { useTenant } from '../context/TenantContext';
import { getMediaUrl } from '../utils/mediaUrl';

export default function VideoGalleryPage() {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTenant();
  const [activeTab, setActiveTab] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const tabs = ['All', 'Speeches', 'Development', 'Campaign', 'Interviews'];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const params = { type: 'video' };
        if (activeTab !== 'All') {
          params.category = activeTab;
        }
        const res = await api.getGallery(params).catch(() => []);
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (list.length > 0) {
          const formatted = list.map((item, idx) => ({
            id: item._id || item.id || idx + 1,
            title: item.title || 'Constituency Video',
            category: item.category || 'General',
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
            duration: item.duration || '05:30',
            views: item.views ? `${item.views} views` : 'Official',
            thumbnail: getMediaUrl(item.thumbnailUrl || item.imageUrl || item.url, '/event_jan_sabha.jpg'),
            videoUrl: getMediaUrl(item.url || item.videoUrl, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
          }));
          setVideos(formatted);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.warn('Video gallery fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [activeTab]);

  const filteredVideos = activeTab === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeTab);

  const handleShare = (video, e) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Watch: ${video.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Video link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden pb-[72px]">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-white border-b border-gray-100 shadow-xs z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold text-[#1e293b] truncate leading-tight">Video Gallery</h1>
            <p className="text-[10px] font-semibold text-gray-500 truncate">Official speeches, events & interviews</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 shrink-0 shadow-sm z-10 overflow-x-auto scrollbar-hide flex gap-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            style={activeTab === tab ? { backgroundColor: primaryColor } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-4">
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <LoadingSpinner message="वीडियो गैलरी लोड हो रही है..." />
          </div>
        ) : (
        <div className="flex flex-col gap-5 pb-6">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              onClick={() => setActiveVideo(video)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer active:scale-[0.99] transition-all hover:shadow-md"
            >
              <div className="w-full h-48 relative bg-gray-900 overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                
                {/* Duration Tag */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {video.duration}
                </div>

                {/* Category Tag */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {video.category}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-extrabold text-gray-900 leading-snug mb-2 transition-colors">{video.title}</h3>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{video.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{video.views}</span>
                  </div>
                  <button 
                    onClick={(e) => handleShare(video, e)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-gray-950 text-white">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{activeVideo.category}</span>
              <button 
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Element */}
            <div className="w-full aspect-video bg-black">
              <video 
                src={activeVideo.videoUrl} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Info */}
            <div className="p-4 bg-gray-900 text-white">
              <h3 className="font-bold text-sm leading-snug mb-2">{activeVideo.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{activeVideo.date} • {activeVideo.views}</span>
                <button 
                  onClick={() => handleShare(activeVideo)}
                  className="px-3 py-1.5 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

