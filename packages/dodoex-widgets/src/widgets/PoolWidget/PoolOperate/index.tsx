import {
  alpha,
  Box,
  BoxProps,
  TabPanel,
  Tabs,
  TabsGroup,
} from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { t } from '@lingui/macro';
import Dialog from '../../../components/Dialog';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import {
  PoolOrMiningTab,
  usePoolOrMiningTabs,
} from './hooks/usePoolOrMiningTabs';
import PoolOperateInner, { PoolOperateInnerProps } from './PoolOperateInner';

export interface PoolOperateProps {
  onClose: (() => void) | undefined;
  account: string | undefined;
  pool: PoolOperateInnerProps['pool'];
  operate: PoolOperateInnerProps['operate'];
  hasMining: boolean;
  hidePoolInfo: boolean;
  sx?: BoxProps['sx'];
}

export function PoolOperate({
  onClose,
  pool,
  operate,
  hasMining,
  hidePoolInfo,
  sx,
}: PoolOperateProps) {
  const { poolOrMiningTab, poolOrMiningTabs, handleChangeTab } =
    usePoolOrMiningTabs({
      hasMining,
    });

  const hasLp = false;

  return (
    <Box sx={sx}>
      <Tabs
        value={poolOrMiningTab}
        onChange={(_, value) => {
          handleChangeTab(value as PoolOrMiningTab);
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <TabsGroup
          tabs={poolOrMiningTabs}
          tabsListSx={{
            mx: 20,
            justifyContent: onClose ? 'space-between' : 'flex-start',
            ...(hasMining && hasLp
              ? {
                  '& button:last-child': {
                    position: 'relative',
                    '&::before': {
                      content: `"${t`LP Tokens`}"`,
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      px: 8,
                      py: 2,
                      borderRadius: 12,
                      transform: 'scale(0.66667) translateX(100%)',
                      transformOrigin: 'right top',
                      backgroundColor: alpha('#DABB1B', 0.2),
                      color: '#DABB1B',
                    },
                  },
                }
              : {}),
          }}
          rightSlot={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {onClose ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    borderWidth: 1,
                    color: 'text.secondary',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component={Error}
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                    onClick={() => {
                      onClose();
                    }}
                  />
                </Box>
              ) : undefined}
            </Box>
          }
        />
        <TabPanel
          value={PoolOrMiningTab.Liquidity}
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <PoolOperateInner
            pool={pool}
            operate={operate}
            hidePoolInfo={hidePoolInfo}
            submittedBack={() => {
              if (hasMining) {
                handleChangeTab(PoolOrMiningTab.Mining);
              }
            }}
          />
        </TabPanel>
        {/* <TabPanel
          value={PoolOrMiningTab.Mining}
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {poolChainId && poolAddress ? (
            <LpTokenMiningOperate
              chainId={poolChainId}
              account={account}
              poolAddress={poolAddress}
              goLpLink={() => {
                handleChangeTab(PoolOrMiningTab.Liquidity);
              }}
            />
          ) : (
            ''
          )}
        </TabPanel> */}
      </Tabs>
    </Box>
  );
}

export default function PoolOperateDialog({
  modal,
  ...props
}: PoolOperateProps & {
  modal?: boolean;
}) {
  const { isMobile } = useWidgetDevice();

  return (
    <Dialog
      open={!!props.pool}
      onClose={props.onClose}
      scope={!isMobile}
      modal={modal}
      id="pool-operate"
    >
      <PoolOperate {...props} />
    </Dialog>
  );
}
