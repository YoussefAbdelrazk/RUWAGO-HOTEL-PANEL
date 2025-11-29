'use client';

import type {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyForgotPasswordOtpRequest,
  VerifyForgotPasswordOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyRegistrationOtpRequest,
  VerifyRegistrationOtpResponse,
} from '@/lib/types/auth';
import { callClientAPI } from '@/lib/utils/client-api';

const LANG = 'en';

export const authAPI = {
  login: async (data: LoginRequest) => {
    return callClientAPI<LoginResponse>('POST', `/api/${LANG}/auth/login`, data);
  },

  register: async (data: RegisterRequest) => {
    return callClientAPI<AuthResponse>('POST', `/api/${LANG}/auth/register`, data);
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    return callClientAPI<VerifyOtpResponse>('POST', `/api/${LANG}/auth/verify-otp`, data);
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    return callClientAPI<ForgotPasswordResponse>(
      'POST',
      `/api/${LANG}/forgotpassword/forgot-password`,
      data,
    );
  },

  verifyForgotPasswordOtp: async (data: VerifyForgotPasswordOtpRequest) => {
    return callClientAPI<VerifyForgotPasswordOtpResponse>(
      'POST',
      `/api/${LANG}/forgotpassword/verify-forgot-password-otp`,
      data,
    );
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    return callClientAPI<ResetPasswordResponse>(
      'POST',
      `/api/${LANG}/forgotpassword/reset-password`,
      data,
    );
  },

  verifyRegistrationOtp: async (data: VerifyRegistrationOtpRequest) => {
    return callClientAPI<VerifyRegistrationOtpResponse>(
      'POST',
      `/api/${LANG}/auth/verify-registration-otp`,
      data,
    );
  },
};
