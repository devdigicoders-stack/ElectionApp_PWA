// Storage Service for Vidyak PWA
// Manages local state safely without hardcoded mock seed data

const KEYS = {
  TOKEN: 'token',
  USER: 'pwa_user_profile',
  TENANT_SLUG: 'tenant_slug',
  COMPLAINTS: 'pwa_complaints',
  POLLS: 'pwa_polls',
  VOTED_POLLS: 'pwa_voted_polls_map',
  MEMBERSHIPS: 'pwa_memberships',
  VOLUNTEERS: 'pwa_volunteers',
};

export const storage = {
  // User Profile
  getUser: () => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setUser: (userData) => {
    if (userData) {
      localStorage.setItem(KEYS.USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  },

  // Token Management
  getToken: () => {
    return localStorage.getItem(KEYS.TOKEN) || '';
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem(KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(KEYS.TOKEN);
    }
  },

  // Tenant Slug
  getTenantSlug: () => {
    return localStorage.getItem(KEYS.TENANT_SLUG) || '';
  },

  setTenantSlug: (slug) => {
    if (slug) {
      localStorage.setItem(KEYS.TENANT_SLUG, slug);
    } else {
      localStorage.removeItem(KEYS.TENANT_SLUG);
    }
  },

  // Dynamic Complaints Local Store
  getComplaints: () => {
    try {
      const data = localStorage.getItem(KEYS.COMPLAINTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addComplaint: (newComplaint) => {
    const list = storage.getComplaints();
    const updated = [newComplaint, ...list];
    localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(updated));
    return updated;
  },

  // Persistent Poll Votes map ({ [pollId]: { optionId, optionIds } | optionId })
  getVotedPolls: () => {
    try {
      const data = localStorage.getItem(KEYS.VOTED_POLLS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  setVotedPoll: (pollId, voteData) => {
    const map = storage.getVotedPolls();
    map[String(pollId)] = voteData;
    localStorage.setItem(KEYS.VOTED_POLLS, JSON.stringify(map));
  },

  // Dynamic Polls Local Store
  getPolls: () => {
    try {
      const data = localStorage.getItem(KEYS.POLLS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  setPolls: (pollsList) => {
    localStorage.setItem(KEYS.POLLS, JSON.stringify(pollsList || []));
  },

  votePoll: (pollId, voteData) => {
    const selectedIds = Array.isArray(voteData)
      ? voteData
      : (Array.isArray(voteData?.optionIds)
          ? voteData.optionIds
          : (voteData?.optionId ? [voteData.optionId] : [voteData]));
    
    storage.setVotedPoll(pollId, {
      optionId: selectedIds[0] || null,
      optionIds: selectedIds,
    });

    const polls = storage.getPolls();
    const updated = polls.map((poll) => {
      const pId = poll._id || poll.id;
      if (String(pId) === String(pollId)) {
        const total = (poll.totalVotes || 0) + 1;
        const options = (poll.options || []).map((opt) => {
          const optId = String(opt._id || opt.id || opt.optionId);
          const isVoted = selectedIds.includes(optId);
          const votes = isVoted ? (opt.votes || 0) + 1 : (opt.votes || 0);
          return {
            ...opt,
            votes,
            percentage: total > 0 ? Math.round((votes / total) * 100) : 0,
            percent: total > 0 ? Math.round((votes / total) * 100) : 0
          };
        });
        return {
          ...poll,
          totalVotes: total,
          userVoted: selectedIds[0] || null,
          userVotedIds: selectedIds,
          isVoted: true,
          hasVoted: true,
          options
        };
      }
      return poll;
    });
    localStorage.setItem(KEYS.POLLS, JSON.stringify(updated));
    return updated;
  },

  // Dynamic Memberships Store
  getMemberships: () => {
    try {
      const data = localStorage.getItem(KEYS.MEMBERSHIPS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addMembership: (item) => {
    const list = storage.getMemberships();
    const updated = [item, ...list];
    localStorage.setItem(KEYS.MEMBERSHIPS, JSON.stringify(updated));
    return updated;
  },

  // Dynamic Volunteers Store
  getVolunteers: () => {
    try {
      const data = localStorage.getItem(KEYS.VOLUNTEERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addVolunteer: (vol) => {
    const list = storage.getVolunteers();
    const updated = [vol, ...list];
    localStorage.setItem(KEYS.VOLUNTEERS, JSON.stringify(updated));
    return updated;
  },

  // Clear auth session data on logout (keeps persistent device votes intact)
  clear: () => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.COMPLAINTS);
    localStorage.removeItem(KEYS.MEMBERSHIPS);
    localStorage.removeItem(KEYS.VOLUNTEERS);
  }
};
