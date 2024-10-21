import BigNumber from 'bignumber.js';
import React from 'react';
import { ForecastSlippageListItem } from '../../../../../hooks/Swap/useForecastSlippageList';
import { formatPercentageNumber } from '../../../../../utils/formatter';

export function useSuccessRate({
  data,
  activeSlippage,
  hoverValue,
  decimalConversion,
}: {
  data?: ForecastSlippageListItem[] | undefined;
  activeSlippage: number | undefined;
  hoverValue: number | null;
  decimalConversion: number | undefined;
}) {
  const successRate = React.useMemo(() => {
    let successRate = '-';
    if (activeSlippage && data?.length) {
      const isMatch = data.some((item, index) => {
        const forecastSlippage = item.forecastSlippage ?? 0;
        if (activeSlippage === forecastSlippage) {
          successRate = formatPercentageNumber({
            input: item?.confidenceRatio ?? 0,
          });
          return true;
        } else if (activeSlippage < forecastSlippage) {
          if (index === 0) {
            successRate = `< ${formatPercentageNumber({
              input: item?.confidenceRatio ?? 0,
            })}`;
          } else {
            const lastRate = formatPercentageNumber({
              input: data[index - 1]?.confidenceRatio ?? 0,
            });
            const nextRate = formatPercentageNumber({
              input: item?.confidenceRatio ?? 0,
            });
            successRate = `${lastRate} - ${nextRate}`;
          }
          return true;
        }
        return false;
      });
      if (!isMatch) {
        successRate = `> ${formatPercentageNumber({
          input: data[data.length - 1]?.confidenceRatio ?? 0,
        })}`;
      }
    }
    return successRate;
  }, [data, activeSlippage]);

  const hoverSuccessRate = React.useMemo(() => {
    let successRate = '';
    if (hoverValue && data?.length && decimalConversion) {
      const isMatch = data.some((item, index) => {
        const forecastSlippage = item.forecastSlippage ?? 0;
        const forecastSlippageConvertDecimal = new BigNumber(forecastSlippage)
          .times(decimalConversion)
          .dp(0, 1)
          .toNumber();
        if (hoverValue === forecastSlippageConvertDecimal) {
          successRate = formatPercentageNumber({
            input: item?.confidenceRatio ?? 0,
          });
          return true;
        } else if (hoverValue < forecastSlippageConvertDecimal) {
          if (index === 0) {
            successRate = `< ${formatPercentageNumber({
              input: item?.confidenceRatio ?? 0,
            })}`;
          } else {
            const lastRate = formatPercentageNumber({
              input: data[index - 1]?.confidenceRatio ?? 0,
            });
            const nextRate = formatPercentageNumber({
              input: item?.confidenceRatio ?? 0,
            });
            successRate = `${lastRate} - ${nextRate}`;
          }
          return true;
        }
        return false;
      });
      if (!isMatch) {
        successRate = `> ${formatPercentageNumber({
          input: data[data.length - 1]?.confidenceRatio ?? 0,
        })}`;
      }
    }
    return successRate;
  }, [hoverValue, decimalConversion, data]);

  return {
    successRate,
    hoverSuccessRate,
  };
}
