import {
  Box,
  Button,
  Skeleton,
  TabPanel,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useEffect, useMemo, useState } from 'react';
import GoBack from '../../../components/GoBack';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { CoinReservePieChart } from './components/CoinReservePieChart';
import { LiquidityProvidersTable } from './components/LiquidityProvidersTable';
import { ParametersTable } from './components/ParametersTable';
import { PoolTitle } from './components/PoolTitle';
import { PoolTotalStats } from './components/PoolTotalStats';
import { SwapsTable } from './components/SwapsTable';
import { useLpTokenBalances } from './hooks/useLpTokenBalances';
import { usePoolDetail } from './hooks/usePoolDetail';
import { OperateDialog } from './OperateDialog';
import { OperateCurvePoolT } from './types';

export interface CurvePoolDetailProps {
  params: Page<PageType.CurvePoolDetail>['params'];
}

export const CurvePoolDetail = ({ params }: CurvePoolDetailProps) => {
  const router = useRouterStore();
  const { isMobile } = useWidgetDevice();
  const { account } = useWalletInfo();
  const theme = useTheme();

  const { poolDetail, isLoading, error } = usePoolDetail({
    address: params?.address,
    chainId: params?.chainId,
  });

  const { tokenBalances } = useLpTokenBalances({
    pool: poolDetail,
    account,
  });

  const [operateCurvePool, setOperateCurvePool] =
    useState<OperateCurvePoolT | null>(null);

  const [moreTab, setMoreTab] = useState<'parameters' | 'swaps' | 'liquidity'>(
    'parameters',
  );

  useEffect(() => {
    if (isMobile) {
      return;
    }
    if (!poolDetail) {
      return;
    }
    setOperateCurvePool({
      pool: poolDetail,
      type: OperateTab.Add,
    });
  }, [poolDetail, isMobile]);

  const tableTabList = useMemo(() => {
    return [
      { key: 'parameters', value: 'Parameters' },
      { key: 'swaps', value: 'Swaps' },
      {
        key: 'liquidity',
        value: 'Liquidity',
      },
    ];
  }, []);

  return (
    <WidgetContainer
      sx={
        isMobile
          ? {
              p: theme.spacing(28, 0, 108),
            }
          : {
              p: theme.spacing(28, 0, 40),
            }
      }
    >
      <Box
        sx={{
          [theme.breakpoints.up('tablet')]: {
            display: 'flex',
            gap: 12,
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            [theme.breakpoints.up('tablet')]: {
              gap: 28,
            },
          }}
        >
          <GoBack
            onClick={() => {
              router.push({
                type: PageType.Pool,
              });
            }}
          />

          <PoolTitle poolDetail={poolDetail} />

          <PoolTotalStats poolDetail={poolDetail} />

          {poolDetail && (
            <Box>
              <Box
                sx={{
                  typography: 'body1',
                  color: theme.palette.text.primary,
                }}
              >
                Currency reserves
              </Box>
              <CoinReservePieChart
                poolDetail={poolDetail}
                tokenBalances={tokenBalances}
              />
            </Box>
          )}

          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 16,
              overflow: 'hidden',
              px: 16,
              pb: 16,
              [theme.breakpoints.up('tablet')]: {
                px: 20,
                pb: 20,
              },
            }}
          >
            <Tabs
              value={moreTab}
              onChange={(_, v) =>
                setMoreTab(v as 'parameters' | 'swaps' | 'liquidity')
              }
            >
              <TabsGroup tabs={tableTabList} />
              <TabPanel value="parameters">
                <ParametersTable poolDetail={poolDetail} />
              </TabPanel>
              <TabPanel value="swaps">
                <SwapsTable
                  chainId={params?.chainId}
                  address={params?.address}
                />
              </TabPanel>
              <TabPanel value="liquidity">
                <LiquidityProvidersTable
                  chainId={params?.chainId}
                  address={params?.address}
                />
              </TabPanel>
            </Tabs>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: isMobile ? '100%' : 375,
          }}
        >
          {operateCurvePool ? (
            <OperateDialog
              poolDetailBtnVisible={false}
              operateCurvePool={operateCurvePool}
              setOperateCurvePool={isMobile ? setOperateCurvePool : undefined}
            />
          ) : isMobile ? null : (
            <Skeleton width={375} height={403} sx={{ borderRadius: 16 }} />
          )}
        </Box>
      </Box>

      {isMobile && (
        <>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              p: 20,
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: 'repeat(2, 1fr)',
              backgroundColor: 'background.paperContrast',
            }}
          >
            <Button
              variant={Button.Variant.second}
              disabled={!poolDetail}
              onClick={() => {
                if (!poolDetail) {
                  return;
                }
                setOperateCurvePool({
                  pool: poolDetail,
                  type: OperateTab.Remove,
                });
              }}
            >
              <Trans>Remove</Trans>
            </Button>
            <Button
              disabled={!poolDetail}
              onClick={() => {
                if (!poolDetail) {
                  return;
                }
                setOperateCurvePool({
                  pool: poolDetail,
                  type: OperateTab.Add,
                });
              }}
            >
              <Trans>Add</Trans>
            </Button>
          </Box>
        </>
      )}
    </WidgetContainer>
  );
};
