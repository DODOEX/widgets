import { Trans } from '@lingui/macro';
import Dialog from '../Dialog';
import { Box, Input, useTheme } from '@dodoex/components';
import React, { useState } from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import SlippageSetting from './SlippageSetting';
import QuestionTooltip from '../../../Tooltip/QuestionTooltip';
import { DEFAULT_SWAP_DDL } from '../../../../constants/swap';
import { useSwapSettingStore } from '../../../../hooks/Swap/useSwapSettingStore';
import { TextSwitch } from '../../../TextSwitch';
import MoreTradeSetting from './MoreTradeSetting';
import { throttle } from 'lodash';
import { usePrivacySwapStatus } from '../../../../hooks/Swap/usePrivacySwapStatus';
import { SupplierSelect } from './SupplierSelect';

export interface SwapSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  fromToken?: TokenInfo | null;
  toToken?: TokenInfo | null;
}

export function SwapSettingsDialog({
  open,
  onClose,
  fromToken,
  toToken,
  privacySwapEnableAble,
  privacySwapEnable,
  privacySwapSupplierEndpoints,
  endpointStatusMap,
  refetchEndpointStatus,
}: SwapSettingsDialogProps &
  Pick<
    ReturnType<typeof usePrivacySwapStatus>,
    | 'endpointStatusMap'
    | 'privacySwapSupplierEndpoints'
    | 'privacySwapEnable'
    | 'privacySwapEnableAble'
    | 'refetchEndpointStatus'
  >) {
  const theme = useTheme();
  const { ddl, expertMode, disableIndirectRouting } = useSwapSettingStore();

  const [isSelectSupplierMode, setIsSelectSupplierMode] = useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showMoreSettingEntry, setShowMoreSettingEntry] = React.useState(false);
  React.useEffect(() => {
    const scrollEl = scrollRef.current;
    const resizeObserver = new ResizeObserver(() => {
      if (scrollEl) {
        setShowMoreSettingEntry(
          scrollEl.scrollHeight !== scrollEl.offsetHeight,
        );
      }
    });
    const listenerScroll = throttle(() => {
      if (!scrollEl) return;
      const needShow =
        scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 2;
      setShowMoreSettingEntry(needShow);
    }, 50);

    if (scrollEl) {
      setShowMoreSettingEntry(scrollEl.scrollHeight !== scrollEl.clientHeight);
      resizeObserver.observe(scrollEl);

      scrollEl.addEventListener('scroll', listenerScroll);
    }

    return () => {
      if (scrollEl) {
        resizeObserver.unobserve(scrollEl);
        scrollEl.removeEventListener('scroll', listenerScroll);
      }
    };
  }, [scrollRef?.current]);

  return (
    <Dialog
      open={open}
      onClose={
        isSelectSupplierMode ? () => setIsSelectSupplierMode(false) : onClose
      }
      id="swap-settings"
      title={
        isSelectSupplierMode ? 'Select A Supplier' : <Trans>Settings</Trans>
      }
    >
      <Box
        sx={{
          px: 20,
          pb: 34,
          overflowY: 'auto',
        }}
        ref={scrollRef}
      >
        {isSelectSupplierMode ? (
          <SupplierSelect
            privacySwapSupplierEndpoints={privacySwapSupplierEndpoints}
            endpointStatusMap={endpointStatusMap}
            refetchEndpointStatus={refetchEndpointStatus}
            setIsSelectSupplierMode={setIsSelectSupplierMode}
            privacySwapEnable={privacySwapEnable}
            privacySwapEnableAble={privacySwapEnableAble}
          />
        ) : (
          <>
            <SlippageSetting fromToken={fromToken} toToken={toToken} />
            <Box
              sx={{
                mt: 24,
                pt: 14,
                borderTop: `solid 1px ${theme.palette.border.main}`,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}
              >
                <Trans>Transaction Deadline</Trans>
                <QuestionTooltip
                  title={
                    <Trans>
                      You may modify the transaction deadline, the maximum time
                      allowed for a trade to be processed on-chain. However,
                      please note that this may lead to your trade executing at
                      a subpar price, as the market price may change during that
                      time.
                    </Trans>
                  }
                  ml={7}
                />
              </Box>
              <Box
                sx={{
                  mt: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  typography: 'body2',
                }}
              >
                <Input
                  sx={{
                    width: 80,
                    height: 34,
                    lineHeight: 1,
                    typography: 'body2',
                    '& input': {
                      px: 16,
                      py: 6,
                    },
                  }}
                  placeholder={String(DEFAULT_SWAP_DDL)}
                  value={ddl}
                  onChange={(evt) => {
                    useSwapSettingStore.setState({
                      ddl: evt.target.value,
                    });
                  }}
                />
                <Trans>minutes</Trans>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                mt: 24,
                pt: 14,
                borderTop: `solid 1px ${theme.palette.border.main}`,
              }}
            >
              {/* expert mode */}
              {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}
            >
              <Trans>Expert Mode</Trans>
              <QuestionTooltip
                title={<Trans>Expert mode allows for high-slippage</Trans>}
                ml={7}
              />
            </Box>
            <TextSwitch
              checked={expertMode}
              onChange={(v) => {
                useSwapSettingStore.setState({
                  expertMode: v,
                });
              }}
            />
          </Box> */}
              {/* disable indirect routing */}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ fontWeight: 600 }}>
                  <Trans>Disable Indirect Routing</Trans>
                  <QuestionTooltip
                    title={
                      <Trans>
                        Checking this option means that the routing algorithm
                        will only route to liquidity pools between the two
                        tokens in the trading pair and will ignore routes with
                        any intermediary tokens.
                      </Trans>
                    }
                    ml={7}
                  />
                </Box>
                <TextSwitch
                  checked={disableIndirectRouting}
                  onChange={(v) => {
                    useSwapSettingStore.setState({
                      disableIndirectRouting: v,
                    });
                  }}
                />
              </Box>

              {privacySwapEnableAble && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ fontWeight: 600 }}>
                    <Trans>Privacy Swap</Trans>
                    <QuestionTooltip
                      title={
                        <Trans>
                          Privacy Swap can effectively protect users from
                          sandwich attacks that could come about due to the
                          differences between the slippage settings and the
                          current price in the liquidity pool. This feature is
                          free for a limited time.
                        </Trans>
                      }
                      ml={7}
                    />
                  </Box>
                  <TextSwitch
                    checked={privacySwapEnable}
                    disabled={privacySwapEnable}
                    onChange={(checked) => {
                      if (checked) {
                        setIsSelectSupplierMode(true);
                        return;
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
            <MoreTradeSetting
              show={showMoreSettingEntry}
              onClick={() => {
                scrollRef.current?.scrollTo({
                  top: scrollRef.current?.scrollHeight,
                  behavior: 'smooth',
                });
              }}
            />
          </>
        )}
      </Box>
    </Dialog>
  );
}
