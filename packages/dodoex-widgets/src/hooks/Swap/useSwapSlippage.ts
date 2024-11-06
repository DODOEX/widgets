import BigNumber from 'bignumber.js';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { TokenInfo } from '../Token/type';
import { useCustomSlippage } from './useCustomSlippage';
import { useForecastSlippageList } from './useForecastSlippageList';

export function useSwapSlippage({
  fromToken,
  toToken,
}: {
  fromToken?: TokenInfo | null;
  toToken?: TokenInfo | null;
}) {
  const { customSlippage, customSlippageNum, handleSlippageChange } =
    useCustomSlippage({
      fromToken,
      toToken,
    });
  const { defaultSlippage } = useDefaultSlippage(false);
  const forecastSlippageQuery = useForecastSlippageList({
    fromToken,
    toToken,
  });
  const forecastSlippageOrigin =
    forecastSlippageQuery.slippageData.recommendSlippage?.forecastSlippage;
  const forecastSlippage = forecastSlippageOrigin
    ? new BigNumber(forecastSlippageOrigin).times(100).toNumber()
    : forecastSlippageOrigin;
  const recommendSlippage = forecastSlippage ?? defaultSlippage ?? 0;

  return {
    customSlippage,
    customSlippageNum,
    handleSlippageChange,
    forecastSlippage,
    forecastSlippageQuery,
    recommendSlippage,
    slippage:
      (customSlippage ? Number(customSlippage) : undefined) ??
      forecastSlippage ??
      defaultSlippage,
    slippageLoading: forecastSlippageQuery.isLoading,
  };
}
