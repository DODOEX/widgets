import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useTokenListDefaultToken } from '../../../../hooks/Token/useTokenListDefaultToken';
import { useRouterStore } from '../../../../router';
import { Page, PageType } from '../../../../router/types';

export default function useDefaultTokens() {
  const { account, chainId } = useWalletInfo();
  const params = useRouterStore(
    (state) => (state.page as Page<PageType.CreatePool> | undefined)?.params,
  );
  return useTokenListDefaultToken({
    chainId,
    account,
    defaultBaseToken: params?.fromAddress
      ? {
          address: params?.fromAddress,
          chainId,
        }
      : undefined,
    defaultQuoteToken: params?.toAddress
      ? {
          address: params?.toAddress,
          chainId,
        }
      : undefined,
  });
}
