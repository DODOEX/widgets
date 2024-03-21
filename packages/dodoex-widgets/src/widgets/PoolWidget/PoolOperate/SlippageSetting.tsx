import {
  Input,
  HoverAddBackground,
  useTheme,
  Tooltip,
} from '@dodoex/components';
import { alpha, Box } from '@mui/system';
import BigNumber from 'bignumber.js';
import { ChangeEvent, useMemo, useState } from 'react';
import { Setting } from '@dodoex/icons';
import {
  AUTO_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_SWAP_SLIPPAGE_PROTECTION,
} from '../../../constants/pool';
import { Trans } from '@lingui/macro';
import { AutoButton } from '../../../components/AutoButton';

interface Props {
  value: number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION;
  onChange: (val: number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION) => void;
}

function Slipper({ value, onChange }: Props) {
  const isAuto = value === AUTO_SWAP_SLIPPAGE_PROTECTION;
  const [tempValue, setTempValue] = useState(
    isAuto ? '' : new BigNumber(value).times(100).toNumber(),
  );

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: val } = evt.target;
    setTempValue(val);
    onChange(
      val
        ? new BigNumber(val).div(100).toNumber()
        : AUTO_SWAP_SLIPPAGE_PROTECTION,
    );
  };
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        px: 20,
        py: 12,
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
            ? AUTO_LIQUIDITY_SLIPPAGE_PROTECTION
            : value && new BigNumber(value).times(100).toNumber()}
          %
        </span>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 16,
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
          placeholder={String(AUTO_LIQUIDITY_SLIPPAGE_PROTECTION)}
          value={tempValue}
          onChange={handleChange}
          onBlur={() => {
            if (
              (!isAuto && new BigNumber(value).gt(0.1)) ||
              new BigNumber(value).lte(0)
            ) {
              setTempValue(10);
              onChange(0.1);
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
  );
}

export const useSlipper = ({ address }: { address?: string }) => {
  const [slipper, setSlipper] = useState<
    number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION
  >(AUTO_SWAP_SLIPPAGE_PROTECTION);

  const slipperValue = useMemo(
    () =>
      slipper === AUTO_SWAP_SLIPPAGE_PROTECTION
        ? new BigNumber(AUTO_LIQUIDITY_SLIPPAGE_PROTECTION).div(100).toNumber()
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

export default function SlippageSetting({
  disabled,
  ...attrs
}: Props & {
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <Tooltip
      disabled={disabled}
      onlyClick
      title={<Slipper {...attrs} />}
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
        }}
      >
        <Box
          component={Setting}
          sx={{
            width: 18,
            height: 18,
            '& path:last-child': {
              fill: (theme) => theme.palette.text.primary,
            },
          }}
        />
      </HoverAddBackground>
    </Tooltip>
  );
}
