import { Box } from '@dodoex/components';
import { Currency } from '../sdks/sdk-core/entities/currency';
import { Price } from '../sdks/sdk-core/entities/fractions/price';
import { Token } from '../sdks/sdk-core/entities/token';
import { Bound } from '../types';
import StepCounter from './InputStepCounter';
import { Trans } from '@lingui/macro';

export interface RangeSelectorProps {
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  feeAmount?: number;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
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
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
}: RangeSelectorProps) => {
  const tokenA = (currencyA ?? undefined)?.wrapped;
  const tokenB = (currencyB ?? undefined)?.wrapped;
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

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
        feeAmount={feeAmount}
        label={leftPrice ? `${currencyB?.symbol}` : '-'}
        title={<Trans>Low price</Trans>}
        tokenA={currencyA?.symbol}
        tokenB={currencyB?.symbol}
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
        feeAmount={feeAmount}
        label={rightPrice ? `${currencyB?.symbol}` : '-'}
        tokenA={currencyA?.symbol}
        tokenB={currencyB?.symbol}
        title={<Trans>High price</Trans>}
      />
    </Box>
  );
};
