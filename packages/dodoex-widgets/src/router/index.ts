import { create } from 'zustand';
import { Page } from './types';

export { PageType } from './types';
export type { Page } from './types';

interface RouterState {
  page?: Page;
  historyList: Array<Page>;

  push: (page: Page) => void;
  back: () => void;
}

export const useRouterStore = create<RouterState>((set, get) => ({
  page: undefined,
  historyList: [],
  push: (page: Page) => {
    set((oldState) => {
      return {
        page,
        historyList: [...oldState.historyList, page],
      };
    });
  },
  back: () => {
    set((oldState) => {
      const len = oldState.historyList.length;
      if (!len) {
        if (typeof window !== 'undefined' && window.history) {
          history.back();
        }
        return oldState;
      }
      const newHistoryList = [...oldState.historyList];
      const deletePage = newHistoryList.splice(len - 1, 1);
      return {
        page: deletePage[0],
        historyList: newHistoryList,
      };
    });
  },
}));
