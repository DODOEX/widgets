import { MiningStatusE, PoolType } from '@dodoex/api';
import {
  Box,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { BalanceData } from '../../../hooks/Submission/useBalanceUpdateLoading';
import {
  convertFetchTokenToTokenInfo,
  formatTokenAmountNumber,
} from '../../../utils';
import { usePoolBalanceInfo } from '../../PoolWidget/hooks/usePoolBalanceInfo';
import { poolApi } from '../../PoolWidget/utils';
import { miningApi } from '../helper';
import { FetchMiningListItem, OperateType } from '../types';
import { AssociatedMine } from './AssociateMine';
import ClaimButton from './ClaimButton';
import GetLpLink from './GetLpLink';
import { RewardListCard } from './RewardListCard';
import { StakeButton } from './StakeButton';
import UnstakeButton from './UnstakeButton';
import { OperateButtonWrapper } from './Widgets';

export default function OperateArea({
  chainId,
  poolAddress,
  status,
  loading,
  operateType,
  setOperateType,
  miningItem,
  associatedMineSectionVisible,
  goLpLink,
}: {
  chainId: number;
  poolAddress: string;
  status: MiningStatusE;
  loading?: boolean;
  operateType: OperateType;
  setOperateType: React.Dispatch<React.SetStateAction<OperateType>>;
  miningItem: FetchMiningListItem;
  associatedMineSectionVisible?: boolean;
  goLpLink?: () => void;
}) {
  const theme = useTheme();
  const { account } = useWalletInfo();
  const { miningContractAddress } = miningItem ?? {};
  const baseToken = convertFetchTokenToTokenInfo(
    miningItem?.baseToken,
    chainId,
  );
  const quoteToken = convertFetchTokenToTokenInfo(
    miningItem?.quoteToken,
    chainId,
  );

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

  // TODO: Currently only these two types are supported
  const pool =
    miningItem &&
    baseToken &&
    quoteToken &&
    ['classical', 'lptoken'].includes(miningItem.type ?? '')
      ? {
          chainId,
          address: poolAddress,
          /** Because only these two types are currently supported, they are written to death here. To support other types later, you need to modify this */
          type: (miningItem.type === 'lptoken'
            ? 'DSP'
            : 'CLASSICAL') as PoolType,
          baseToken: baseToken,
          quoteToken: quoteToken,
        }
      : undefined;
  const balanceInfo = usePoolBalanceInfo({
    account,
    pool:
      miningItem &&
      baseToken &&
      quoteToken &&
      miningItem.baseLpToken &&
      miningItem.quoteLpToken &&
      ['classical', 'lptoken'].includes(miningItem.type ?? '')
        ? {
            chainId,
            address: poolAddress,
            /** Because only these two types are currently supported, they are written to death here. To support other types later, you need to modify this */
            type: (miningItem.type === 'lptoken'
              ? 'DSP'
              : 'CLASSICAL') as PoolType,
            baseTokenDecimals: baseToken.decimals,
            quoteTokenDecimals: quoteToken.decimals,
            baseLpTokenDecimals: miningItem.baseLpToken.decimals ?? 18,
            quoteLpTokenDecimals: miningItem.quoteLpToken.decimals ?? 18,
          }
        : undefined,
  });
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      pool?.chainId as number,
      pool?.address,
      pool?.type,
      pool?.baseToken?.decimals,
      pool?.quoteToken?.decimals,
    ),
  );

  const lpTokenAccountBalanceQuery = useQuery(
    miningApi.getLpStakedBalance(
      miningItem?.chainId,
      miningItem?.miningContractAddress || undefined,
      account,
      miningItem?.baseLpToken?.address ?? '',
      miningItem?.baseToken?.decimals as number | undefined,
      miningItem?.version as '2' | '3' | undefined,
    ),
  );

  // TODO: only support lptoken
  const stakedTokenUSDLoading =
    lpTokenAccountBalanceQuery.isLoading || pmmStateQuery.isLoading;
  let stakedTokenUSD: BigNumber | undefined = undefined;
  let baseTokenAmount: BigNumber | undefined = undefined;
  let quoteTokenAmount: BigNumber | undefined = undefined;
  if (
    lpTokenAccountBalanceQuery.data &&
    balanceInfo.baseLpToTokenProportion &&
    balanceInfo.quoteLpToTokenProportion &&
    !pmmStateQuery.isLoading
  ) {
    const baseFiatPrice = miningItem?.baseToken?.price;
    const quoteFiatPrice = miningItem?.quoteToken?.price;
    const midPrice = pmmStateQuery.data?.midPrice;
    baseTokenAmount = lpTokenAccountBalanceQuery.data.times(
      balanceInfo.baseLpToTokenProportion,
    );
    quoteTokenAmount = lpTokenAccountBalanceQuery.data.times(
      balanceInfo.quoteLpToTokenProportion,
    );

    if (midPrice) {
      if (quoteFiatPrice) {
        stakedTokenUSD = baseTokenAmount
          .times(midPrice)
          .plus(quoteTokenAmount)
          .times(quoteFiatPrice);
      } else if (baseFiatPrice) {
        stakedTokenUSD = quoteTokenAmount
          .times(midPrice)
          .plus(baseTokenAmount)
          .times(baseFiatPrice);
      }
    } else if (baseFiatPrice && quoteFiatPrice) {
      stakedTokenUSD = baseTokenAmount
        .times(baseFiatPrice)
        .plus(quoteTokenAmount.times(quoteFiatPrice));
    }
  }

  const stakedTokenList =
    baseToken && quoteToken
      ? [
          {
            ...baseToken,
            amount: formatTokenAmountNumber({
              input: baseTokenAmount,
              decimals: baseToken.decimals,
            }),
          },
          {
            ...quoteToken,
            amount: formatTokenAmountNumber({
              input: quoteTokenAmount,
              decimals: quoteToken.decimals,
            }),
          },
        ]
      : [];

  const tokenSymbol =
    baseToken && quoteToken
      ? `${baseToken.symbol}-${quoteToken.symbol} LP`
      : '- LP';

  const isEnded = status === MiningStatusE.ended;

  const logBalance: BalanceData =
    miningItem?.baseLpToken?.address && balanceInfo.userBaseLpBalance
      ? {
          [miningItem?.baseLpToken?.address]:
            balanceInfo.userBaseLpBalance.toString(),
        }
      : {};

  const successBack = () => {
    balanceInfo.refetch();
    pmmStateQuery.refetch();
    lpTokenAccountBalanceQuery.refetch();
  };

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
                canClickBalance
                onInputChange={(value) => {
                  setCurrentStakeTokenAmount(value);
                }}
                readOnly={isEnded || loading}
                token={baseToken}
                checkLogBalance={logBalance}
                occupiedChainId={chainId}
                chainId={chainId}
                sx={{
                  mt: 20,
                  borderWidth: 1,
                }}
              />
            )}
            <OperateButtonWrapper>
              <StakeButton
                miningItem={miningItem}
                balanceInfo={balanceInfo}
                amount={currentStakeTokenAmount}
                goLpLink={goLpLink}
                submittedBack={() => setCurrentStakeTokenAmount('')}
                successBack={successBack}
                logBalance={logBalance}
              />
            </OperateButtonWrapper>
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
                  ? (lpTokenAccountBalanceQuery.data?.toString() ?? '')
                  : currentUnstakeTokenAmount
              }
              onInputChange={(value) => {
                setCurrentUnstakeTokenAmount(value);
              }}
              canClickBalance
              readOnly={isEnded || loading}
              token={baseToken}
              checkLogBalance={logBalance}
              occupiedChainId={chainId}
              chainId={chainId}
              sx={{
                mt: 20,
                borderWidth: 1,
              }}
            />
            <OperateButtonWrapper>
              <UnstakeButton
                miningItem={miningItem}
                overrideBalance={lpTokenAccountBalanceQuery.data}
                amount={currentUnstakeTokenAmount}
                submittedBack={() => setCurrentUnstakeTokenAmount('')}
                successBack={successBack}
                logBalance={logBalance}
              />
            </OperateButtonWrapper>
          </TabPanel>
          <TabPanel value="claim">
            <RewardListCard
              miningItem={miningItem}
              loading={loading}
              sx={{
                mt: 20,
              }}
            />
            <OperateButtonWrapper>
              <ClaimButton miningItem={miningItem} />
            </OperateButtonWrapper>
          </TabPanel>
        </Tabs>
      </Box>
    </>
  );
}
