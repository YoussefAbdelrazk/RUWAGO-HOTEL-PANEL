export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  hotelName: string;
  description: string;
  location: string;
  email: string;
  additionalEmail?: string;
  mobile: string;
  additionalMobile?: string;
  password: string;
  passwordConfirm: string;
  facilityIds: number[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    hotelName: string;
  };
}

export interface LoginResponse {
  requiresOtp: boolean;
  email?: string;
  cooldownSeconds?: number;
  token?: string;
  hotel?: {
    id: number;
    hotelName: string;
    email: string;
  };
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  token: string;
  hotel: {
    id: number;
    hotelName: string;
    email: string;
  };
}

export interface Facility {
  id: number;
  title: string;
  img: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  cooldownSeconds?: number;
}

export interface VerifyForgotPasswordOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyForgotPasswordOtpResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyRegistrationOtpRequest {
  email: string;
  otp: string;
  hotelName: string;
  description: string;
  location: string;
  additionalEmail?: string;
  mobile: string;
  additionalMobile?: string;
  password: string;
  facilityIds: number[];
}

export interface VerifyRegistrationOtpResponse {
  token: string;
  hotel: {
    id: number;
    hotelName: string;
    email: string;
  };
}
