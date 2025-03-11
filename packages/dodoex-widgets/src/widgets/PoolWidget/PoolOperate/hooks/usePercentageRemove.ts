import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import { fixedString } from '../../../../utils/formatter';
import { OperatePool } from '../types';

export const initSliderPercentage = 50;

export enum RemoveMode {
  quantity = 1,
  percentage,
}

export function usePercentageRemove({
  isBase,
  pool,
  baseOverride,
  quoteOverride,
  resetAmount,
  handleChangeBaseAmount,
  handleChangeQuoteAmount,
}: {
  isBase: boolean | undefined;
  pool: OperatePool | undefined;
  baseOverride: BigNumber | undefined | null;
  quoteOverride: BigNumber | undefined | null;
  resetAmount?: () => void;
  handleChangeBaseAmount?: (val: string) => void;
  handleChangeQuoteAmount?: (val: string) => void;
}) {
  const [mode, setMode] = React.useState(RemoveMode.percentage);
  const [sliderPercentage, setSliderPercentage] =
    React.useState(initSliderPercentage);

  const changeSliderPercentageTime = React.useRef<NodeJS.Timeout | null>(null);
  const clearPercentageChangeTimer = () => {
    if (changeSliderPercentageTime.current) {
      clearTimeout(changeSliderPercentageTime.current);
    }
  };

  const handleChangeSliderPercentage = (val: number) => {
    clearPercentageChangeTimer();
    if (val !== sliderPercentage) {
      setSliderPercentage(val);
    }
    if (!pool) return;
    const max = val === 100;
    const changeAmount = () => {
      if (!pool) return;
      if (isBase || isBase === undefined) {
        if (baseOverride) {
          let raw = baseOverride.toString();
          if (!max) {
            raw = fixedString(
              baseOverride.times(val / 100),
              pool.baseToken.decimals,
            );
          }
          handleChangeBaseAmount?.(raw);
        }
      } else if (quoteOverride) {
        let raw = quoteOverride.toString();
        if (max) {
        } else {
          raw = fixedString(
            quoteOverride.times(val / 100),
            pool.quoteToken.decimals,
          );
        }
        handleChangeQuoteAmount?.(raw);
      }
    };
    if (max) {
      changeAmount();
    } else {
      changeSliderPercentageTime.current = setTimeout(changeAmount, 100);
    }
  };

  const resetPercentage = () => {
    clearPercentageChangeTimer();
    setSliderPercentage(initSliderPercentage);
  };

  React.useEffect(() => {
    return clearPercentageChangeTimer;
  }, []);

  const handleChangeMode = (mode: RemoveMode) => {
    setMode(mode);
    resetAmount?.();
    resetPercentage();
  };

  const modeOptions = [
    // {
    //   key: RemoveMode.quantity,
    //   value: t`Quantity model`,
    // },
    {
      key: RemoveMode.percentage,
      value: t`Percentage to remove`,
    },
  ];

  return {
    mode,
    modeOptions,
    handleChangeMode,

    sliderPercentage,
    handleChangeSliderPercentage,

    resetPercentage,
  };
}
