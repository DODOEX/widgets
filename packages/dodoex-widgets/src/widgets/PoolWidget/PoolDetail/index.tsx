import { Box, Button, useTheme, Modal } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import GoBack from '../../../components/GoBack';
import WidgetConfirm from '../../../components/WidgetConfirm';
import WidgetContainer from '../../../components/WidgetContainer';
import WidgetDialog from '../../../components/WidgetDialog';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { usePoolDetail } from '../hooks/usePoolDetail';
import PoolOperateDialog, {
  PoolOperate,
  PoolOperateModal,
} from '../PoolOperate';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import ChartInfo from './components/ChartInfo';
import MoreDetail from './components/MoreDetail';
import Overview from './components/Overview';
import TitleInfo from './components/TitleInfo';
import TotalLiquidity from './components/TotalLiquidity';

export default function PoolDetail() {
  const router = useRouterStore();
  const { isMobile } = useWidgetDevice();
  const { account } = useWalletInfo();
  const theme = useTheme();
  const params =
    router.page?.type === PageType.PoolDetail
      ? (router.page as Page<PageType.PoolDetail>).params
      : undefined;

  const { poolDetail: pool, ...fetchPoolQuery } = usePoolDetail({
    id: params?.address,
    chainId: params?.chainId,
  });
  const [noResultModalVisible, setNoResultModalVisible] =
    React.useState<'inital' | 'open' | 'close'>('inital');
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

  const [operateType, setOperateType] = React.useState(
    isMobile ? undefined : OperateTab.Add,
  );

  const operatePool =
    !!operateType && pool
      ? {
          ...pool,
          baseLpToken: {
            id: pool.baseLpToken?.id as string,
          },
          quoteLpToken: {
            id: pool.quoteLpToken?.id as string,
          },
        }
      : undefined;

  return (
    <WidgetContainer
      sx={
        isMobile
          ? {
              p: theme.spacing(28, 20, canOperate ? 108 : 0),
            }
          : {
              p: theme.spacing(28, 40, 40),
            }
      }
    >
      <GoBack
        onClick={() => {
          router.push({
            type: PageType.Pool,
          });
        }}
      />
      <Box
        sx={
          isMobile
            ? {}
            : {
                display: 'flex',
                gap: 12,
              }
        }
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          <TitleInfo poolDetail={pool} loading={fetchPoolQuery.isPending} />
          <ChartInfo poolDetail={pool} />
          <Overview poolDetail={pool} />
          <TotalLiquidity poolDetail={pool} />
          <MoreDetail poolDetail={pool} />
        </Box>
        {isMobile ? (
          <PoolOperateModal
            account={account}
            pool={operatePool}
            operate={operateType}
            onClose={() => {
              setOperateType(undefined);
            }}
            sx={{
              height: '100%',
            }}
          />
        ) : (
          <PoolOperate
            account={account}
            operate={operateType}
            sx={{
              width: 375,
              height: 'max-content',
              backgroundColor: 'background.paper',
              borderRadius: 16,
              overflow: 'hidden',
            }}
            pool={operatePool}
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
