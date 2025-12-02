import { z } from 'zod';

export const createRoomSchema = z.object({
  RoomName: z
    .string()
    .min(1, 'Room name is required')
    .max(500, 'Room name must be 1-500 characters'),
  RoomType: z.string().min(1, 'Room type is required'),
  BedsCount: z
    .string()
    .min(1, 'Beds count is required')
    .refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 100;
    }, 'Beds count must be between 1 and 100'),
  Sqft: z
    .string()
    .min(1, 'Square footage is required')
    .refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 5 && num <= 10000;
    }, 'Square footage must be between 5 and 10000'),
  Facilities: z.array(z.string()).min(1, 'At least one facility is required'),
  FeatureImage: z
    .union([z.instanceof(File), z.undefined()])
    .refine(file => file instanceof File && file.size > 0, 'Feature image is required'),
  GalleryImages: z.array(z.instanceof(File)),
  NumberOfRooms: z
    .string()
    .min(1, 'Number of rooms is required')
    .refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1;
    }, 'Number of rooms must be at least 1'),
});

export const updateRoomSchema = z.object({
  RoomName: z
    .string()
    .min(1, 'Room name is required')
    .max(500, 'Room name must be 1-500 characters')
    .optional(),
  RoomType: z.string().min(1, 'Room type is required').optional(),
  BedsCount: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1 && num <= 100;
      },
      { message: 'Beds count must be between 1 and 100' },
    ),
  Sqft: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 5 && num <= 10000;
      },
      { message: 'Square footage must be between 5 and 10000' },
    ),
  Facilities: z.array(z.string()).optional(),
  FeatureImage: z.union([z.instanceof(File), z.undefined()]).optional(),
  GalleryImages: z.array(z.instanceof(File)),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type UpdateRoomFormData = z.infer<typeof updateRoomSchema>;
