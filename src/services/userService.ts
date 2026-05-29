// src/services/userService.ts
import api from '@/lib/axios';
import { User, Address, UpdateProfilePayload, AddressPayload } from '@/types/user.types';

// Backend returns flat: { success, user } / { success, addresses } / { success, address }

export const userService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get('/user/profile');
    return res.data.user;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const res = await api.put('/user/profile', payload);
    return res.data.user;
  },

  getAddresses: async (): Promise<Address[]> => {
    const res = await api.get('/user/addresses');
    return res.data.addresses;
  },

  addAddress: async (payload: AddressPayload): Promise<Address> => {
    const res = await api.post('/user/addresses', payload);
    return res.data.address;
  },

  updateAddress: async (id: string, payload: AddressPayload): Promise<Address> => {
    const res = await api.put(`/user/addresses/${id}`, payload);
    return res.data.address;
  },

  deleteAddress: async (id: string) => {
    const res = await api.delete(`/user/addresses/${id}`);
    return res.data;
  },

  setDefaultAddress: async (id: string) => {
    const res = await api.put(`/user/addresses/${id}/set-default`);
    return res.data;
  },
};
