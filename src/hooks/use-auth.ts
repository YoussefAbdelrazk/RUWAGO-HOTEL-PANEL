'use client';

import { setAuthTokens } from '@/lib/actions/auth';
import { authAPI } from '@/lib/api/auth';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyForgotPasswordOtpRequest,
  VerifyOtpRequest,
  VerifyRegistrationOtpRequest,
} from '@/lib/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authAPI.login(data);
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      return response;
    },
    onSuccess: async response => {
      // If 2FA is not enabled, login is complete
      if (
        response.data &&
        !response.data.requiresOtp &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        await setAuthTokens(response.data.accessToken, response.data.refreshToken);
        router.push('/');
      }
      // If 2FA is enabled, we'll show the OTP form (handled in component)
    },
  });
};

export const useVerifyOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      const response = await authAPI.verifyOtp(data);
      if (!response.success) {
        throw new Error(response.message || 'OTP verification failed');
      }
      return response;
    },
    onSuccess: async response => {
      if (response.data?.accessToken && response.data?.refreshToken) {
        await setAuthTokens(response.data.accessToken, response.data.refreshToken);
        router.push('/');
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authAPI.register(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      return response;
      // Note: OTP verification will handle token and redirect
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await authAPI.forgotPassword(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to send reset email');
      }
      return response;
    },
  });
};

export const useVerifyForgotPasswordOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyForgotPasswordOtpRequest) => {
      const response = await authAPI.verifyForgotPasswordOtp(data);
      if (!response.success) {
        throw new Error(response.message || 'OTP verification failed');
      }
      return response;
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await authAPI.resetPassword(data);
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
      return response;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });
};

export const useVerifyRegistrationOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: VerifyRegistrationOtpRequest) => {
      const response = await authAPI.verifyRegistrationOtp(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration OTP verification failed');
      }
      return response;
    },
    onSuccess: async response => {
      if (response.data?.accessToken && response.data?.refreshToken) {
        await setAuthTokens(response.data.accessToken, response.data.refreshToken);
        router.push('/');
      }
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { logout } = await import('@/lib/actions/auth');
    await logout();
    // Clear client-side cookies as well
    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';
    router.push('/login');
  };

  return {
    logout: handleLogout,
  };
};
