// src/store/useUIStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  selectedZoneId: string | null;
  toggleSidebar: () => void;
  setSelectedZone: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  selectedZoneId: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedZone: (id) => set({ selectedZoneId: id }),
}));