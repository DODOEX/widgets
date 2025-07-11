import { Box, Button, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import GoBack from '../../../components/GoBack';
import WidgetConfirm from '../../../components/WidgetConfirm';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { usePoolDetail } from './hooks/usePoolDetail';
import { OperateDialog } from './OperateDialog';
import { OperateCurvePoolT } from './types';
import { useState } from 'react';

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

  const [operateCurvePool, setOperateCurvePool] =
    useState<OperateCurvePoolT | null>(
      poolDetail
        ? {
            pool: poolDetail,
            type: OperateTab.Remove,
          }
        : null,
    );

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
                overflow: 'hidden',
              }
        }
      >
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          left
        </Box>
        <OperateDialog
          poolInfoVisible={true}
          operateCurvePool={operateCurvePool}
          setOperateCurvePool={setOperateCurvePool}
        />
      </Box>

      {/* <WidgetConfirm
        singleBtn
        open={noResultModalVisible === 'open'}
        onClose={() => setNoResultModalVisible('close')}
        onConfirm={() => setNoResultModalVisible('close')}
        title={t`Pool not found. Please switch to another network and retry.`}
      /> */}

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
};
