import BigNumber from 'bignumber.js';
import React from 'react';
import { ForecastSlippageListItem } from '../../../../../hooks/Swap/useForecastSlippageList';
import { formatPercentageNumber } from '../../../../../utils/formatter';

export const useSlippageSlider = ({
  activeSlippage,
  data,
  yPositions,
}: {
  activeSlippage?: number;
  data?: ForecastSlippageListItem[];
  yPositions: number[];
}) => {
  const [value, setValue] = React.useState(0);
  const decimalConversion = React.useMemo(() => {
    // if (!data?.length || data.length === 1) return undefined;
    // const slippageList = data.map(item => item.forecastSlippage).sort();
    // const minSlippage = slippageList[0] ?? 0;
    // const maxSlippage = slippageList[slippageList.length - 1] ?? 0;
    // const diff = maxSlippage - minSlippage;
    //The minimum adaptation is 2 decimal places, the maximum adaptation is 4 decimal places
    // if (diff > 0.0001) return 10000;
    // if (diff > 0.00001) return 100000;
    // Fixed to 4 decimal places for smoother sliding
    return 1000000;
  }, []);

  const [min, max] = React.useMemo(() => {
    const dataLen = data?.length;
    if (!dataLen) return [0, 0];
    return [
      new BigNumber(data[0].forecastSlippage ?? 0)
        .times(decimalConversion ?? 0)
        .dp(0, 1)
        .toNumber(),
      new BigNumber(data[dataLen - 1].forecastSlippage ?? 0)
        .times(decimalConversion ?? 0)
        .dp(0, 1)
        .toNumber(),
    ];
  }, [data, decimalConversion]);

  const formatValue = React.useCallback(
    (value?: number) => {
      if (value === undefined) return '';
      const valueBg = new BigNumber(value);
      if (data?.length && decimalConversion) {
        const currentData = data.find((item) =>
          new BigNumber(item.forecastSlippage ?? 0)
            .times(decimalConversion)
            .dp(0, 1)
            .isEqualTo(valueBg),
        );
        if (currentData?.forecastSlippage) {
          return formatPercentageNumber({
            input: currentData.forecastSlippage,
            showDecimals: 4,
          });
        }
      }
      return formatPercentageNumber({
        input: decimalConversion ? valueBg.div(decimalConversion) : valueBg,
        showDecimals: 4,
      });
    },
    [decimalConversion, data],
  );

  const getSliderYPosition = React.useCallback(
    (value?: number) => {
      let result = 0;
      if (!value || !data?.length || !decimalConversion) return result;
      data.some((item, index) => {
        const forecastSlippage = item.forecastSlippage ?? 0;
        const forecastSlippageConvertDecimal = new BigNumber(forecastSlippage)
          .times(decimalConversion)
          .dp(0, 1)
          .toNumber();
        if (value === forecastSlippageConvertDecimal) {
          result = yPositions[index];
          return true;
        }
        if (value < forecastSlippageConvertDecimal) {
          // If it is smaller than the first one, there is no need to calculate the height.
          if (index === 0) {
            result = 0;
            return true;
          }
          /**
           * Based on the heights on both sides of value, calculate what the height should be in the chart.
           */
          const valueDiff =
            forecastSlippage - (data[index - 1].forecastSlippage ?? 0);
          const heightDiff = yPositions[index] - yPositions[index - 1];
          const currentValueDiff =
            forecastSlippage -
            new BigNumber(value).div(decimalConversion).toNumber();
          result =
            yPositions[index] - (heightDiff / valueDiff) * currentValueDiff;
          return true;
        }
      });
      return result;
    },
    [yPositions, data, decimalConversion],
  );

  // Returns the actual slippage value
  const handleChangeValue = React.useCallback(
    (newValue: number) => {
      setValue(newValue);
      const newValueBg = new BigNumber(newValue);
      let currentDataIndex = -1;
      let result: number | undefined = undefined;
      if (data?.length && decimalConversion) {
        currentDataIndex = data.findIndex((item) =>
          new BigNumber(item.forecastSlippage ?? 0)
            .times(decimalConversion)
            .dp(0, 1)
            .isEqualTo(newValueBg),
        );
        const currentData =
          currentDataIndex !== -1 ? data[currentDataIndex] : undefined;
        result = currentData?.forecastSlippage;
      }
      if (!result) {
        result = newValueBg.div(decimalConversion ?? 0).toNumber();
      }
      return result as number;
    },
    [data, decimalConversion],
  );

  React.useEffect(() => {
    // initialize value
    if (decimalConversion && activeSlippage) {
      const newValue = new BigNumber(activeSlippage)
        .times(decimalConversion)
        .dp(0, 1);
      if (!newValue.isEqualTo(value)) {
        setValue(newValue.toNumber());
      }
    }
  }, [activeSlippage]);

  return {
    min,
    max,
    value,
    decimalConversion,
    formatValue,
    getSliderYPosition,
    handleChangeValue,
  };
};
