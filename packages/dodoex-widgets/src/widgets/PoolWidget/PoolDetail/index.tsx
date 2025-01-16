import { Box, Button, useTheme } from '@dodoex/components';
import { ArrowBack } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import WidgetConfirm from '../../../components/WidgetConfirm';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { usePoolDetail } from '../hooks/usePoolDetail';
import PoolOperateDialog, { PoolOperate } from '../PoolOperate';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import ChartInfo from './components/ChartInfo';
import MoreDetail from './components/MoreDetail';
import Overview from './components/Overview';
import TitleInfo from './components/TitleInfo';
import TotalLiquidity from './components/TotalLiquidity';
import GoBack from '../../../components/GoBack';

export default function PoolDetail({
  params,
}: {
  params: Page<PageType.PoolDetail>['params'];
}) {
  const router = useRouterStore();
  const { isMobile } = useWidgetDevice();
  const { account } = useWalletInfo();
  const theme = useTheme();

  const { poolDetail: pool, ...fetchPoolQuery } = usePoolDetail({
    id: params?.address,
    chainId: params?.chainId,
  });
  const [noResultModalVisible, setNoResultModalVisible] = React.useState<
    'inital' | 'open' | 'close'
  >('inital');
  if (
    !fetchPoolQuery.isPending &&
    !fetchPoolQuery.error &&
    !pool &&
    noResultModalVisible === 'inital'
  ) {
    setNoResultModalVisible('open');
  }

  const canEdit =
    pool &&
    pool.type === 'DPP' &&
    account &&
    pool.owner?.toLocaleLowerCase() === account.toLocaleLowerCase();
  const canOperate =
    (pool && pool.type !== 'DPP') ||
    (account &&
      pool?.owner &&
      pool.owner.toLocaleLowerCase() === account.toLocaleLowerCase());

  const [operateType, setOperateType] = React.useState<
    OperateTab | undefined
  >();
  if (pool && operateType === undefined && !isMobile) {
    setOperateType(OperateTab.Add);
  }

  const operatePool =
    !!operateType && pool
      ? {
          ...pool,
          baseLpToken: {
            id: pool.baseLpToken?.id as string,
            decimals: Number(pool.baseLpToken?.decimals ?? 18),
          },
          quoteLpToken: {
            id: pool.quoteLpToken?.id as string,
            decimals: Number(pool.quoteLpToken?.decimals ?? 18),
          },
        }
      : undefined;

  const hasMining = !!pool?.miningAddress;

  return (
    <WidgetContainer
      sx={
        isMobile
          ? {
              p: theme.spacing(0, 0, canOperate ? 88 : 0),
              backgroundColor: 'transparent',
            }
          : {
              backgroundColor: 'transparent',
              padding: 0,
            }
      }
    >
      {isMobile ? (
        <Box
          sx={{
            backgroundColor: 'background.default',
          }}
        >
          <GoBack
            onClick={() => {
              router.push({
                type: PageType.Pool,
              });
            }}
            sx={{
              px: 20,
              pt: 20,
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            mb: 12,
            py: 24,
            px: 20,
            borderRadius: 20,
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 12,
            [theme.breakpoints.up('tablet')]: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          }}
        >
          <Box
            component={ArrowBack}
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              router.push({
                type: PageType.Pool,
              });
            }}
          />
          <TitleInfo poolDetail={pool} loading={fetchPoolQuery.isPending} />
        </Box>
      )}

      <Box
        sx={
          isMobile
            ? {}
            : {
                display: 'flex',
                gap: 12,
                overflow: 'hidden',
              }
        }
      >
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            padding: 20,
            backgroundColor: 'background.default',
            [theme.breakpoints.up('tablet')]: {
              borderRadius: 20,
            },
          }}
        >
          {isMobile && (
            <TitleInfo poolDetail={pool} loading={fetchPoolQuery.isPending} />
          )}
          <ChartInfo poolDetail={pool} chart24hDataFirst />
          <Overview poolDetail={pool} />
          <TotalLiquidity poolDetail={pool} />
          <MoreDetail poolDetail={pool} />
        </Box>

        {isMobile ? (
          <PoolOperateDialog
            account={account}
            pool={operatePool}
            operate={operateType}
            hasMining={hasMining}
            modal
            onClose={() => {
              setOperateType(undefined);
            }}
          />
        ) : (
          <PoolOperate
            account={account}
            operate={operateType}
            hasMining={hasMining}
            sx={{
              width: 375,
              height: 'max-content',
              overflow: 'hidden',
            }}
            pool={operatePool}
            hidePoolInfo
          />
        )}
      </Box>
      <WidgetConfirm
        singleBtn
        open={noResultModalVisible === 'open'}
        onClose={() => setNoResultModalVisible('close')}
        onConfirm={() => setNoResultModalVisible('close')}
        title={t`Pool not found. Please switch to another network and retry.`}
      />
      {isMobile && canOperate && (
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
              gridTemplateColumns: canEdit
                ? 'repeat(3, 1fr)'
                : 'repeat(2, 1fr)',
              backgroundColor: 'background.paperContrast',
            }}
          >
            {canEdit ? (
              <Button
                variant={Button.Variant.second}
                onClick={() => {
                  useRouterStore.getState().push({
                    type: PageType.ModifyPool,
                    params: {
                      chainId: pool.chainId,
                      address: pool.address,
                    },
                  });
                }}
              >
                <Trans>Edit</Trans>
              </Button>
            ) : (
              ''
            )}
            <Button
              variant={Button.Variant.second}
              onClick={() => {
                setOperateType(OperateTab.Remove);
              }}
            >
              <Trans>Remove</Trans>
            </Button>
            <Button
              onClick={() => {
                setOperateType(OperateTab.Add);
              }}
            >
              <Trans>Add</Trans>
            </Button>
          </Box>
        </>
      )}
    </WidgetContainer>
  );
}
