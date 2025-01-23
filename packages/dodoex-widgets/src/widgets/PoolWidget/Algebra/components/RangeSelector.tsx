import { Box } from '@dodoex/components';
import { Bound } from '../types';
import StepCounter from './InputStepCounter';
import { Trans } from '@lingui/macro';
import { TokenInfo } from '../../../../hooks/Token';
import { Price } from '../../../../utils/fractions';

export interface RangeSelectorProps {
  priceLower?: Price;
  priceUpper?: Price;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  tokenA?: TokenInfo | null;
  tokenB?: TokenInfo | null;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  isSorted: boolean;
  border?: boolean;
}

export const RangeSelector = ({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  tokenA,
  tokenB,
  ticksAtLimit,
  isSorted,
  border,
}: RangeSelectorProps) => {
  const leftPrice = isSorted ? priceLower : priceUpper?.invert();
  const rightPrice = isSorted ? priceUpper : priceLower?.invert();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 8,
      }}
    >
      <StepCounter
        value={
          ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
            ? '0'
            : (leftPrice?.toSignificant(8) ?? '')
        }
        onUserInput={onLeftRangeInput}
        decrement={isSorted ? getDecrementLower : getIncrementUpper}
        increment={isSorted ? getIncrementLower : getDecrementUpper}
        decrementDisabled={
          leftPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
        }
        incrementDisabled={
          leftPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
        }
        label={leftPrice ? `${tokenB?.symbol}` : '-'}
        title={<Trans>Low price</Trans>}
        tokenA={tokenA?.symbol}
        tokenB={tokenB?.symbol}
        border={border}
      />
      <StepCounter
        value={
          ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
            ? '∞'
            : (rightPrice?.toSignificant(8) ?? '')
        }
        onUserInput={onRightRangeInput}
        decrement={isSorted ? getDecrementUpper : getIncrementLower}
        increment={isSorted ? getIncrementUpper : getDecrementLower}
        incrementDisabled={
          rightPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
        }
        decrementDisabled={
          rightPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
        }
        label={rightPrice ? `${tokenB?.symbol}` : '-'}
        tokenA={tokenA?.symbol}
        tokenB={tokenB?.symbol}
        title={<Trans>High price</Trans>}
        border={border}
      />
    </Box>
  );
};
