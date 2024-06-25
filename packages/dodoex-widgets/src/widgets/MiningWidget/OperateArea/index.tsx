import {
  Box,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { AssociatedMine } from './AssociateMine';
import { FetchMiningListItem, OperateType } from '../types';
import { TokenInfo } from '../../../hooks/Token';
import { convertFetchTokenToTokenInfo } from '../../../utils';
import { t } from '@lingui/macro';
import { usePoolBalanceInfo } from '../../PoolWidget/hooks/usePoolBalanceInfo';
import { useWeb3React } from '@web3-react/core';
import { StakeButton } from './StakeButton';
import GetLpLink from './GetLpLink';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { MiningStatusE } from '@dodoex/api';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { miningApi } from '../helper';
import BigNumber from 'bignumber.js';
import UnstakeButton from './UnstakeButton';
import { RewardListCard } from './RewardListCard';
import ClaimButton from './ClaimButton';

export default function OperateArea({
  chainId,
  status,
  loading,
  operateType,
  setOperateType,
  miningItem,
  associatedMineSectionVisible,
  balanceInfo,
  goLpLink,
}: {
  chainId: number;
  status: MiningStatusE;
  loading?: boolean;
  operateType: OperateType;
  setOperateType: React.Dispatch<React.SetStateAction<OperateType>>;
  miningItem: FetchMiningListItem;
  associatedMineSectionVisible?: boolean;
  balanceInfo: ReturnType<typeof usePoolBalanceInfo>;
  goLpLink?: () => void;
}) {
  const theme = useTheme();
  const { account } = useWeb3React();
  const { miningContractAddress } = miningItem ?? {};
  const baseToken = convertFetchTokenToTokenInfo(
    miningItem?.baseToken,
    chainId,
  );
  const quoteToken = convertFetchTokenToTokenInfo(
    miningItem?.quoteToken,
    chainId,
  );
  const rewardTokenList =
    (miningItem?.rewardTokenInfos?.map?.((rewardToken) =>
      convertFetchTokenToTokenInfo(rewardToken, chainId),
    ) as TokenInfo[] | undefined) ?? [];

  const [currentStakeTokenAmount, setCurrentStakeTokenAmount] =
    React.useState('');
  const [currentUnstakeTokenAmount, setCurrentUnstakeTokenAmount] =
    React.useState('');

  const operateTypes = [
    { key: 'stake', value: t`Stake` },
    { key: 'unstake', value: t`Unstake` },
    { key: 'claim', value: t`Claim` },
  ];

  const hasLp = true;
  const hasNotLp = false;
  const hasLpForNewUser = false;

  const lpTokenAccountBalanceQuery = useQuery(
    miningApi.getLpStakedBalance(
      miningItem?.chainId,
      miningItem?.miningContractAddress || undefined,
      account,
      miningItem?.baseLpToken?.address ?? '',
      miningItem?.baseToken?.decimals as number | undefined,
      '3',
    ),
  );

  const stakedTokenList =
    baseToken && quoteToken ? [baseToken, quoteToken] : [];

  const tokenSymbol =
    baseToken && quoteToken
      ? `${baseToken.symbol}-${quoteToken.symbol} LP`
      : '- LP';

  const isEnded = status === MiningStatusE.ended;

  // TODO: only support lptoken
  const stakedTokenUSDLoading = lpTokenAccountBalanceQuery.isLoading;
  let stakedTokenUSD: BigNumber | undefined = undefined;
  if (
    lpTokenAccountBalanceQuery.data &&
    balanceInfo.baseLpToTokenProportion &&
    miningItem?.baseToken?.price
  ) {
    stakedTokenUSD = lpTokenAccountBalanceQuery.data
      .times(balanceInfo.baseLpToTokenProportion)
      .times(miningItem?.baseToken?.price);
  }

  return (
    <>
      <Box
        sx={{
          paddingTop: 20,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: theme.palette.background.paper,
          px: 20,
          paddingBottom: hasNotLp || hasLpForNewUser ? 20 : 0,
          borderBottomLeftRadius: hasNotLp || hasLpForNewUser ? 16 : 0,
          borderBottomRightRadius: hasNotLp || hasLpForNewUser ? 16 : 0,
        }}
      >
        {associatedMineSectionVisible && (
          <AssociatedMine
            chainId={chainId}
            miningContractAddress={miningContractAddress ?? ''}
            loading={loading}
            miningItem={miningItem}
            stakedTokenUSD={stakedTokenUSD}
            stakedTokenUSDLoading={stakedTokenUSDLoading}
            miningTitle={miningItem?.title ?? ''}
            stakedTokenList={stakedTokenList}
            rewardTokenList={rewardTokenList}
          />
        )}

        <Tabs
          value={operateType}
          onChange={(_, value) => {
            setOperateType(value as OperateType);
          }}
        >
          <TabsButtonGroup
            tabs={operateTypes}
            variant="inPaper"
            tabsListSx={{
              mt: 16,
            }}
          />
          <TabPanel value="stake">
            <Box
              sx={{
                mt: 20,
                borderColor: theme.palette.border.main,
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 20,
                py: 16,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TokenLogoPair
                  width={stakedTokenList.length > 1 ? 20 : 28}
                  tokens={stakedTokenList}
                  chainId={chainId}
                />
                <Box
                  sx={{
                    ml: 8,
                    typography: 'body1',
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  {tokenSymbol}
                </Box>
              </Box>

              {!!goLpLink && (
                <GetLpLink tokenSymbol={tokenSymbol} goLpLink={goLpLink} />
              )}
            </Box>

            {(hasLp || hasLpForNewUser) && (
              <TokenCard
                showPercentage
                hideToken
                inputTypography="h1"
                balanceText={t`LP Balance:`}
                overrideBalance={
                  balanceInfo.userBaseLpBalance || new BigNumber('-')
                }
                overrideBalanceLoading={balanceInfo.loading}
                amt={currentStakeTokenAmount}
                onInputChange={(value) => {
                  setCurrentStakeTokenAmount(value);
                }}
                readOnly={isEnded || loading}
                token={baseToken}
                occupiedChainId={chainId}
                chainId={chainId}
                sx={{
                  mt: 20,
                  borderWidth: 1,
                }}
              />
            )}
            <Box
              sx={{
                mt: 20,
              }}
            >
              <StakeButton
                miningItem={miningItem}
                balanceInfo={balanceInfo}
                amount={currentStakeTokenAmount}
                goLpLink={goLpLink}
              />
            </Box>
          </TabPanel>
          <TabPanel value="unstake">
            <TokenCard
              showPercentage
              hideToken
              inputTypography="h1"
              balanceText={t`LP Balance:`}
              overrideBalance={
                lpTokenAccountBalanceQuery.data || new BigNumber('-')
              }
              overrideBalanceLoading={lpTokenAccountBalanceQuery.isLoading}
              amt={
                isEnded
                  ? lpTokenAccountBalanceQuery.data?.toString() ?? ''
                  : currentUnstakeTokenAmount
              }
              onInputChange={(value) => {
                setCurrentUnstakeTokenAmount(value);
              }}
              readOnly={isEnded || loading}
              token={baseToken}
              occupiedChainId={chainId}
              chainId={chainId}
              sx={{
                mt: 20,
                borderWidth: 1,
              }}
            />
            <Box
              sx={{
                mt: 20,
              }}
            >
              <UnstakeButton
                miningItem={miningItem}
                overrideBalance={lpTokenAccountBalanceQuery.data}
                amount={currentUnstakeTokenAmount}
              />
            </Box>
          </TabPanel>
          <TabPanel value="claim">
            <RewardListCard
              miningItem={miningItem}
              loading={loading}
              sx={{
                mt: 20,
              }}
            />
            <Box
              sx={{
                mt: 20,
              }}
            >
              <ClaimButton miningItem={miningItem} />
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    </>
  );
}
