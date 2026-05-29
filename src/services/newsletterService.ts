// src/services/newsletterService.ts
import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export const newsletterService = {
  subscribe: async (email: string) => {
    const res = await api.post<ApiResponse<{ message: string }>>('/newsletter/subscribe', {
      email,
    });
    return res.data;
  },
};
