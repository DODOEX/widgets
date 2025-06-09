import {
  alpha,
  Box,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { getAddress } from '@ethersproject/address';
import { useEffect, useMemo, useState } from 'react';
import { ChainListItem, chainListMap } from '../../../constants/chainList';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { truncatePoolAddress } from '../../../utils/address';
import { namespaceToTitle } from '../../../utils/wallet';
import { CardStatus } from '../../CardWidgets';
import CrossChainOrderList from './CrossChainOrderList';
import SameChainOrderList from './SameChainOrderList';

function TabPanelFlexCol({ sx, ...props }: Parameters<typeof TabPanel>[0]) {
  return (
    <TabPanel
      {...props}
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    />
  );
}

export enum SwapOrderHistoryTab {
  sameChain = 'same-chain',
  crossChain = 'cross-chain',
  errorRefunds = 'error-refunds',
}

export default function SwapOrderHistory() {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const { evmAccount, solanaAccount, bitcoinAccount } = useWalletInfo();

  const [swapOrderHistoryTab, setSwapOrderHistoryTab] = useState(
    SwapOrderHistoryTab.sameChain,
  );
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();

  const tabs = useMemo(() => {
    const result = [
      { key: SwapOrderHistoryTab.sameChain, value: 'Same chain Swaps' },
      {
        key: SwapOrderHistoryTab.crossChain,
        value: 'Cross Chain Swaps',
      },
      {
        key: SwapOrderHistoryTab.errorRefunds,
        value: 'Error Refunds',
      },
    ];
    return result;
  }, []);

  const accountList = useMemo<
    {
      account: string;
      firstChain: ChainListItem;
    }[]
  >(() => {
    const accounts: {
      account: string;
      firstChain: ChainListItem;
    }[] = [];

    if (evmAccount.isConnected && evmAccount.address) {
      const firstChain = chainListMap
        .entries()
        .find(([_, chain]) => chain.isEVMChain)?.[1];

      if (firstChain) {
        accounts.push({
          account: getAddress(evmAccount.address),
          firstChain,
        });
      }
    }

    if (solanaAccount.isConnected && solanaAccount.address) {
      const firstChain = chainListMap
        .entries()
        .find(([_, chain]) => chain.isSolanaChain)?.[1];

      if (firstChain) {
        accounts.push({
          account: solanaAccount.address,
          firstChain,
        });
      }
    }

    if (bitcoinAccount.isConnected && bitcoinAccount.address) {
      const firstChain = chainListMap
        .entries()
        .find(([_, chain]) => chain.isBTCChain)?.[1];

      if (firstChain) {
        accounts.push({
          account: bitcoinAccount.address,
          firstChain,
        });
      }
    }

    return accounts;
  }, [
    bitcoinAccount.address,
    bitcoinAccount.isConnected,
    evmAccount.address,
    evmAccount.isConnected,
    solanaAccount.address,
    solanaAccount.isConnected,
  ]);

  useEffect(() => {
    setSelectedAccount((prev) => {
      if (prev) {
        return prev;
      }
      if (accountList.length > 0) {
        return accountList[0].account;
      }
      return undefined;
    });
  }, [accountList]);

  return (
    <Tabs
      value={swapOrderHistoryTab}
      onChange={(_, value) => {
        setSwapOrderHistoryTab(value as SwapOrderHistoryTab);
      }}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        height: 'max-content',
        maxHeight: '100%',
        borderRadius: 16,
        backgroundColor: 'background.skeleton',
        backdropFilter: 'blur(4px)',
        [theme.breakpoints.up('laptop')]: {},
      }}
      className={isMobile ? undefined : 'gradient-card-border'}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          px: 16,
          pt: 20,
          [theme.breakpoints.up('laptop')]: {
            px: 24,
          },
        }}
      >
        <TabsGroup
          tabs={tabs}
          variant="default"
          tabsListSx={{
            justifyContent: 'space-between',
            borderBottomWidth: 0,
          }}
          tabSx={{
            mr: 28,
            typography: 'body2',
            lineHeight: '19px',
            minHeight: 39,
            padding: '0px 0px 20px 0px',
            [theme.breakpoints.up('laptop')]: {
              typography: 'body1',
              lineHeight: '22px',
              minHeight: 42,
            },
          }}
        />
      </Box>
      <Box
        sx={{
          px: 16,
          py: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          overflowX: 'auto',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'border.main',
          [theme.breakpoints.up('laptop')]: {
            px: 24,
          },
        }}
      >
        {accountList.map((account) => {
          const isSelected = selectedAccount === account.account;
          return (
            <Box
              key={account.account}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                pl: 8,
                py: 8,
                pr: 10,
                borderRadius: 4,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                typography: 'body2',
                lineHeight: '19px',
                color: 'text.secondary',
                ...(isSelected && {
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                },
              }}
              onClick={() => {
                setSelectedAccount(account.account);
              }}
            >
              {account.firstChain && (
                <Box
                  component={account.firstChain.logo}
                  sx={{
                    width: 16,
                    height: 16,
                  }}
                />
              )}
              ({namespaceToTitle(account.firstChain.chainId)})
              {truncatePoolAddress(account.account)}
            </Box>
          );
        })}
      </Box>
      {selectedAccount ? (
        <>
          <TabPanelFlexCol
            value={SwapOrderHistoryTab.sameChain}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <SameChainOrderList account={selectedAccount} />
          </TabPanelFlexCol>
          <TabPanelFlexCol
            value={SwapOrderHistoryTab.crossChain}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <CrossChainOrderList account={selectedAccount} />
          </TabPanelFlexCol>
          <TabPanelFlexCol
            value={SwapOrderHistoryTab.errorRefunds}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <CrossChainOrderList
              account={selectedAccount}
              type="error_refund"
            />
          </TabPanelFlexCol>
        </>
      ) : (
        <CardStatus isMobile={isMobile} empty={true} loading={false} />
      )}
    </Tabs>
  );
}
