'use client';

import { roomsAPI } from '@/lib/api/rooms';
import type { CreateRoomRequest, UpdateRoomRequest } from '@/lib/types/room';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await roomsAPI.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch rooms');
      }
      return response.data?.rooms || [];
    },
  });
};

export const useRoom = (roomId: number | null) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      if (!roomId) return null;
      const response = await roomsAPI.getById(roomId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch room');
      }
      return response.data?.room || null;
    },
    enabled: !!roomId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      const response = await roomsAPI.create(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create room');
      }
      return response.data?.room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, data }: { roomId: number; data: UpdateRoomRequest }) => {
      const response = await roomsAPI.update(roomId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update room');
      }
      return response.data?.room;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', variables.roomId] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: number) => {
      const response = await roomsAPI.delete(roomId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete room');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};







