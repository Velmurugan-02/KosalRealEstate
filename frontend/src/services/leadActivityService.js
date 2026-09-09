import api from './api';

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    leadId: 1,
    type: 'SITE_VISIT',
    typeLabel: 'Site Visit Completed',
    author: 'Neha S.',
    role: 'Sales Rep',
    time: 'Today, 11:30 AM',
    description: 'Showed Tower B, Flat 402. Client loved the Vastu compliant kitchen. Budget is flexible.',
  },
  {
    id: 2,
    leadId: 1,
    type: 'CALL',
    typeLabel: 'Discount Discussed',
    author: 'Rajesh K.',
    role: 'Manager',
    time: 'Yesterday, 04:00 PM',
    description: 'Approved 2% waiver on base price if booking is confirmed before Diwali.',
  },
  {
    id: 3,
    leadId: 1,
    type: 'CALL',
    typeLabel: 'Initial Connect Call',
    author: 'Neha S.',
    role: 'Sales Rep',
    time: '16 Oct 2024',
    description: 'Introduction call completed. Client is looking for 3 BHK ready-to-move in Noida.',
  },
];

let localActivities = [...DEFAULT_ACTIVITIES];

export const leadActivityService = {
  // GET /api/leads/{leadId}/activities
  getActivities: async (leadId) => {
    try {
      const res = await api.get(`/api/leads/${leadId}/activities`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return localActivities.filter((a) => String(a.leadId) === String(leadId) || !a.leadId);
    } catch {
      return localActivities;
    }
  },

  // POST /api/leads/{leadId}/activities
  addActivity: async (leadId, activityData) => {
    try {
      const res = await api.post(`/api/leads/${leadId}/activities`, activityData);
      return res.data;
    } catch {
      const newAct = {
        id: Date.now(),
        leadId,
        type: activityData.type || 'NOTE',
        typeLabel: activityData.type === 'SITE_VISIT' ? 'Site Visit Completed' : 'Note Added',
        author: 'Neha S.',
        role: 'Sales Rep',
        time: 'Just now',
        description: activityData.description,
      };
      localActivities.unshift(newAct);
      return newAct;
    }
  },
};

export default leadActivityService;
