import api from './api';

// Initial dummy leads that match leads-list.png in case the database is empty
const INITIAL_DEMO_LEADS = [
  {
    id: 1,
    firstName: 'Amit',
    lastName: 'Sharma',
    phone: '+91 98765 43210',
    email: 'amit.sharma@gmail.com',
    stage: 'SITE_VISIT',
    assignedToName: 'Rajesh K.',
    assignedToId: 1,
    followUpDate: '2024-10-28',
    source: 'MagicBricks',
    createdAt: '2024-10-15T10:30:00',
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Patel',
    phone: '+91 91234 56789',
    email: 'priya.patel@outlook.com',
    stage: 'NEGOTIATION',
    assignedToName: 'Neha S.',
    assignedToId: 2,
    followUpDate: '2024-10-29',
    source: 'Facebook Ads',
    createdAt: '2024-10-16T11:00:00',
  },
  {
    id: 3,
    firstName: 'Vikram',
    lastName: 'Singh',
    phone: '+91 99887 76655',
    email: 'vikram.singh@yahoo.com',
    stage: 'BOOKED',
    assignedToName: 'Rajesh K.',
    assignedToId: 1,
    followUpDate: 'Completed',
    source: 'Direct Walk-in',
    createdAt: '2024-10-12T14:15:00',
  },
  {
    id: 4,
    firstName: 'Rohan',
    lastName: 'Mehta',
    phone: '+91 98223 34455',
    email: 'rohan.mehta@gmail.com',
    stage: 'NEW',
    assignedToName: 'Amit P.',
    assignedToId: 3,
    followUpDate: '2024-10-28',
    source: 'Google Search',
    createdAt: '2024-10-18T09:45:00',
  },
  {
    id: 5,
    firstName: 'Ananya',
    lastName: 'Iyer',
    phone: '+91 95551 12233',
    email: 'ananya.iyer@gmail.com',
    stage: 'INTERESTED',
    assignedToName: 'Neha S.',
    assignedToId: 2,
    followUpDate: '2024-10-30',
    source: 'PropertyWala',
    createdAt: '2024-10-17T16:20:00',
  },
  {
    id: 6,
    firstName: 'Sanjay',
    lastName: 'Gupta',
    phone: '+91 94445 56677',
    email: 'sanjay.g@guptacorp.com',
    stage: 'CONTACTED',
    assignedToName: 'Rajesh K.',
    assignedToId: 1,
    followUpDate: '2024-10-29',
    source: 'Referral',
    createdAt: '2024-10-14T13:00:00',
  },
  {
    id: 7,
    firstName: 'Meera',
    lastName: 'Nair',
    phone: '+91 91112 23344',
    email: 'meera.nair@icloud.com',
    stage: 'LOST',
    assignedToName: 'Amit P.',
    assignedToId: 3,
    followUpDate: '--',
    source: 'MagicBricks',
    createdAt: '2024-10-10T12:00:00',
  },
  {
    id: 8,
    firstName: 'Deepak',
    lastName: 'Verma',
    phone: '+91 93334 45566',
    email: 'deepak.v@gmail.com',
    stage: 'NEGOTIATION',
    assignedToName: 'Neha S.',
    assignedToId: 2,
    followUpDate: '2024-10-28',
    source: 'Housing.com',
    createdAt: '2024-10-16T15:30:00',
  },
];

let localLeads = [...INITIAL_DEMO_LEADS];

export const leadService = {
  // GET /api/leads
  getAllLeads: async () => {
    try {
      const res = await api.get('/api/leads');
      if (Array.isArray(res.data) && res.data.length > 0) {
        localLeads = res.data;
        return res.data;
      }
      return localLeads;
    } catch {
      return localLeads;
    }
  },

  // GET /api/leads/{id}
  getLeadById: async (id) => {
    try {
      const res = await api.get(`/api/leads/${id}`);
      return res.data;
    } catch {
      const found = localLeads.find((l) => String(l.id) === String(id));
      if (found) return found;
      return localLeads[0];
    }
  },

  // POST /api/leads
  createLead: async (leadData) => {
    try {
      const res = await api.post('/api/leads', leadData);
      localLeads.unshift(res.data);
      return res.data;
    } catch {
      const newLead = {
        ...leadData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        assignedToName: leadData.assignedToName || 'Neha S.',
      };
      localLeads.unshift(newLead);
      return newLead;
    }
  },

  // PUT /api/leads/{id}
  updateLead: async (id, leadData) => {
    try {
      const res = await api.put(`/api/leads/${id}`, leadData);
      const index = localLeads.findIndex((l) => String(l.id) === String(id));
      if (index !== -1) localLeads[index] = res.data;
      return res.data;
    } catch {
      const index = localLeads.findIndex((l) => String(l.id) === String(id));
      if (index !== -1) {
        localLeads[index] = { ...localLeads[index], ...leadData };
        return localLeads[index];
      }
      return leadData;
    }
  },

  // DELETE /api/leads/{id}
  deleteLead: async (id) => {
    try {
      await api.delete(`/api/leads/${id}`);
    } catch {
      // ignore
    }
    localLeads = localLeads.filter((l) => String(l.id) !== String(id));
  },

  // GET /api/leads/search?keyword=...
  searchLeads: async (keyword) => {
    try {
      const res = await api.get(`/api/leads/search?keyword=${encodeURIComponent(keyword)}`);
      return res.data;
    } catch {
      const q = keyword.toLowerCase();
      return localLeads.filter(
        (l) =>
          `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q)
      );
    }
  },
};

export default leadService;
