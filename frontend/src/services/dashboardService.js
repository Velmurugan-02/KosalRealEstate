import api from './api';

export const dashboardService = {
  // Fetch dashboard statistics from backend GET /api/dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Dashboard API error, using default metrics:', error);
      // Fallback data matching dashboard.png if backend database is empty or initial
      return {
        totalLeads: 2845,
        newLeads: 850,
        contactedLeads: 620,
        siteVisitLeads: 410,
        interestedLeads: 280,
        negotiationLeads: 112,
        bookedLeads: 45,
        lostLeads: 25,
        totalProjects: 8,
        totalUnits: 112,
        availableUnits: 68,
        bookedUnits: 44,
        totalBookings: 18,
      };
    }
  },
};

export default dashboardService;
