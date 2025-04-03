import { ChainId, PoolApi, PoolType } from '@dodoex/api';
import { Box, Button, Tooltip, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import LiquidityLpPartnerReward from '../../../components/LiquidityLpPartnerReward';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import {
  byWei,
  formatApy,
  formatExponentialNotation,
  formatPercentageNumber,
  formatReadableNumber,
} from '../../../utils';
import LiquidityTable from '../../PoolWidget/PoolList/components/LiquidityTable';
import { FetchVe33PoolList } from '../../PoolWidget/utils';
import { FEE_AMOUNT_DETAIL } from '../AMMV3/components/shared';
import { FeeAmount } from '../AMMV3/sdks/v3-sdk';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { Ve33PoolOperateProps } from '../types';
import {
  convertFetchLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  getPoolAMMOrPMM,
} from '../utils';
import AddingOrRemovingBtn from './components/AddingOrRemovingBtn';
import GoPoolDetailBtn from './components/GoPoolDetailBtn';
import PoolApyTooltip from './components/PoolApyTooltip';

export interface TableListProps {
  poolList: FetchVe33PoolList;
  operatePool: Ve33PoolOperateProps;
  setOperatePool: (operate: Ve33PoolOperateProps) => void;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
}

export const TableList = ({
  poolList,
  operatePool,
  setOperatePool,
  hasMore,
  loadMore,
  loadMoreLoading,
}: TableListProps) => {
  const theme = useTheme();
  return (
    <LiquidityTable
      hasMore={hasMore}
      loadMore={loadMore}
      loadMoreLoading={loadMoreLoading}
    >
      <Box component="thead">
        <Box component="tr">
          <Box component="th">
            <Trans>Pair</Trans>
          </Box>
          <Box component="th">
            <Trans>APR</Trans>
          </Box>
          <Box component="th">
            <Trans>TVL</Trans>
          </Box>
          <Box component="th">
            <Trans>Volume</Trans>
          </Box>
          <Box component="th">
            <Trans>Fees</Trans>
          </Box>
          <Box
            component="th"
            sx={{
              width: 136,
            }}
          ></Box>
        </Box>
      </Box>
      <Box component="tbody">
        {poolList?.map((pool) => {
          if (!pool?.pair) return null;
          const item = pool.pair;
          const baseToken = convertLiquidityTokenToTokenInfo(
            item.baseToken,
            item.chainId,
          );
          const quoteToken = convertLiquidityTokenToTokenInfo(
            item.quoteToken,
            item.chainId,
          );
          const baseApy = item.apy
            ? formatApy(
                new BigNumber(item.apy?.transactionBaseApy)
                  .plus(item.apy?.miningBaseApy ?? 0)
                  .plus(item.apy?.metromMiningApy ?? 0),
              )
            : undefined;
          const quoteApy =
            PoolApi.utils.singleSideLp(item.type as PoolType) && item.apy
              ? formatApy(
                  new BigNumber(item.apy.transactionQuoteApy).plus(
                    item.apy.miningQuoteApy ?? 0,
                  ),
                )
              : undefined;

          let operateBtnText = '';
          if (
            operatePool?.pool?.address === item.id ||
            operatePool?.address === item.id
          ) {
            switch (operatePool.operate) {
              case OperateTab.Remove:
                operateBtnText = t`Removing`;
                break;
              default:
                operateBtnText = t`Adding`;
                break;
            }
          }

          const hasMining = !!item.miningAddress?.[0];
          const hasMetromMining =
            !!item.apy?.metromMiningApy &&
            Number(item.apy?.metromMiningApy) > 0;

          const type = item.type as PoolType;
          const poolType = getPoolAMMOrPMM(type);
          const isAMMV2 = type === 'AMMV2';
          const isAMMV3 = type === 'AMMV3';

          const hoverBg = theme.palette.background.tag;
          return (
            <Box
              component="tr"
              key={item.id + item.chainId}
              sx={{
                [`&:hover td${operateBtnText ? ', & td' : ''}`]: {
                  backgroundImage: `linear-gradient(${hoverBg}, ${hoverBg})`,
                },
              }}
            >
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {baseToken && quoteToken ? (
                    <TokenLogoPair
                      tokens={[baseToken, quoteToken]}
                      width={24}
                      mr={10}
                      chainId={item.chainId}
                      showChainLogo
                    />
                  ) : (
                    ''
                  )}
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        typography: 'body2',
                        fontWeight: 600,
                      }}
                    >
                      {`${baseToken?.symbol}/${quoteToken?.symbol}`}
                      <LiquidityLpPartnerReward
                        address={item.id}
                        chainId={item.chainId}
                      />
                    </Box>
                    <AddressWithLinkAndCopy
                      address={item.id}
                      customChainId={item.chainId}
                      truncate
                      showCopy
                      iconDarkHover
                      iconSize={14}
                      iconSpace={4}
                      sx={{
                        typography: 'h6',
                        color: 'text.secondary',
                      }}
                      disabledAddress={supportAMM}
                      onAddressClick={() => {
                        useRouterStore.getState().push({
                          type: PageType.PoolDetail,
                          params: {
                            chainId: item.chainId as ChainId,
                            address: item.id as string,
                          },
                        });
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              {supportAMM && (
                <Box component="td">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Box
                      sx={{
                        px: 8,
                        py: 4,
                        borderRadius: 4,
                        typography: 'h6',
                        backgroundColor: 'background.tag',
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {poolType}
                    </Box>
                    <Tooltip title={<Trans>Fee rate</Trans>}>
                      <Box
                        sx={{
                          px: 8,
                          py: 4,
                          borderRadius: 4,
                          typography: 'h6',
                          backgroundColor: 'background.tag',
                          color: 'text.secondary',
                        }}
                      >
                        {isAMMV3
                          ? (FEE_AMOUNT_DETAIL[item.lpFeeRate as FeeAmount]
                              ?.label ?? '-')
                          : formatPercentageNumber({
                              input: new BigNumber(item.lpFeeRate ?? 0).plus(
                                item.mtFeeRate
                                  ? byWei(item.mtFeeRate, isAMMV2 ? 4 : 18)
                                  : 0,
                              ),
                            })}
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              )}
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                  }}
                  title={
                    item.tvl
                      ? `$${formatReadableNumber({
                          input: item.tvl,
                        })}`
                      : undefined
                  }
                >
                  ${formatExponentialNotation(new BigNumber(item.tvl))}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {hasMining || hasMetromMining ? (
                    <Tooltip title={t`Mining`}>
                      <Box
                        component="span"
                        sx={{
                          typography: 'body2',
                          color: 'success.main',
                        }}
                      >
                        ✨{' '}
                      </Box>
                    </Tooltip>
                  ) : (
                    ''
                  )}
                  <PoolApyTooltip
                    chainId={item.chainId}
                    apy={item.apy}
                    baseToken={baseToken}
                    quoteToken={quoteToken}
                    hasQuote={!!quoteApy}
                    hasMining={hasMining}
                  >
                    <Box
                      component="span"
                      sx={{
                        typography: 'body2',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        width: 'max-content',
                        color: 'success.main',
                        cursor: 'auto',
                      }}
                    >
                      {baseApy}
                      {quoteApy ? `/${quoteApy}` : ''}
                    </Box>
                  </PoolApyTooltip>
                </Box>
              </Box>
              {supportAMM && (
                <Box component="td">
                  ${formatReadableNumber({ input: item.volume24H || 0 })}
                </Box>
              )}
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                  }}
                >
                  {supportAMM && poolType === 'PMM' && (
                    <GoPoolDetailBtn chainId={item.chainId} address={item.id} />
                  )}
                  {operateBtnText ? (
                    <AddingOrRemovingBtn
                      text={operateBtnText}
                      onClick={() => setOperatePool(null)}
                    />
                  ) : (
                    <Button
                      size={Button.Size.small}
                      onClick={() => {
                        setOperatePool({
                          pool: convertFetchLiquidityToOperateData(lq),
                          hasMining,
                        });
                      }}
                    >
                      {t`Add`}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </LiquidityTable>
  );
};
