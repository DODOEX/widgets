import { create } from 'zustand';

interface Notify {
  message: string;
  type: 'success' | 'error' | 'warning';
  timeout?: number;
  content?: string;
  link?: {
    text: string;
    outerLink?: string;
  };
}

interface MessageState {
  notify: Notify | null;
  toast: (notify: Notify) => void;
  close: () => void;
}

export const useMessageState = create<MessageState>((set) => ({
  notify: null,
  toast: (notify) => {
    set({
      notify,
    });
  },
  close: () => {
    set({
      notify: null,
    });
  },
}));
