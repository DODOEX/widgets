import { SwapApi } from '@dodoex/api';
import {
  alpha,
  Box,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { getAddress } from '@ethersproject/address';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChainListItem, chainListMap } from '../../../constants/chainList';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useGlobalState } from '../../../hooks/useGlobalState';
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
  const accountListScrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const { crossChainSubmittedCounter } = useGlobalState();
  const queryClient = useQueryClient();
  const lastTransactionAccountRef = useRef<string | undefined>();
  const queryClientRef = useRef(queryClient);

  const {
    evmAccount,
    solanaAccount,
    bitcoinAccount,
    suiAccount,
    tonAccount,
    currentAccount,
  } = useWalletInfo();

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

    if (suiAccount.isConnected && suiAccount.address) {
      const firstChain = chainListMap
        .entries()
        .find(([_, chain]) => chain.isSUIChain)?.[1];

      if (firstChain) {
        accounts.push({
          account: suiAccount.address,
          firstChain,
        });
      }
    }

    if (tonAccount.isConnected && tonAccount.address) {
      const firstChain = chainListMap
        .entries()
        .find(([_, chain]) => chain.isTONChain)?.[1];

      if (firstChain) {
        accounts.push({
          account: tonAccount.address,
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
    suiAccount.address,
    suiAccount.isConnected,
    tonAccount.address,
    tonAccount.isConnected,
  ]);

  useEffect(() => {
    setSelectedAccount(() => {
      if (accountList.length > 0) {
        return accountList[0].account;
      }
      return undefined;
    });
  }, [accountList]);

  const handleAccountClick = useCallback(
    (account: string, isLast: boolean, isFirst: boolean) => {
      {
        setSelectedAccount(account);
        if (accountListScrollContainerRef.current) {
          if (isLast) {
            accountListScrollContainerRef.current.scrollTo({
              left: accountListScrollContainerRef.current.scrollWidth,
              behavior: 'smooth',
            });
          } else if (isFirst) {
            accountListScrollContainerRef.current.scrollTo({
              left: 0,
              behavior: 'smooth',
            });
          }
        }
      }
    },
    [],
  );

  useEffect(() => {
    const targetAccount = currentAccount?.address;
    if (!targetAccount) {
      return;
    }
    const findAccount = accountList.find(
      (account) =>
        account.account.toLowerCase() === targetAccount.toLowerCase(),
    );
    if (!findAccount) {
      return;
    }
    lastTransactionAccountRef.current = findAccount.account;
  }, [accountList, currentAccount?.address]);
  useEffect(() => {
    queryClientRef.current = queryClient;
  }, [queryClient]);

  useEffect(() => {
    if (crossChainSubmittedCounter === 0) {
      return;
    }
    setTimeout(() => {
      tabsContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setSwapOrderHistoryTab(SwapOrderHistoryTab.crossChain);

      if (!lastTransactionAccountRef.current) {
        return;
      }
      setSelectedAccount(lastTransactionAccountRef.current);
      queryClientRef.current.invalidateQueries({
        queryKey: [
          'graphql',
          'getInfiniteQuery',
          'page',
          SwapApi.graphql.cross_chain_swap_zetachain_orderList,
        ],
      });
    }, 300);
  }, [crossChainSubmittedCounter]);

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
        ref={tabsContainerRef}
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
        ref={accountListScrollContainerRef}
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
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none',
        }}
      >
        {accountList.map((account, index) => {
          const isSelected = selectedAccount === account.account;
          const isLast = index === accountList.length - 1;
          const isFirst = index === 0;
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
                flexShrink: 0,
                ...(isSelected && {
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                }),
                '&:hover': {
                  backgroundColor: isSelected
                    ? alpha(theme.palette.success.main, 0.1)
                    : theme.palette.background.paperDarkContrast,
                },
              }}
              onClick={() =>
                handleAccountClick(account.account, isLast, isFirst)
              }
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
