
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './components/SplashPage';
import OnboardingPage from './components/OnboardingPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import DevelopmentPage from './components/DevelopmentPage';
import WorkDetailsPage from './components/WorkDetailsPage';
import EventsPage from './components/EventsPage';
import MyProfilePage from './components/MyProfilePage';
import NotificationsPage from './components/NotificationsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import PollsPage from './components/PollsPage';
import ComplaintPage from './components/ComplaintPage';
import MyComplaintsPage from './components/MyComplaintsPage';
import PhotoGalleryPage from './components/PhotoGalleryPage';
import VideoGalleryPage from './components/VideoGalleryPage';
import LatestUpdatesPage from './components/LatestUpdatesPage';
import MenuPage from './components/MenuPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <main className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/works" element={<DevelopmentPage />} />
            <Route path="/works/:id" element={<WorkDetailsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/my-profile" element={<MyProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="/polls" element={<PollsPage />} />
            <Route path="/complaint" element={<ComplaintPage />} />
            <Route path="/my-complaints" element={<MyComplaintsPage />} />
            <Route path="/photo-gallery" element={<PhotoGalleryPage />} />
            <Route path="/video-gallery" element={<VideoGalleryPage />} />
            <Route path="/latest-updates" element={<LatestUpdatesPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;

