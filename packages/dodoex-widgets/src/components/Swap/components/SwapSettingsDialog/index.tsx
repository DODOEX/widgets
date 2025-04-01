import { Box, ButtonBase, Input, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { throttle } from 'lodash';
import React from 'react';
import {
  DEFAULT_SWAP_DDL,
  DEFAULT_SWAP_SLIPPAGE,
  SWAP_SLIPPAGE_LIST,
} from '../../../../constants/swap';
import { useSwapSettingStore } from '../../../../hooks/Swap/useSwapSettingStore';
import { TextSwitch } from '../../../TextSwitch';
import QuestionTooltip from '../../../Tooltip/QuestionTooltip';
import Dialog from '../Dialog';
import MoreTradeSetting from './MoreTradeSetting';

export interface SwapSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SwapSettingsDialog({ open, onClose }: SwapSettingsDialogProps) {
  const theme = useTheme();
  const { slippage, ddl, disableIndirectRouting } = useSwapSettingStore();

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
      onClose={onClose}
      id="swap-settings"
      title={<Trans>Settings</Trans>}
    >
      <Box
        sx={{
          px: 20,
          pb: 34,
          overflowY: 'auto',
        }}
        ref={scrollRef}
      >
        <Box
          sx={{
            pt: 24,
            borderTop: `solid 1px ${theme.palette.border.main}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              gap: 6,
            }}
          >
            <Trans>Slippage Tolerance</Trans>
            <QuestionTooltip
              title={
                <Trans>
                  Slippage is the difference between the current market price of
                  a token and the price at which the actual swap is executed.
                  Volatile tokens usually require a larger value.
                </Trans>
              }
            />
          </Box>
          <Box
            sx={{
              mt: 16,
            }}
          >
            <Input
              sx={{
                width: '100%',
                height: 34,
                lineHeight: 1,
                typography: 'body1',
                '& input': {
                  px: 16,
                  py: 6,
                },
              }}
              placeholder="0.0"
              suffix={
                <Box
                  sx={{
                    typography: 'body1',
                    color: theme.palette.text.disabled,
                    px: 0,
                  }}
                >
                  %
                </Box>
              }
              value={slippage}
              onChange={(evt) => {
                useSwapSettingStore.setState({
                  slippage: evt.target.value,
                });
              }}
              onBlur={() => {
                const value = Number(slippage);

                if (!slippage || isNaN(value) || value <= 0) {
                  useSwapSettingStore.setState({
                    slippage: String(DEFAULT_SWAP_SLIPPAGE),
                  });
                }
              }}
            />
            <Box
              sx={{
                mt: 8,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              {SWAP_SLIPPAGE_LIST.map((item) => {
                const isActive = Number(slippage) === Number(item.value);
                return (
                  <ButtonBase
                    key={item.value}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 4,
                      typography: 'h6',
                      lineHeight: '16px',
                      borderRadius: 4,
                      color: isActive
                        ? theme.palette.text.primary
                        : theme.palette.text.disabled,
                      backgroundColor: isActive
                        ? theme.palette.background.default
                        : theme.palette.background.input,
                      ':hover': {
                        color: theme.palette.text.primary,
                      },
                    }}
                    onClick={() => {
                      useSwapSettingStore.setState({
                        slippage: item.value,
                      });
                    }}
                  >
                    {item.value}%
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 24,
            pt: 24,
            borderTop: `solid 1px ${theme.palette.border.main}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
            <Trans>Transaction Deadline</Trans>
            <QuestionTooltip
              title={
                <Trans>
                  You may modify the transaction deadline, the maximum time
                  allowed for a trade to be processed on-chain. However, please
                  note that this may lead to your trade executing at a subpar
                  price, as the market price may change during that time.
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
              onBlur={() => {
                const value = Number(ddl);

                if (!slippage || isNaN(value) || value <= 0) {
                  useSwapSettingStore.setState({
                    ddl: String(DEFAULT_SWAP_DDL),
                  });
                }
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
            pt: 24,
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
                    Checking this option means that the routing algorithm will
                    only route to liquidity pools between the two tokens in the
                    trading pair and will ignore routes with any intermediary
                    tokens.
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
      </Box>
    </Dialog>
  );
}
