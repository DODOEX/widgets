import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token';

export const useDefaultStakeToken = ({
  setStakeToken,
  defaultStakeTokenAddress,
}: {
  setStakeToken: (token: TokenInfo) => void;
  defaultStakeTokenAddress?: string;
}) => {
  const queryClient = useQueryClient();
  const { account, chainId } = useWalletInfo();

  useEffect(() => {
    const getDefaultToken = async () => {
      if (!defaultStakeTokenAddress) {
        return;
      }
      const defaultSaveAToken = await queryClient.fetchQuery({
        ...tokenApi.getFetchTokenQuery(
          chainId,
          String(defaultStakeTokenAddress).toLowerCase(),
          account,
        ),
      });
      if (!defaultSaveAToken) {
        return;
      }
      setStakeToken(defaultSaveAToken as TokenInfo);
    };
    getDefaultToken();
  }, [account, chainId, defaultStakeTokenAddress, queryClient, setStakeToken]);
};
