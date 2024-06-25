import { create } from 'zustand';
import { Page, PageType } from './types';

interface RouterState {
  page?: Page;
  historyList: Array<Page>;

  push: (page: Page) => void;
  back: () => void;
}

export const useRouterStore = create<RouterState>((set, get) => ({
  // page: {
  //   type: PageType.PoolDetail,
  //   params: {
  //     address: '0xc9f93163c99695c6526b799ebca2207fdf7d61ad',
  //     chainId: 1,
  //   },
  // },
  // page: undefined,
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
