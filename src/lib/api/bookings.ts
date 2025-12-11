import type {
  BookingEnumValuesResponse,
  BookingsResponse,
  RejectBookingRequest,
} from '@/lib/types/booking';
import { callAPI } from '@/lib/utils/config';

const LANG = 'en';

export const bookingsAPI = {
  getAll: async () => {
    return callAPI<BookingsResponse>('GET', `/api/${LANG}/bookings`);
  },

  getEnumValues: async () => {
    return callAPI<BookingEnumValuesResponse>('GET', `/api/${LANG}/bookings/enum-values`);
  },

  approve: async (bookingId: number) => {
    return callAPI<{ message: string }>('PUT', `/api/${LANG}/bookings/${bookingId}/approve`);
  },

  reject: async (bookingId: number, data?: RejectBookingRequest) => {
    return callAPI<{ message: string }>('PUT', `/api/${LANG}/bookings/${bookingId}/reject`, data);
  },
};
