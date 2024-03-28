import { createContext, useContext } from 'react';
import { TokenInfo } from '../hooks/Token';

export interface GlobalFunctionConfig {
  widgetRef?: React.RefObject<HTMLDivElement>;
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
  /** When the token balance is insufficient, users can purchase or swap callbacks */
  gotoBuyToken?: (params: { token: TokenInfo; account: string }) => void;
}

// Passing widget config
export const GlobalConfigContext = createContext<GlobalFunctionConfig>({
  onConnectWalletClick: undefined,
  gotoBuyToken: undefined,
});

export const useGlobalConfig = () => {
  return useContext(GlobalConfigContext);
};
