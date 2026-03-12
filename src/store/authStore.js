import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: {
    id: 'u-001',
    username: '谷岡 佑馬', // 仮のログインユーザー
  },
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));
