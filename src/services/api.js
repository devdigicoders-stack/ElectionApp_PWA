// Dynamically detect host
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    // If hosted on live domains (e.g. vercel.app), prefer deployed live Render backend
    if (window.location.hostname.includes('vercel.app') || (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1') && !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname))) {
      return 'https://electionapp-backend-jai8.onrender.com';
    }
    // If local IP on mobile Wi-Fi
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname)) {
      return `http://${window.location.hostname}:3001`;
    }
  }
  return envUrl || 'https://electionapp-backend-jai8.onrender.com';
};

const BASE_URL = getBaseUrl();
const DEFAULT_TENANT_SLUG = import.meta.env.VITE_DEFAULT_TENANT_SLUG || 'demo';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getTenantSlug() {
    const slug = (import.meta.env.VITE_DEFAULT_TENANT_SLUG || '').trim();
    return slug;
  }

  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = {
      ...customHeaders,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Tenant slug header
    const tenantSlug = this.getTenantSlug();
    if (tenantSlug) {
      headers['x-tenant-slug'] = tenantSlug;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const tenantSlug = this.getTenantSlug();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const separator = cleanEndpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${cleanEndpoint}${tenantSlug ? `${separator}tenant_slug=${encodeURIComponent(tenantSlug)}` : ''}`;
    const isFormData = options.body instanceof FormData;
    const headers = this.getHeaders(options.headers, isFormData);

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object' && !isFormData) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = resData.message || (Array.isArray(resData.errors) ? resData.errors.join(', ') : 'Something went wrong');
        throw new Error(errorMsg);
      }

      // Backend returns { success: true, data: ... } via ResponseInterceptor
      return resData.data !== undefined ? resData.data : resData;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth APIs
  sendOtp(mobile) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: { mobile },
    });
  }

  verifyOtp(mobile, code) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: { mobile, code },
    });
  }

  // User / Citizen Profile APIs
  getCitizenProfile() {
    return this.request('/citizen/profile', {
      method: 'GET',
    });
  }

  getUserById(userId) {
    return this.request(`/users/${userId}`, {
      method: 'GET',
    });
  }

  updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: profileData,
    });
  }

  // Registration Form Dynamic APIs
  getPublicRegistrationForm() {
    return this.request('/registration-form/public', {
      method: 'GET',
    });
  }

  completeProfile(formData) {
    return this.request('/registration-form/complete-profile', {
      method: 'POST',
      body: formData,
    });
  }

  // Membership APIs
  getMyMembership() {
    return this.request('/membership/my', {
      method: 'GET',
    });
  }

  getMyMembershipCard() {
    return this.request('/membership/my/card', {
      method: 'GET',
    });
  }

  applyMembership(data) {
    return this.request('/membership/apply', {
      method: 'POST',
      body: data,
    });
  }

  // Polls APIs
  getActivePolls(areaId) {
    const endpoint = areaId ? `/polls?areaId=${areaId}` : '/polls';
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  votePoll(pollId, optionId) {
    return this.request(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: { optionId },
    });
  }

  getMyPollVote(pollId) {
    return this.request(`/polls/${pollId}/my-vote`, {
      method: 'GET',
    });
  }

  // Public Config & Bootstrap (White-Label Config)
  getConfig() {
    return this.request('/config', {
      method: 'GET',
    });
  }

  getPublicConfig() {
    return this.request('/config', {
      method: 'GET',
    });
  }

  getAreaTree() {
    return this.request('/areas/tree', {
      method: 'GET',
    });
  }

  getAreaLevels() {
    return this.request('/areas/levels', {
      method: 'GET',
    });
  }

  getAreasByLevel(levelId) {
    return this.request(`/areas/by-level/${levelId}`, {
      method: 'GET',
    });
  }

  getAreaChildren(areaId) {
    return this.request(`/areas/${areaId}/children`, {
      method: 'GET',
    });
  }

  // Banners & Promotional Slides (Dynamic Home Slider)
  getBanners() {
    return this.request('/banners', {
      method: 'GET',
    });
  }

  // About Leader Profile
  getAboutLeader() {
    return this.request('/about-leader', {
      method: 'GET',
    });
  }

  // Development Works / Vikas Karya
  getWorks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/works${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  getWorkById(id) {
    return this.request(`/works/${id}`, {
      method: 'GET',
    });
  }

  // File / Media Uploads
  uploadFiles(module = 'complaints', files = []) {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append('files', file));
    } else if (files) {
      formData.append('files', files);
    }
    return this.request(`/uploads/${module}`, {
      method: 'POST',
      body: formData,
    });
  }

  // Complaints / Jan Samasya
  getComplaintCategories() {
    return this.request('/complaints/categories', {
      method: 'GET',
    });
  }

  createComplaint(data) {
    return this.request('/complaints', {
      method: 'POST',
      body: data,
    });
  }

  getMyComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/complaints/my${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  getComplaintById(id) {
    return this.request(`/complaints/${id}`, {
      method: 'GET',
    });
  }

  // Events & Rallies
  getEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/events${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  getEventById(id) {
    return this.request(`/events/${id}`, {
      method: 'GET',
    });
  }

  rsvpEvent(id, status) {
    return this.request(`/events/${id}/rsvp`, {
      method: 'POST',
      body: { status },
    });
  }

  // Notifications (Tenant scoped & User scoped)
  getMyNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/notifications/my${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  getNotificationUnreadCount() {
    return this.request('/notifications/unread-count', {
      method: 'GET',
    });
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // News / Blogs / Updates
  getNews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/news${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  getNewsById(id) {
    return this.request(`/news/${id}`, {
      method: 'GET',
    });
  }

  getNewsCategories() {
    return this.request('/news/categories', {
      method: 'GET',
    });
  }

  // Manifesto & Vision
  getManifesto(category) {
    const endpoint = category ? `/manifesto?category=${encodeURIComponent(category)}` : '/manifesto';
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  getManifestoCategories() {
    return this.request('/manifesto/categories', {
      method: 'GET',
    });
  }

  // Photo & Video Gallery
  getGallery(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/gallery${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  // Volunteers Management
  applyVolunteer(data) {
    return this.request('/volunteers', {
      method: 'POST',
      body: data,
    });
  }

  getMyVolunteerProfile() {
    return this.request('/volunteers/my', {
      method: 'GET',
    });
  }

  // Festival Poster Generator
  getPosterTemplates(category) {
    const endpoint = category && category !== 'All' ? `/poster-generator/templates?category=${encodeURIComponent(category)}` : '/poster-generator/templates';
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  getPosterCategories() {
    return this.request('/poster-generator/templates/categories', {
      method: 'GET',
    });
  }

  generatePoster(templateId, formData) {
    return this.request(`/poster-generator/generate/${templateId}`, {
      method: 'POST',
      body: formData,
    });
  }

  getMyGeneratedPosters() {
    return this.request('/poster-generator/my-posters', {
      method: 'GET',
    });
  }
}

export const api = new ApiClient();
