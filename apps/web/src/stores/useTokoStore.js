import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useTokoStore = create(
  persist(
    (set) => ({
      toko: null,
      loading: false,
      fetchProfil: async () => {
        set({ loading: true });
        try {
          const res = await api.get('/toko');
          set({ toko: res.data.data, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },
      updateProfil: (data) => set({ toko: { ...data } }),
    }),
    {
      name: 'toko-storage',
    }
  )
);
