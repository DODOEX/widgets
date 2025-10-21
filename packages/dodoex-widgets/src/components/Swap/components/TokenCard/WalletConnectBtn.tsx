import { Box, Popup } from '@dodoex/components';
import { ConnectModal } from '@mysten/dapp-kit';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { chainListMap } from '../../../../constants/chainList';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token/type';
import { namespaceToTitle, truncatePoolAddress } from '../../../../utils';
import { ReceiveAddressInputModal } from '../ReceiveAddressInputModal';

export interface Props {
  token: TokenInfo;
  enterAddressEnabled?: boolean;
  inputToAddress: string | null;
  setInputToAddress: Dispatch<SetStateAction<string | null>>;
  account: ReturnType<
    ReturnType<typeof useWalletInfo>['getAppKitAccountByChainId']
  >;
}

export const WalletConnectBtn = ({
  token,
  enterAddressEnabled = false,
  inputToAddress,
  setInputToAddress,
  account,
}: Props) => {
  const targetChainId = token.chainId;

  const { open, disconnect, suiConnectModalOpen, setSuiConnectModalOpen } =
    useWalletInfo();

  const [isReceiveAddressInputModalOpen, setIsReceiveAddressInputModalOpen] =
    useState(false);

  const chain = useMemo(() => {
    return chainListMap.get(targetChainId);
  }, [targetChainId]);

  const inputToAddressWalletIcon = (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.001 6.3667C12.7373 6.3667 13.3339 6.9634 13.334 7.69971V9.03369H10.1338C9.54481 9.03383 9.06738 9.51108 9.06738 10.1001C9.06751 10.689 9.54488 11.1664 10.1338 11.1665H13.334V12.4995C13.334 13.2359 12.7374 13.8335 12.001 13.8335H4.00098C3.2646 13.8335 2.66797 13.2359 2.66797 12.4995V7.69971C2.66806 6.9634 3.26465 6.3667 4.00098 6.3667H12.001Z"
        fill="currentColor"
      />
      <ellipse
        cx="10.1349"
        cy="10.1002"
        rx="0.533334"
        ry="0.533333"
        fill="currentColor"
      />
      <path
        d="M8.54243 3.63688C9.14948 3.36708 9.86253 3.5853 10.2146 4.14863L10.9341 5.29984H4.80078L8.54243 3.63688Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <>
      <Popup
        triggerChildren={
          account?.appKitAccount?.isConnected ? (
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
              {inputToAddressWalletIcon}
              {truncatePoolAddress(account?.appKitAccount?.address)}
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
          ) : (
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
              Wallet address:
              {truncatePoolAddress(account?.appKitAccount?.address)}
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
          )
        }
        titleSx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
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
          {account?.appKitAccount?.isConnected ? (
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
              {inputToAddress
                ? inputToAddressWalletIcon
                : chain && (
                    <Box
                      component={chain.logo}
                      sx={{
                        width: 16,
                        height: 16,
                      }}
                    />
                  )}
              {truncatePoolAddress(account?.appKitAccount?.address)}

              <Box
                sx={{
                  ml: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (inputToAddress) {
                    setInputToAddress(null);
                    return;
                  }
                  disconnect({
                    namespace: account?.namespace,
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
                    fill="#ED4A25"
                  />
                </svg>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: 'border.main',
                }}
              />
              {account?.namespace === 'sui' ? (
                <ConnectModal
                  trigger={
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
                    >
                      Connect a new wallet
                    </Box>
                  }
                  open={suiConnectModalOpen}
                  onOpenChange={(isOpen) => {
                    console.log('walletconnectbtn isOpen', isOpen);
                    setSuiConnectModalOpen(isOpen);
                  }}
                />
              ) : (
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
                    open({ namespace: account?.namespace });
                  }}
                >
                  Connect a new wallet
                </Box>
              )}
            </>
          )}
          {enterAddressEnabled && (
            <>
              {account?.appKitAccount?.isConnected && (
                <Box
                  sx={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: 'border.main',
                  }}
                />
              )}

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
                  setIsReceiveAddressInputModalOpen(true);
                }}
              >
                Enter receive address
              </Box>
            </>
          )}
        </Box>
      </Popup>

      {isReceiveAddressInputModalOpen && (
        <ReceiveAddressInputModal
          open={isReceiveAddressInputModalOpen}
          onClose={() => setIsReceiveAddressInputModalOpen(false)}
          chainId={targetChainId}
          inputToAddress={inputToAddress}
          setInputToAddress={setInputToAddress}
        />
      )}
    </>
  );
};
