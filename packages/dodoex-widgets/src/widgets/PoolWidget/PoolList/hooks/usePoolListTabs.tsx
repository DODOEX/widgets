import { Box, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import React from 'react';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { POOLS_LIST_TAB } from '../../../../constants/sessionStorage';
import { ReactComponent as AllPoolIcon } from '../assets/all-pool.svg';
import { ReactComponent as MyLiquidityIcon } from '../assets/my-liquidity.svg';
import { ReactComponent as MyPoolIcon } from '../assets/my-pool.svg';

export enum PoolTab {
  addLiquidity = 'add-liquidity',
  myLiquidity = 'my-liquidity',
  myCreated = 'my-created',
}

export function usePoolListTabs({
  account,
  paramsTab,
}: {
  account?: string;
  paramsTab: PoolTab | undefined;
}) {
  const theme = useTheme();
  const [poolTab, setPoolTab] = React.useState(PoolTab.addLiquidity);
  const { supportAMMV2, supportAMMV3, notSupportPMM } = useUserOptions();
  const tabs = React.useMemo(() => {
    const result = [
      {
        key: PoolTab.addLiquidity,
        value: (
          <>
            <Box
              component={AllPoolIcon}
              sx={{
                width: 28,
                height: 28,
                [theme.breakpoints.up('tablet')]: {
                  width: 32,
                  height: 32,
                },
              }}
            />
            {t`Add Liquidity`}
          </>
        ),
      },
      {
        key: PoolTab.myLiquidity,
        value: (
          <>
            <Box
              component={MyLiquidityIcon}
              sx={{
                width: 28,
                height: 28,
                [theme.breakpoints.up('tablet')]: {
                  width: 32,
                  height: 32,
                },
              }}
            />
            {t`My Liquidity`}
          </>
        ),
      },
    ];
    if (!notSupportPMM) {
      result.push({
        key: PoolTab.myCreated,
        value: (
          <>
            <Box
              component={MyPoolIcon}
              sx={{
                width: 28,
                height: 28,
                [theme.breakpoints.up('tablet')]: {
                  width: 32,
                  height: 32,
                },
              }}
            />
            {supportAMMV2 || supportAMMV3 ? t`My Pools (PMM)` : t`My Pools`}
          </>
        ),
      });
    }
    return result;
  }, [theme.breakpoints, notSupportPMM, supportAMMV2, supportAMMV3]);

  const isSetPoolTabCache = React.useRef(false);
  React.useEffect(() => {
    const poolTabCache = sessionStorage.getItem(POOLS_LIST_TAB);
    if (!!account && poolTabCache && !isSetPoolTabCache.current) {
      isSetPoolTabCache.current = true;
      setPoolTab(poolTabCache as PoolTab);
    }
  }, [account]);

  const handleChangePoolTab = (poolTab: PoolTab) => {
    setPoolTab(poolTab);
    sessionStorage.setItem(POOLS_LIST_TAB, poolTab);
  };

  React.useEffect(() => {
    if (paramsTab) {
      handleChangePoolTab(paramsTab);
    }
  }, [paramsTab]);

  return {
    poolTab,
    tabs,
    handleChangePoolTab,
  };
}
