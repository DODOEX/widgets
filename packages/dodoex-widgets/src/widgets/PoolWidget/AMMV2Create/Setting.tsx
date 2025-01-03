import {
  Box,
  Input,
  HoverAddBackground,
  useTheme,
  Tooltip,
  BoxProps,
} from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { ChangeEvent, useMemo, useState } from 'react';
import { Setting as SettingIcon } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import {
  AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_SWAP_SLIPPAGE_PROTECTION,
} from '../../../constants/pool';
import { AutoButton } from '../../../components/AutoButton';

export const useSlipper = ({ address }: { address?: string }) => {
  const [slipper, setSlipper] = useState<
    number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION
  >(AUTO_SWAP_SLIPPAGE_PROTECTION);

  const slipperValue = useMemo(
    () =>
      slipper === AUTO_SWAP_SLIPPAGE_PROTECTION
        ? new BigNumber(AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION)
            .div(100)
            .toNumber()
        : slipper,
    [slipper],
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

export default function Setting({
  sx,
  disabled,
  slippage,
  onChangeSlippage,
}: {
  sx?: BoxProps['sx'];
  disabled?: boolean;
  slippage: number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION;
  onChangeSlippage: (
    val: number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION,
  ) => void;
}) {
  const theme = useTheme();
  const isAuto = slippage === AUTO_SWAP_SLIPPAGE_PROTECTION;
  const [tempValue, setTempValue] = useState(
    isAuto ? '' : new BigNumber(slippage).times(100).toNumber(),
  );

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: val } = evt.target;
    setTempValue(val);
    onChangeSlippage(
      val
        ? new BigNumber(val).div(100).toNumber()
        : AUTO_SWAP_SLIPPAGE_PROTECTION,
    );
  };

  return (
    <Tooltip
      disabled={disabled}
      onlyClick
      title={
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(16, 20),
            borderRadius: 16,
            width: 375,
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
              color: 'text.primary',
            }}
          >
            <span>
              <Trans>Slippage Tolerance</Trans>
            </span>
            <span>
              {isAuto
                ? AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION
                : slippage && new BigNumber(slippage).times(100).toNumber()}
              %
            </span>
          </Box>
          <Box
            sx={{
              mt: 16,
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
                onChangeSlippage(AUTO_SWAP_SLIPPAGE_PROTECTION);
              }}
              active={isAuto}
            />
            <Input
              placeholder={String(AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION)}
              value={tempValue}
              onChange={handleChange}
              onBlur={() => {
                if (
                  (!isAuto && new BigNumber(slippage).gt(0.1)) ||
                  new BigNumber(slippage).lte(0)
                ) {
                  setTempValue(10);
                  onChangeSlippage(0.1);
                }
              }}
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
        </Box>
      }
      sx={{
        p: 0,
      }}
      arrow={false}
      placement="bottom-end"
    >
      <HoverAddBackground
        sx={{
          width: 'max-content',
          alignItems: 'right',
          margin: theme.spacing(0, 0, 0, 'auto'),
          p: theme.spacing(4, 12),
          borderRadius: 20,
          backgroundColor: 'background.paperDarkContrast',
          cursor: 'pointer',
          ...sx,
        }}
      >
        <Box
          component={SettingIcon}
          sx={{
            width: 18,
            height: 18,
            '& path:last-child': {
              fill: theme.palette.text.primary,
            },
          }}
        />
      </HoverAddBackground>
    </Tooltip>
  );
}
