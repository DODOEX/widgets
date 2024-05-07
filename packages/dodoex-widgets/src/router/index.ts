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
  //   type: PageType.ModifyPool,
  //   params: {
  //     address: '0x4379ab0d36d2e088b40c3d95da654c3418e37ce0',
  //     chainId: 137,
  //   },
  // },
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
