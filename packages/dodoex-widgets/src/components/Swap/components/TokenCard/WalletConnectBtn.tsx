import { Box, Tooltip } from '@dodoex/components';
import { useMemo } from 'react';
import { chainListMap } from '../../../../constants/chainList';
import { useAppKitAccountByChainId } from '../../../../hooks/ConnectWallet/useAccountByChainId';
import { TokenInfo } from '../../../../hooks/Token/type';
import { namespaceToTitle, truncatePoolAddress } from '../../../../utils';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export interface Props {
  token: TokenInfo;
  enterAddressEnabled?: boolean;
}

export const WalletConnectBtn = ({
  token,
  enterAddressEnabled = false,
}: Props) => {
  const targetChainId = token.chainId;

  const { disconnect } = useWalletInfo();

  const { appKitAccount, account, namespace, targetCaipNetwork } =
    useAppKitAccountByChainId(targetChainId);

  const chain = useMemo(() => {
    return chainListMap.get(targetChainId);
  }, [targetChainId]);

  if (!appKitAccount?.isConnected) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          px: 4,
          py: 2,
          borderRadius: 4,
          backgroundColor: 'background.tag',
          typography: 'h6',
          lineHeight: '16px',
        }}
      >
        Wallet address:{truncatePoolAddress(account)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M3.33301 10.0698L4.42967 11.1665L7.99967 7.60428L11.5697 11.1665L12.6663 10.0698L7.99967 5.40317L3.33301 10.0698Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
        </svg>
      </Box>
    );
  }

  return (
    <Tooltip
      arrow={false}
      leaveDelay={300}
      placement="bottom-end"
      onlyClick
      title={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Box
            sx={{
              typography: 'h6',
              lineHeight: '16px',
              color: 'text.secondary',
            }}
          >
            Connected({namespaceToTitle(targetChainId)})
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              px: 8,
              py: 8,
              color: 'text.primary',
              borderRadius: 8,
              backgroundColor: 'background.paperContrast',
              typography: 'body2',
              lineHeight: '19px',
            }}
          >
            {chain && (
              <Box
                component={chain.logo}
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            )}
            {truncatePoolAddress(account)}

            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                disconnect({
                  namespace,
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 2.25H9.75V9.75H8.25V2.25ZM12.3075 4.94244L13.3725 3.87744C14.8275 5.11494 15.75 6.94494 15.75 8.99994C15.75 12.7274 12.7275 15.7499 9 15.7499C5.2725 15.7499 2.25 12.7274 2.25 8.99994C2.25 6.94494 3.1725 5.11494 4.6275 3.87744L5.685 4.93494C4.5075 5.89494 3.75 7.35744 3.75 8.99994C3.75 11.9024 6.0975 14.2499 9 14.2499C11.9025 14.2499 14.25 11.9024 14.25 8.99994C14.25 7.35744 13.4925 5.89494 12.3075 4.94244Z"
                  fill="#FF4646"
                />
              </svg>
            </Box>
          </Box>
          {enterAddressEnabled && (
            <>
              <Box
                sx={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: 'border.main',
                }}
              />
              <Box
                sx={{
                  p: 8,
                  cursor: 'pointer',
                  typography: 'body2',
                  lineHeight: '19px',
                  color: 'text.primary',
                  '&:hover': {
                    borderRadius: 8,
                    backgroundColor: 'background.paperContrast',
                  },
                }}
                onClick={() => {
                  //
                }}
              >
                Enter receive address
              </Box>
            </>
          )}
        </Box>
      }
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          px: 4,
          py: 2,
          borderRadius: 4,
          backgroundColor: 'background.tag',
          typography: 'h6',
          lineHeight: '16px',
        }}
      >
        {chain && (
          <Box
            component={chain.logo}
            sx={{
              width: 16,
              height: 16,
            }}
          />
        )}
        {truncatePoolAddress(account)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M12.667 6.93016L11.5703 5.8335L8.00033 9.39572L4.43033 5.8335L3.33366 6.93016L8.00033 11.5968L12.667 6.93016Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
        </svg>
      </Box>
    </Tooltip>
  );
};
