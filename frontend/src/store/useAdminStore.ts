// src/store/useAdminStore.ts
import { create } from 'zustand';

interface AdminState {
  isSidebarOpen: boolean;
  activeZone: string | null;
  toggleSidebar: () => void;
  setActiveZone: (zone: string | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isSidebarOpen: true,
  activeZone: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveZone: (zone) => set({ activeZone: zone }),
}));