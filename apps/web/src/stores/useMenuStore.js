import { create } from 'zustand';
import api from '../services/api';

export const useMenuStore = create((set) => ({
  menus: [],
  loading: false,
  fetchMenus: async (filters = {}) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      if (filters.kategoriId) params.append('kategoriId', filters.kategoriId);
      if (filters.tersedia !== undefined) params.append('tersedia', filters.tersedia);
      const res = await api.get(`/menu?${params.toString()}`);
      set({ menus: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
}));
