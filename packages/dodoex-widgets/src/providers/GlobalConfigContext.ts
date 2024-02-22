import { createContext, useContext } from 'react';

export interface GlobalFunctionConfig {
  /** If true is returned, the default wallet connection logic will not be executed */
  onConnectWalletClick?: () => boolean | Promise<boolean>;
}

// Passing widget config
export const GlobalConfigContext = createContext<GlobalFunctionConfig>({
  onConnectWalletClick: undefined,
});

export const useGlobalConfig = () => {
  return useContext(GlobalConfigContext);
};
