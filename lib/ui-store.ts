"use client";

import { create } from "zustand";

interface UIState {
  isImmersiveMode: boolean;
  isFocusMode: boolean;
  setImmersiveMode: (value: boolean) => void;
  toggleImmersiveMode: () => void;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isImmersiveMode: false,
  isFocusMode: false,
  setImmersiveMode: (value) => set({ isImmersiveMode: value }),
  toggleImmersiveMode: () => set((state) => ({ isImmersiveMode: !state.isImmersiveMode })),
  setFocusMode: (value) => set({ isFocusMode: value }),
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
}));
