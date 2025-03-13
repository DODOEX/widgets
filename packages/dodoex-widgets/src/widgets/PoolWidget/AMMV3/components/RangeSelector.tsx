import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { Bound } from '../types';
import StepCounter from './InputStepCounter';

export interface RangeSelectorProps {
  priceLower: BigNumber | undefined;
  priceUpper: BigNumber | undefined;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  perPriceText: string;
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
  perPriceText,
  ticksAtLimit,
}: RangeSelectorProps) => {
  const leftPrice = priceLower;
  const rightPrice = priceUpper;

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
          ticksAtLimit[Bound.LOWER] ? '0' : (leftPrice?.dp(8).toString() ?? '')
        }
        onUserInput={onLeftRangeInput}
        decrement={getDecrementLower}
        increment={getIncrementLower}
        decrementDisabled={leftPrice === undefined || ticksAtLimit[Bound.LOWER]}
        incrementDisabled={leftPrice === undefined || ticksAtLimit[Bound.LOWER]}
        title={<Trans>Low price</Trans>}
        perPriceText={perPriceText}
      />

      <StepCounter
        value={
          ticksAtLimit[Bound.UPPER] ? '∞' : (rightPrice?.dp(8).toString() ?? '')
        }
        onUserInput={onRightRangeInput}
        decrement={getDecrementUpper}
        increment={getIncrementUpper}
        incrementDisabled={
          rightPrice === undefined || ticksAtLimit[Bound.UPPER]
        }
        decrementDisabled={
          rightPrice === undefined || ticksAtLimit[Bound.UPPER]
        }
        title={<Trans>High price</Trans>}
        perPriceText={perPriceText}
      />
    </Box>
  );
};
