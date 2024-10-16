import { Box, Skeleton, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import {
  formatShortNumber,
  formatTokenAmountNumber,
} from '../../../../utils/formatter';
import {
  CompositeMiningContractDataI,
  MiningStakeTokenWithAmountI,
  TabMiningI,
} from '../../types';
import { TokenAmountPopover } from './TokenAmountPopover';
import { UnknownUSDPopover } from './UnknownUSDPopover';
import { TextAndDesc } from './widgets';

export function MyStakedSection({
  chainId,
  miningMinings,
  contractData,
  chainError,
  stakedTokenList,
  stakedTokenUSD,
  isDataLoading,
  lpTokenAccountStakedBalanceLoading,
}: {
  chainError?: boolean;
  stakedTokenList: Array<MiningStakeTokenWithAmountI>;
  stakedTokenUSD?: BigNumber;
  isDataLoading: boolean;
  contractData: CompositeMiningContractDataI | undefined;
  lpTokenAccountStakedBalanceLoading: boolean;
} & Pick<TabMiningI, 'chainId' | 'miningMinings'>) {
  const { i18n } = useLingui();
  const theme = useTheme();

  const hasStaked = useMemo(() => {
    if (!contractData) {
      return false;
    }
    const { balanceDataMap } = contractData;
    return (
      miningMinings.findIndex((m) => {
        const { id } = m;
        const balanceData = balanceDataMap.get(id);
        if (!balanceData) {
          return false;
        }
        const { lpTokenAccountStakedBalance } = balanceData;

        return lpTokenAccountStakedBalance?.gt(0);
      }) >= 0
    );
  }, [contractData, miningMinings]);

  const unknownError =
    !(isDataLoading || lpTokenAccountStakedBalanceLoading) && !stakedTokenUSD;

  const trigger = useMemo(() => {
    if (isDataLoading || lpTokenAccountStakedBalanceLoading) {
      return <Skeleton variant="rounded" width={38} height={17} />;
    }

    if (chainError) {
      return <Box>$-</Box>;
    }

    if (unknownError) {
      return <Box>Unknown</Box>;
    }

    return (
      <Box>
        {stakedTokenUSD ? `$${formatShortNumber(stakedTokenUSD, 2)}` : '-'}
      </Box>
    );
  }, [
    chainError,
    isDataLoading,
    lpTokenAccountStakedBalanceLoading,
    stakedTokenUSD,
    unknownError,
  ]);

  if (!hasStaked && !lpTokenAccountStakedBalanceLoading) {
    return null;
  }

  return (
    <TextAndDesc
      text={
        <>
          <TokenAmountPopover
            trigger={trigger}
            sx={{
              typography: 'h5',
              fontWeight: 600,
            }}
            tokenList={stakedTokenList.map(
              ({ symbol, address, sourceTokenAmount, decimals, logoImg }) => ({
                symbolEle: symbol,
                address,
                logoImg,
                rightContent: formatTokenAmountNumber({
                  input: sourceTokenAmount,
                  decimals,
                }),
              }),
            )}
          />
          {unknownError && (
            <UnknownUSDPopover
              tokenSymbolList={stakedTokenList.map(({ symbol }) => symbol)}
            />
          )}
        </>
      }
      sx={{
        ml: 28,
        pl: 28,
        minWidth: 37,
        position: 'relative',
        '&:before': {
          position: 'absolute',
          content: '""',
          top: 8,
          left: 0,
          height: 24,
          width: '1px',
          backgroundColor: theme.palette.divider,
        },
      }}
    >
      {i18n._('Staked')}
    </TextAndDesc>
  );
}
