import type {
  CreateRoomRequest,
  RoomResponse,
  RoomsResponse,
  UpdateRoomRequest,
} from '@/lib/types/room';
import { callAPI } from '@/lib/utils/config';

const LANG = 'en';

export const roomsAPI = {
  getAll: async () => {
    return callAPI<RoomsResponse>('GET', `/api/${LANG}/rooms/me`);
  },

  getById: async (roomId: number) => {
    return callAPI<RoomResponse>('GET', `/api/${LANG}/rooms/${roomId}`);
  },

  create: async (data: CreateRoomRequest) => {
    const formData = new FormData();

    formData.append('RoomName', data.RoomName);
    formData.append('RoomType', data.RoomType);
    formData.append('BedsCount', data.BedsCount);
    formData.append('Sqft', data.Sqft);
    formData.append('NumberOfRooms', data.NumberOfRooms);

    // Append facilities
    data.Facilities.forEach((facility, index) => {
      formData.append(`Facilities[${index}]`, facility);
    });

    // Append feature image
    if (data.FeatureImage) {
      formData.append('FeatureImage', data.FeatureImage);
    }

    // Append gallery images
    if (data.GalleryImages && data.GalleryImages.length > 0) {
      data.GalleryImages.forEach(image => {
        formData.append('GalleryImages', image);
      });
    }

    return callAPI<RoomResponse>('POST', `/api/${LANG}/rooms`, formData, undefined, true);
  },

  update: async (roomId: number, data: UpdateRoomRequest) => {
    const formData = new FormData();

    if (data.RoomName) formData.append('RoomName', data.RoomName);
    if (data.RoomType) formData.append('RoomType', data.RoomType);
    if (data.BedsCount) formData.append('BedsCount', data.BedsCount);
    if (data.Sqft) formData.append('Sqft', data.Sqft);

    // Append facilities if provided
    if (data.Facilities && data.Facilities.length > 0) {
      data.Facilities.forEach((facility, index) => {
        formData.append(`Facilities[${index}]`, facility);
      });
    }

    // Append feature image if provided
    if (data.FeatureImage) {
      formData.append('FeatureImage', data.FeatureImage);
    }

    // Append gallery images if provided
    if (data.GalleryImages && data.GalleryImages.length > 0) {
      data.GalleryImages.forEach(image => {
        formData.append('GalleryImages', image);
      });
    }

    return callAPI<RoomResponse>('PUT', `/api/${LANG}/rooms/${roomId}`, formData, undefined, true);
  },

  delete: async (roomId: number) => {
    return callAPI<{ message: string }>('DELETE', `/api/${LANG}/rooms/${roomId}`);
  },
};
