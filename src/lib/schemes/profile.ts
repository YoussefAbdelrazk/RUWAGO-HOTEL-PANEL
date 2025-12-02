import { z } from 'zod';

export const updateProfileSchema = z.object({
  hotelName: z.string().min(1, 'Hotel name is required').max(500).optional(),
  description: z.string().max(2000).optional(),
  location: z.string().max(500).optional(),
  additionalEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  mobile: z.string().min(1, 'Mobile is required').max(20).optional(),
  additionalMobile: z.string().max(20).optional().or(z.literal('')),
  nearestAirportName: z.string().max(200).optional().or(z.literal('')),
  nearestAirportKm: z
    .number()
    .min(0, 'Distance must be positive')
    .max(10000, 'Distance must be reasonable')
    .optional(),
  twoFAEnabled: z.boolean().optional(),
  isDisabled: z.boolean().optional(),
  facilityIds: z.array(z.number()).optional(),
});

export const changeEmailInitiateSchema = z.object({
  newEmail: z.string().email('Invalid email format').min(1, 'Email is required'),
});

export const verifyEmailChangeSchema = z.object({
  newEmail: z.string().email('Invalid email format').min(1, 'Email is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangeEmailInitiateFormData = z.infer<typeof changeEmailInitiateSchema>;
export type VerifyEmailChangeFormData = z.infer<typeof verifyEmailChangeSchema>;

