import api from './api';
import propertyService from './propertyService';

const DEFAULT_BOOKINGS = [
  {
    id: 101,
    leadId: 3,
    leadName: 'Vikram Singh',
    unitId: 1,
    unitNumber: 'Unit 1205',
    buildingName: 'Tower B',
    projectName: 'Kosal Heights',
    bookedById: 1,
    bookedByName: 'Rajesh Sharma',
    bookingAmount: 1800000,
    status: 'CONFIRMED',
    bookingDate: '2024-10-26T14:30:00',
  },
  {
    id: 102,
    leadId: 1,
    leadName: 'Amit Sharma',
    unitId: 4,
    unitNumber: 'Unit 801',
    buildingName: 'Tower A',
    projectName: 'Kosal Heights',
    bookedById: 2,
    bookedByName: 'Neha S.',
    bookingAmount: 1200000,
    status: 'CONFIRMED',
    bookingDate: '2024-10-20T11:00:00',
  },
];

let localBookings = [...DEFAULT_BOOKINGS];

export const bookingService = {
  // GET /api/bookings
  getAllBookings: async () => {
    try {
      const res = await api.get('/api/bookings');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return localBookings;
    } catch {
      return localBookings;
    }
  },

  // GET /api/bookings/{id}
  getBookingById: async (id) => {
    try {
      const res = await api.get(`/api/bookings/${id}`);
      return res.data;
    } catch {
      return localBookings.find((b) => String(b.id) === String(id)) || localBookings[0];
    }
  },

  // POST /api/bookings
  createBooking: async (bookingData) => {
    // 1. Strict Duplicate Booking Prevention
    const isAlreadyAvailable = propertyService.isUnitAvailable(bookingData.unitId);
    if (!isAlreadyAvailable) {
      return {
        success: false,
        conflict: true,
        error: 'Conflict 409: This unit is already BOOKED or LOCKED. Duplicate bookings are not allowed.',
      };
    }

    try {
      const res = await api.post('/api/bookings', bookingData);
      localBookings.unshift(res.data);
      // Lock unit in property inventory
      propertyService.markUnitBooked(bookingData.unitId);
      return { success: true, data: res.data };
    } catch (error) {
      if (error.response?.status === 409) {
        // Lock unit locally as well
        propertyService.markUnitBooked(bookingData.unitId);
        return {
          success: false,
          conflict: true,
          error:
            error.response.data?.message ||
            'Unit is already reserved or booked by another agent.',
        };
      }

      // Demo fallback success
      const newBooking = {
        id: Date.now(),
        leadId: bookingData.leadId,
        leadName: bookingData.leadName || 'Customer Lead',
        unitId: bookingData.unitId,
        unitNumber: bookingData.unitNumber || '4B-302',
        buildingName: bookingData.buildingName || 'Tower B',
        projectName: bookingData.projectName || 'Emerald Heights',
        bookedByName: 'Rajesh Sharma',
        bookingAmount: bookingData.bookingAmount || 7850000,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString(),
      };

      // Immediately lock unit to prevent duplicate booking!
      propertyService.markUnitBooked(bookingData.unitId);
      localBookings.unshift(newBooking);

      return { success: true, data: newBooking };
    }
  },
};

export default bookingService;
