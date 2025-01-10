import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React from 'react';
import { POOLS_LIST_TAB } from '../../../../constants/sessionStorage';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { Box, useTheme } from '@dodoex/components';
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
  const { i18n } = useLingui();
  const theme = useTheme();
  const [poolTab, setPoolTab] = React.useState(PoolTab.addLiquidity);
  const { supportAMMV2, supportAMMV3, notSupportPMM } = useUserOptions();
  const tabs = React.useMemo(() => {
    const result = [
      {
        key: PoolTab.addLiquidity,
        value: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
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
          </Box>
        ),
      },
      {
        key: PoolTab.myLiquidity,
        value: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
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
          </Box>
        ),
      },
    ];
    if (!notSupportPMM) {
      result.push({
        key: PoolTab.myCreated,
        value: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
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
          </Box>
        ),
      });
    }
    return result;
  }, [i18n._, supportAMMV2, supportAMMV3, notSupportPMM]);

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
