// src/services/authService.ts
import api from '@/lib/axios';
import {
  LoginPayload,
  RegisterPayload,
  OTPPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/user.types';

// Backend returns flat shapes: { success, message, ... }
// NOT wrapped in a `data` property

export const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await api.post('/auth/register', payload);
    return res.data; // { success, message }
  },

  verifyOTP: async (payload: OTPPayload) => {
    const res = await api.post('/auth/verify-otp', payload);
    return res.data; // { success, accessToken, refreshToken, user }
  },

  login: async (payload: LoginPayload) => {
    const res = await api.post('/auth/login', payload);
    return res.data; // { success, accessToken, refreshToken, user }
  },

  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await api.post('/auth/forgot-password', payload);
    return res.data; // { success, message }
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await api.post('/auth/reset-password', payload);
    return res.data; // { success, message }
  },

  refreshToken: async (refreshToken: string) => {
    const res = await api.post('/auth/refresh-token', { refreshToken });
    return res.data; // { success, accessToken }
  },
};
