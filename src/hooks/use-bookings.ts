'use client';

import { bookingsAPI } from '@/lib/api/bookings';
import type { RejectBookingRequest } from '@/lib/types/booking';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await bookingsAPI.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
      return response.data?.bookings || [];
    },
  });
};

export const useBookingEnumValues = () => {
  return useQuery({
    queryKey: ['booking-enum-values'],
    queryFn: async () => {
      const response = await bookingsAPI.getEnumValues();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch booking enum values');
      }
      return response.data?.enumValues || [];
    },
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await bookingsAPI.approve(bookingId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to approve booking');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      data,
    }: {
      bookingId: number;
      data?: RejectBookingRequest;
    }) => {
      const response = await bookingsAPI.reject(bookingId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to reject booking');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
