import React from 'react';
import { create } from 'zustand';

interface Notify {
  message: string;
  type: 'success' | 'error' | 'warning';
  timeout?: number;
  content?: string;
  link?: {
    text: React.ReactNode;
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
