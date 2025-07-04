import {
  Box,
  BoxProps,
  HoverAddBackground,
  HoverOpacity,
  Input,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Alarm, Setting } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { ChangeEvent, useMemo, useState } from 'react';
import { AutoButton } from '../../../../components/AutoButton';
import {
  AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_AMM_V3_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_SWAP_SLIPPAGE_PROTECTION,
} from '../../../../constants/pool';
import { PoolType } from '@dodoex/api';
import { SlippageWarning } from '../../../../components/Swap/components/SwapSettingsDialog/SlippageWarning';
import { useSwapSettingStore } from '../../../../hooks/Swap/useSwapSettingStore';

export const useSlipper = ({
  address,
  type,
}: {
  address?: string;
  type?: PoolType;
}) => {
  const [slipper, setSlipper] = useState<
    number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION
  >(AUTO_SWAP_SLIPPAGE_PROTECTION);

  const slipperValue = useMemo(
    () =>
      slipper === AUTO_SWAP_SLIPPAGE_PROTECTION
        ? type === 'AMMV3'
          ? new BigNumber(AUTO_AMM_V3_LIQUIDITY_SLIPPAGE_PROTECTION)
              .div(100)
              .toNumber()
          : type === 'AMMV2'
            ? new BigNumber(AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION)
                .div(100)
                .toNumber()
            : new BigNumber(AUTO_LIQUIDITY_SLIPPAGE_PROTECTION)
                .div(100)
                .toNumber()
        : slipper,
    [slipper, type],
  );

  const resetSlipper = () => {
    setSlipper(AUTO_SWAP_SLIPPAGE_PROTECTION);
  };

  return {
    slipper,
    setSlipper,
    slipperValue,
    resetSlipper,
  };
};

export default function SlippageSetting({
  type,
  disabled,
  value,
  onChange,
  sx,
}: {
  type?: PoolType;
  disabled?: boolean;
  value: number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION;
  onChange: (val: number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION) => void;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const isAuto = value === AUTO_SWAP_SLIPPAGE_PROTECTION;
  const [tempValue, setTempValue] = useState(
    isAuto ? '' : new BigNumber(value).times(100).toNumber(),
  );
  const { notRemindAgainSlippageHigher } = useSwapSettingStore();

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: val } = evt.target;
    setTempValue(val);
    onChange(
      val
        ? new BigNumber(val).div(100).toNumber()
        : AUTO_SWAP_SLIPPAGE_PROTECTION,
    );
  };

  const autoValue =
    type == 'AMMV3'
      ? AUTO_AMM_V3_LIQUIDITY_SLIPPAGE_PROTECTION
      : type == 'AMMV2'
        ? AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION
        : AUTO_LIQUIDITY_SLIPPAGE_PROTECTION;
  const warnValue = Number(autoValue);
  const isWarnSlippage = !isAuto && value * 100 > warnValue;

  return (
    <Tooltip
      disabled={disabled}
      onlyClick
      title={
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(12, 20),
            borderRadius: 8,
            width: 318,
            maxWidth: '90vw',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              typography: 'body2',
            }}
          >
            <span>
              <Trans>Slippage Tolerance</Trans>
            </span>
            <span>
              {isAuto
                ? autoValue
                : value && new BigNumber(value).times(100).toNumber()}
              %
            </span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: theme.spacing(16, 0, 0, 0),
            }}
          >
            <AutoButton
              sx={{
                borderRadius: 8,
                whiteSpace: 'nowrap',
              }}
              onClick={() => {
                setTempValue('');
                onChange(AUTO_SWAP_SLIPPAGE_PROTECTION);
              }}
              active={isAuto}
            />
            <Input
              placeholder={String(autoValue)}
              value={tempValue}
              onChange={handleChange}
              suffix={
                <Box
                  sx={{
                    mr: 16,
                  }}
                >
                  %
                </Box>
              }
              sx={{
                ml: 8,
                '& input': {
                  px: 16,
                  py: 0,
                  height: '39px',
                },
              }}
            />
          </Box>
          {isWarnSlippage && (
            <SlippageWarning
              title={t`Higher than default slippage`}
              desc={t`Default value is ${warnValue}%,the current slippage setting is higher than the default value, which means you are willing to accept a worse final execution price.`}
              doNotChecked={notRemindAgainSlippageHigher}
              onChangeDoNotChecked={(notRemindAgainSlippageHigher) =>
                useSwapSettingStore.setState({
                  notRemindAgainSlippageHigher,
                })
              }
              sx={{
                mt: 16,
              }}
            />
          )}
        </Box>
      }
      sx={{
        p: 0,
      }}
      arrow={false}
      placement="top-end"
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          alignItems: 'center',
          gap: 4,
          margin: theme.spacing(0, 0, 0, 'auto'),
          ...(!disabled && {
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.5,
            },
          }),
          ...sx,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: isWarnSlippage ? 'warning.main' : undefined,
          }}
        >
          {isWarnSlippage && (
            <Box
              component={Alarm}
              sx={{
                width: 18,
                height: 18,
              }}
            />
          )}
          {isAuto
            ? autoValue
            : value && new BigNumber(value).times(100).toNumber()}
          %
        </Box>
        <Box
          component={Setting}
          sx={{
            width: 18,
            height: 18,
            '& path:last-child': {
              fill: theme.palette.text.primary,
            },
          }}
        />
      </Box>
    </Tooltip>
  );
}
