import { useEffect, useReducer } from 'react';
import { initState, reducer, Types, initPriceSettings } from '../reducers';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { basicTokenMap } from '@dodoex/api';

export const useCreateCrowdpoolingState = () => {
  const { account, chainId, onlyChainId } = useWalletInfo();
  const [state, dispatch] = useReducer(reducer, {
    ...initState,
    priceSettings: {
      ...initPriceSettings,
    },
  });

  useEffect(() => {
    const chainIdResult = onlyChainId ?? chainId;
    if (chainIdResult !== undefined) {
      const token = basicTokenMap[chainIdResult];
      dispatch({
        type: Types.UpdatePriceSettings,
        payload: {
          baseToken: null,
          quoteToken: token,
        },
      });
    }
  }, [chainId, onlyChainId]);

  return {
    state,
    dispatch,
    account,
  };
};
