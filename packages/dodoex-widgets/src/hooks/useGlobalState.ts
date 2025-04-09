import { ChainId } from '@dodoex/api';
import { create } from 'zustand';

export enum ContractStatus {
  Initial = 'Initial',
  Pending = 'Pending',
  ApproveSuccess = 'ApproveSuccess',
  TxSuccess = 'TxSuccess',
  Failed = 'Failed',
}
interface GlobalState {
  fromTokenChainId?: ChainId;
  latestBlockNumber: number;
  openConnectWalletInfo:
    | boolean
    | {
        /** Wallet is connected, chainID needs to be switched */
        chainId?: ChainId;
      };
  contractStatus?: ContractStatus;
  autoConnectLoading?: boolean; // default: undefined
  showCoingecko?: boolean;
  /** source: props.getAutoSlippage */
  autoSlippage?: {
    loading: boolean;
    value: number | null;
  };
  slippage: string | null;
}

export const useGlobalState = create<GlobalState>((set) => ({
  fromTokenChainId: undefined,
  latestBlockNumber: 0,
  openConnectWalletInfo: false,
  slippage: null,
}));

export function setContractStatus(value: GlobalState['contractStatus']) {
  useGlobalState.setState({
    contractStatus: value,
  });
}
export function setAutoConnectLoading(
  value: GlobalState['autoConnectLoading'],
) {
  useGlobalState.setState({
    autoConnectLoading: value,
  });
}
export function setAutoSlippage(value: GlobalState['autoSlippage']) {
  useGlobalState.setState({
    autoSlippage: value,
  });
}
export function setAutoSlippageLoading(loading: boolean) {
  useGlobalState.setState((prev) => ({
    autoSlippage: {
      loading,
      value: prev.autoSlippage?.value ?? null,
    },
  }));
}
export function setSlippage(value: GlobalState['slippage']) {
  useGlobalState.setState({
    slippage: value,
  });
}
