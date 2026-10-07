import { create } from 'zustand';

interface ToastState {
  message: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: null,

  showToast: (message) => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    set({ message });

    hideTimer = setTimeout(() => {
      set({ message: null });
      hideTimer = undefined;
    }, 2500);
  },

  clearToast: () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = undefined;
    }

    set({ message: null });
  },
}));
