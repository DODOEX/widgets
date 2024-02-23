import { create } from 'zustand';
import { Page } from './types';

interface RouterState {
  page?: Page;

  push: (page: Page) => void;
}

export const useRouterStore = create<RouterState>((set, get) => ({
  page: undefined,
  push: (page: Page) => set({ page }),
}));
