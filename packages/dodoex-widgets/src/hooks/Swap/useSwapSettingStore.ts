import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_SWAP_DDL } from '../../constants/swap';

export interface CustomSwapPairSlippage {
  account: string;
  from: string;
  to: string;
  /** Should be consistent with fromToken */
  chainId: number;
  // Whether to disable
  disabled?: boolean;
  /** Whether it has been deleted: not necessarily deleted */
  deleted?: boolean;
  // Slippage: 5% => 5
  slippage: string;
  fromSymbol: string;
  fromLogo: string | null;
  toSymbol: string;
  toLogo: string | null;
  // Recommended automatic slippage
  recommend: string;
}

interface SwapSettingState {
  slippageAdvanced: boolean;
  customSwapPairSlippages: Array<CustomSwapPairSlippage>;
  notRemindAgainSlippageHigher: boolean;
  notRemindAgainSlippageLower: boolean;
  ddl: string;
  expertMode: boolean;
  disableIndirectRouting: boolean;
}

export const useSwapSettingStore = create(
  persist<SwapSettingState>(
    (set) => ({
      slippageAdvanced: false,
      notRemindAgainSlippageHigher: false,
      notRemindAgainSlippageLower: false,
      customSwapPairSlippages: [],
      ddl: String(DEFAULT_SWAP_DDL),
      expertMode: false,
      disableIndirectRouting: false,
    }),
    {
      name: 'dodo-widgets-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
