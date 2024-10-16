import { Box, Skeleton, Tooltip } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { formatTokenAmountNumber } from '../../../../utils';
import { TokenAmountPopover } from './TokenAmountPopover';
import { UnknownUSDPopover } from './UnknownUSDPopover';
import { TextAndDesc } from './widgets';
import { useLingui } from '@lingui/react';

export function RewardsSection({
  chainId,
  totalRewardUSD,
  rewardTokenList,
  isDataLoading,
}: {
  chainId: number;
  totalRewardUSD?: BigNumber;
  isDataLoading: boolean;
  rewardTokenList: {
    symbolEle: string | JSX.Element | undefined;
    address: string | undefined;
    pendingReward: BigNumber | undefined;
    decimals?: number;
    symbol: string | undefined;
    logoImg: string | undefined;
  }[];
}) {
  const { i18n } = useLingui();

  const trigger = useMemo(() => {
    if (isDataLoading) {
      return <Skeleton width={60} height={24} />;
    }
    if (!totalRewardUSD) {
      return (
        <Box
          component="span"
          sx={{
            typography: 'h5',
          }}
        >
          Unknown
        </Box>
      );
    }
    return (
      <>
        <Box
          component="span"
          sx={{
            typography: 'h5',
          }}
        >
          $
        </Box>
        {formatTokenAmountNumber({
          input: totalRewardUSD,
          decimals: 4,
        })}
      </>
    );
  }, [totalRewardUSD, isDataLoading]);

  return (
    <Tooltip
      title={i18n._('Amount of token rewards')}
      sx={{
        ml: 4,
        mt: -2,
      }}
    >
      <TextAndDesc
        text={
          <>
            <TokenAmountPopover
              trigger={trigger}
              tokenList={rewardTokenList.map(
                ({ symbolEle, address, pendingReward, decimals, logoImg }) => ({
                  symbolEle,
                  address,
                  logoImg,
                  rightContent: formatTokenAmountNumber({
                    input: pendingReward,
                    decimals,
                  }),
                }),
              )}
            />
            {!isDataLoading && !totalRewardUSD && (
              <UnknownUSDPopover
                tokenSymbolList={rewardTokenList.map(({ symbol }) => symbol)}
              />
            )}
          </>
        }
      >
        {i18n._('Rewards')}
      </TextAndDesc>
    </Tooltip>
  );
}
