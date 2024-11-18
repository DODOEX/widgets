import { Box, LoadingSkeleton } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { ReactNode, useCallback, useMemo } from 'react';
import { batch } from 'react-redux';
import { formatPercentageNumber } from '../../../../../utils';
import { Currency, Price } from '../../sdks/sdk-core';
import { FeeAmount } from '../../sdks/v3-sdk';
import { Bound } from '../../types';
import { AutoColumn, ColumnCenter } from '../widgets';
import { Chart } from './Chart';
import { useDensityChartData } from './hooks';
import { ZoomLevels } from './types';
import { themeColor } from './utils';

const LOW_ZOOM_LEVEL = {
  initialMin: 0.999,
  initialMax: 1.001,
  min: 0.00001,
  max: 1.5,
};
const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: LOW_ZOOM_LEVEL,
  [FeeAmount.LOW_200]: LOW_ZOOM_LEVEL,
  [FeeAmount.LOW_300]: LOW_ZOOM_LEVEL,
  [FeeAmount.LOW_400]: LOW_ZOOM_LEVEL,
  [FeeAmount.LOW]: LOW_ZOOM_LEVEL,
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
  return (
    <ColumnCenter style={{ height: '100%', justifyContent: 'center' }}>
      {icon}
      {message && (
        <Box
          sx={{
            mt: 20,
            p: 10,
            typography: 'caption',
            textAlign: 'center',
          }}
        >
          {message}
        </Box>
      )}
    </ColumnCenter>
  );
}

function LoadingBars() {
  return <LoadingSkeleton />;
}

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
}: {
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: FeeAmount;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price?: number;
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  interactive: boolean;
}) {
  const isSorted =
    currencyA &&
    currencyB &&
    currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

  const { isLoading, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
  });

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
            mode === 'handle' ||
            mode === 'reset') &&
          leftRangeValue > 0
        ) {
          onLeftRangeInput(leftRangeValue.toFixed(6));
        }

        if (
          (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
            mode === 'reset') &&
          rightRangeValue > 0
        ) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6));
          }
        }
      });
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  );

  interactive = interactive && Boolean(formattedData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [
          parseFloat(leftPrice?.toSignificant(6)),
          parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) {
        return '';
      }

      if (d === 'w' && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) {
        return '0';
      }
      if (d === 'e' && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) {
        return '∞';
      }

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100;

      return price
        ? `${
            (Math.sign(percent) < 0 ? '-' : '') +
            formatPercentageNumber({
              input: percent,
            })
          }`
        : '';
    },
    [isSorted, price, ticksAtLimit],
  );

  const isUninitialized =
    !currencyA ||
    !currencyB ||
    (formattedData === undefined && !isLoading && !error);

  return (
    <AutoColumn gap="md" style={{ minHeight: '200px' }}>
      {isUninitialized ? (
        <InfoBox
          message={<Trans>Your position will appear here.</Trans>}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke={themeColor.neutral1}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            </svg>
          }
        />
      ) : isLoading ? (
        <LoadingBars />
      ) : error ? (
        <InfoBox
          message={<Trans>Liquidity data not available.</Trans>}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke={themeColor.neutral2}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          }
        />
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <InfoBox
          message={<Trans>There is no liquidity data.</Trans>}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke={themeColor.neutral2}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          }
        />
      ) : (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxHeight: '200px',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <Chart
            data={{ series: formattedData, current: price }}
            dimensions={{ width: 560, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: themeColor.accent1,
              },
              brush: {
                handle: {
                  west: themeColor.critical,
                  east: themeColor.accent1,
                },
              },
            }}
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </Box>
      )}
    </AutoColumn>
  );
}
