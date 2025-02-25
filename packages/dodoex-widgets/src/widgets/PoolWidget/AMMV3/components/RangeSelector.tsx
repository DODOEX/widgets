import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../../hooks/Token';
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
  mint1: Maybe<TokenInfo>;
  mint2: Maybe<TokenInfo>;
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
  mint1,
  mint2,
  feeAmount,
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
        feeAmount={feeAmount}
        label={leftPrice ? `${mint2?.symbol}` : '-'}
        title={<Trans>Low price</Trans>}
        tokenA={mint1?.symbol}
        tokenB={mint2?.symbol}
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
        feeAmount={feeAmount}
        label={rightPrice ? `${mint2?.symbol}` : '-'}
        tokenA={mint1?.symbol}
        tokenB={mint2?.symbol}
        title={<Trans>High price</Trans>}
      />
    </Box>
  );
};
