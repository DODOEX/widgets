import { alpha, Box, Button, useTheme, Tooltip } from '@dodoex/components';
import { PoolApi, PoolType } from '@dodoex/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  convertFetchMyLiquidityToOperateData,
  convertLiquidityTokenToTokenInfo,
  FetchMyLiquidityListLqList,
  getPoolAMMOrPMM,
} from '../utils';
import { ChainId } from '@dodoex/api';
import React from 'react';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import {
  byWei,
  formatApy,
  formatExponentialNotation,
  formatPercentageNumber,
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../utils';
import PoolApyTooltip from './components/PoolApyTooltip';
import { DataCardGroup } from '../../../components/DataCard/DataCardGroup';
import LoadingCard from './components/LoadingCard';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { usePoolListFilterTokenAndPool } from './hooks/usePoolListFilterTokenAndPool';
import SelectChain from '../../../components/SelectChain';
import TokenAndPoolFilter from './components/TokenAndPoolFilter';
import TokenListPoolItem from './components/TokenListPoolItem';
import { EmptyList } from '../../../components/List/EmptyList';
import { FailedList } from '../../../components/List/FailedList';
import FilterAddressTags from './components/FilterAddressTags';
import FilterTokenTags from './components/FilterTokenTags';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { PoolOperateProps } from '../PoolOperate';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import TokenLogo from '../../../components/TokenLogo';
import AddingOrRemovingBtn from './components/AddingOrRemovingBtn';
import LiquidityTable from './components/LiquidityTable';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { CardStatus } from '../../../components/CardWidgets';
import LiquidityLpPartnerReward from '../../../components/LiquidityLpPartnerReward';
import GoPoolDetailBtn from './components/GoPoolDetailBtn';
import { OnlyV3Toggle } from './components/OnlyV3Toggle';
import { FEE_AMOUNT_DETAIL } from '../AMMV3/components/shared';
import { FeeAmount } from '../AMMV3/sdks/v3-sdk';
import { InRangeDot } from '../AMMV3/components/InRangeDot';
import { formatTickPrice } from '../AMMV3/utils/formatTickPrice';
import { Bound } from '../AMMV3/types';

function CardList({
  account,
  lqList,
  setOperatePool,
  supportAMM,
}: {
  account?: string;
  lqList: FetchMyLiquidityListLqList;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  supportAMM?: boolean;
}) {
  const theme = useTheme();
  return (
    <>
      {lqList?.map((lq) => {
        if (!lq?.pair) return null;
        const item = lq.pair;
        const baseToken = convertLiquidityTokenToTokenInfo(
          item.baseToken,
          item.chainId,
        );
        const quoteToken = convertLiquidityTokenToTokenInfo(
          item.quoteToken,
          item.chainId,
        );
        const singleSideLp = PoolApi.utils.singleSideLp(item.type as PoolType);
        const baseApy = item.apy
          ? formatApy(
              new BigNumber(item.apy?.transactionBaseApy).plus(
                item.apy?.miningBaseApy ?? 0,
              ),
            )
          : '0%';
        const quoteApy =
          singleSideLp && item.apy
            ? formatApy(
                new BigNumber(item.apy.transactionQuoteApy).plus(
                  item.apy.miningQuoteApy ?? 0,
                ),
              )
            : undefined;

        let baseLpTokenBalance: BigNumber | undefined;
        let quoteLpTokenBalance: BigNumber | undefined;
        if (lq.liquidityPositions?.length) {
          lq.liquidityPositions.forEach((position) => {
            if (position?.liquidityTokenBalance) {
              const idArray = position.id?.split('-');
              if (idArray?.length === 2) {
                const positionLpTokenAddressLow =
                  idArray[1].toLocaleLowerCase();
                if (
                  item?.baseLpToken?.id?.toLocaleLowerCase() ===
                  positionLpTokenAddressLow
                ) {
                  baseLpTokenBalance = new BigNumber(
                    position.liquidityTokenBalance,
                  );
                  return;
                }
                if (
                  item?.quoteLpToken?.id?.toLocaleLowerCase() ===
                  positionLpTokenAddressLow
                ) {
                  quoteLpTokenBalance = new BigNumber(
                    position.liquidityTokenBalance,
                  );
                }
              }
            }
          });
        }
        const hasMining = !!item.miningAddress?.[0];

        const position = lq.liquidityPositions?.[0];

        const type = item.type as PoolType;
        const poolType = getPoolAMMOrPMM(type);
        const isAMMV2 = type === 'AMMV2';
        const isAMMV3 = type === 'AMMV3';

        return (
          <Box
            key={isAMMV3 ? position?.id : item.id + item.chainId}
            sx={{
              px: 20,
              pt: 20,
              pb: 12,
              backgroundColor: 'background.paper',
              borderRadius: 16,
            }}
            onClick={() => {
              if (supportAMM) return;
              useRouterStore.getState().push({
                type: PageType.PoolDetail,
                params: {
                  chainId: item.chainId as ChainId,
                  address: item.id as string,
                },
              });
            }}
          >
            {/* title */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {baseToken && quoteToken ? (
                  <TokenLogoPair
                    tokens={[baseToken, quoteToken]}
                    width={24}
                    mr={6}
                    chainId={item.chainId}
                    showChainLogo
                  />
                ) : (
                  ''
                )}
                <Box
                  sx={{
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
              </Box>
              {hasMining ? (
                <Box
                  sx={{
                    p: 8,
                    typography: 'h6',
                    fontWeight: 'bold',
                    background: `linear-gradient(180deg, ${alpha(
                      theme.palette.secondary.main,
                      0.3,
                    )} 0%, ${alpha(theme.palette.purple.main, 0.3)} 100%)`,
                    borderRadius: 8,
                    color: 'purple.main',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✨ <Trans>Mining</Trans>
                </Box>
              ) : (
                ''
              )}
            </Box>
            {/* info */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                rowGap: 20,
                mt: 44,
                '& > div:nth-child(odd)': {
                  pr: 20,
                },
                '& > div:nth-child(even)': {
                  position: 'relative',
                  pl: 20,
                  '&::before': {
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'inline-block',
                    content: '""',
                    height: 24,
                    width: '1px',
                    backgroundColor: 'border.main',
                  },
                },
              }}
            >
              {supportAMM && (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {poolType}
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
                  <Box
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Pool Type</Trans>
                  </Box>
                </Box>
              )}

              {isAMMV3 ? null : (
                <>
                  <Box>
                    <Box
                      sx={{
                        typography: 'h5',
                        color: 'success.main',
                      }}
                    >
                      {baseApy}
                      {quoteApy ? `/${quoteApy}` : ''}
                    </Box>
                    <Box
                      sx={{
                        typography: 'h6',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      <Trans>APY</Trans>
                      <PoolApyTooltip
                        chainId={item.chainId}
                        apy={item.apy}
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        hasQuote={!!quoteApy}
                        hasMining={hasMining}
                        sx={{
                          width: 14,
                          height: 14,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        typography: 'h5',
                      }}
                    >
                      ${formatExponentialNotation(new BigNumber(item.tvl || 0))}
                    </Box>
                    <Box
                      sx={{
                        typography: 'h6',
                        color: 'text.secondary',
                      }}
                    >
                      <Trans>TVL</Trans>
                    </Box>
                  </Box>
                </>
              )}

              {type === 'AMMV2' && (
                <Box>
                  <Box
                    sx={{
                      typography: 'h5',
                    }}
                  >
                    {formatPercentageNumber({
                      input: lq.liquidityPositions?.[0]?.poolShare,
                    })}
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>My Pool Share</Trans>
                  </Box>
                </Box>
              )}

              {/* my liquidity */}
              <Box>
                <Box
                  sx={{
                    typography: 'h5',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {isAMMV3 ? (
                    position?.liquidityUSD ? (
                      `$${formatTokenAmountNumber({
                        input: position.liquidityUSD,
                        decimals: 2,
                      })}`
                    ) : (
                      '-'
                    )
                  ) : (
                    <>
                      {singleSideLp ? (
                        <TokenLogo
                          address={baseToken?.address}
                          chainId={item.chainId}
                          url={baseToken?.logoURI}
                          width={18}
                          height={18}
                          sx={{
                            mr: 4,
                          }}
                        />
                      ) : (
                        <TokenLogoPair
                          tokens={
                            baseToken && quoteToken
                              ? [baseToken, quoteToken]
                              : []
                          }
                          width={18}
                          mr={4}
                          showChainLogo={false}
                          chainId={item.chainId}
                        />
                      )}
                      {baseLpTokenBalance
                        ? formatReadableNumber({
                            input: baseLpTokenBalance,
                          })
                        : ''}
                      {singleSideLp && (
                        <>
                          {' / '}
                          <TokenLogo
                            address={quoteToken?.address}
                            chainId={item.chainId}
                            url={quoteToken?.logoURI}
                            width={18}
                            height={18}
                            sx={{
                              mx: 4,
                            }}
                          />
                          {quoteLpTokenBalance
                            ? formatReadableNumber({
                                input: quoteLpTokenBalance,
                              })
                            : '0'}
                        </>
                      )}
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Trans>My Liquidity</Trans>
                </Box>
              </Box>

              {isAMMV3 && (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'text.primary',
                    }}
                  >
                    <InRangeDot outOfRange={position?.outOfRange ?? false} />
                    <Box>
                      <>
                        <span>
                          {formatTickPrice({
                            price: position?.priceRange?.token0LowerPrice,
                            atLimit: {},
                            direction: Bound.LOWER,
                          })}
                          &nbsp;
                        </span>
                        {baseToken?.symbol}
                      </>
                    </Box>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                    >
                      <path
                        d="M15.75 9.50293L12.75 12.5029L11.7 11.4529L12.8813 10.2529L5.11875 10.2529L6.3 11.4529L5.25 12.5029L2.25 9.50293L5.25 6.50293L6.31875 7.55293L5.11875 8.75293L12.8813 8.75293L11.7 7.55293L12.75 6.50293L15.75 9.50293Z"
                        fill="currentColor"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <Box>
                      <>
                        <span>
                          {formatTickPrice({
                            price: position?.priceRange?.token1LowerPrice,
                            atLimit: {},
                            direction: Bound.UPPER,
                          })}
                          &nbsp;
                        </span>
                        {baseToken?.symbol}
                      </>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      typography: 'h6',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <Trans>Price Range</Trans>
                  </Box>
                </Box>
              )}
            </Box>
            {/* operate */}
            <Box
              sx={{
                mt: 20,
                display: 'flex',
                gap: '8px',
              }}
            >
              {isAMMV3
                ? null
                : !!account && (
                    <NeedConnectButton
                      fullWidth
                      variant={Button.Variant.outlined}
                      size={Button.Size.small}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setOperatePool({
                          operate: OperateTab.Remove,
                          pool: convertFetchMyLiquidityToOperateData(lq),
                          hasMining,
                        });
                      }}
                    >
                      <Trans>Remove</Trans>
                    </NeedConnectButton>
                  )}
              <NeedConnectButton
                fullWidth
                size={Button.Size.small}
                onClick={(evt) => {
                  evt.stopPropagation();
                  setOperatePool({
                    operate: OperateTab.Add,
                    pool: convertFetchMyLiquidityToOperateData(lq),
                    hasMining,
                  });
                }}
              >
                <Trans>{isAMMV3 ? 'Manage' : 'Add'}</Trans>
              </NeedConnectButton>
              {supportAMM && poolType === 'PMM' && (
                <GoPoolDetailBtn chainId={item.chainId} address={item.id} />
              )}
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function TableList({
  account,
  lqList,
  operatePool,
  setOperatePool,
  supportAMM,
  onlyV3,
}: {
  account?: string;
  lqList: FetchMyLiquidityListLqList;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
  supportAMM?: boolean;
  onlyV3?: boolean;
}) {
  const theme = useTheme();
  return (
    <LiquidityTable>
      <Box component="thead">
        <Box component="tr">
          <Box component="th">
            <Trans>Pair</Trans>
          </Box>
          {supportAMM && (
            <Box component="th">
              <Trans>Pool Type</Trans>
            </Box>
          )}
          {onlyV3 ? null : (
            <Box component="th">
              <Trans>TVL</Trans>
            </Box>
          )}
          {onlyV3 ? null : (
            <Box component="th">
              <Trans>APY</Trans>
            </Box>
          )}
          <Box component="th">
            <Trans>My Liquidity</Trans>
          </Box>

          {onlyV3 ? (
            <Box component="th">
              <Trans>Price Range</Trans>
            </Box>
          ) : null}

          <Box
            component="th"
            sx={{
              width: 210,
            }}
          ></Box>
        </Box>
      </Box>
      <Box component="tbody">
        {lqList?.map((lq) => {
          if (!lq?.pair) return null;
          const item = lq.pair;
          const baseToken = convertLiquidityTokenToTokenInfo(
            item.baseToken,
            item.chainId,
          );
          const quoteToken = convertLiquidityTokenToTokenInfo(
            item.quoteToken,
            item.chainId,
          );
          const singleSideLp = PoolApi.utils.singleSideLp(
            item.type as PoolType,
          );
          const baseApy = item.apy
            ? formatApy(
                new BigNumber(item.apy?.transactionBaseApy).plus(
                  item.apy?.miningBaseApy ?? 0,
                ),
              )
            : undefined;
          const quoteApy =
            singleSideLp && item.apy
              ? formatApy(
                  new BigNumber(item.apy.transactionQuoteApy).plus(
                    item.apy.miningQuoteApy ?? 0,
                  ),
                )
              : undefined;

          let baseLpTokenBalance: BigNumber | undefined;
          let quoteLpTokenBalance: BigNumber | undefined;
          if (lq.liquidityPositions?.length) {
            lq.liquidityPositions.forEach((position) => {
              if (position?.liquidityTokenBalance) {
                const idArray = position.id?.split('-');
                if (idArray?.length === 2) {
                  const positionLpTokenAddressLow =
                    idArray[1].toLocaleLowerCase();
                  if (
                    item?.baseLpToken?.id?.toLocaleLowerCase() ===
                    positionLpTokenAddressLow
                  ) {
                    baseLpTokenBalance = new BigNumber(
                      position.liquidityTokenBalance,
                    );
                    return;
                  }
                  if (
                    item?.quoteLpToken?.id?.toLocaleLowerCase() ===
                    positionLpTokenAddressLow
                  ) {
                    quoteLpTokenBalance = new BigNumber(
                      position.liquidityTokenBalance,
                    );
                  }
                }
              }
            });
          }

          const position = lq.liquidityPositions?.[0];

          const type = item.type as PoolType;
          const poolType = getPoolAMMOrPMM(type);
          const isAMMV2 = type === 'AMMV2';
          const isAMMV3 = type === 'AMMV3';

          let operateBtnText = '';
          if (isAMMV3) {
            if (
              operatePool?.pool?.liquidityPositions?.[0]?.id === position?.id
            ) {
              operateBtnText = t`Managing`;
            }
          } else {
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
          }
          const hasMining = !!item.miningAddress?.[0];
          const hoverBg = theme.palette.background.tag;

          return (
            <Box
              component="tr"
              key={isAMMV3 ? position?.id : item.id + item.chainId}
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
                      sx={{
                        typography: 'h6',
                        color: 'text.secondary',
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
              {isAMMV3 ? null : (
                <Box component="td">
                  <Box
                    sx={{
                      typography: 'body2',
                    }}
                    title={
                      item.tvl
                        ? `$${formatReadableNumber({
                            input: item.tvl || 0,
                          })}`
                        : undefined
                    }
                  >
                    ${formatExponentialNotation(new BigNumber(item.tvl || 0))}
                  </Box>
                </Box>
              )}

              {isAMMV3 ? null : (
                <Box component="td">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {hasMining ? (
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
                        {baseApy || '0%'}
                        {quoteApy ? `/${quoteApy}` : ''}
                      </Box>
                    </PoolApyTooltip>
                  </Box>
                </Box>
              )}

              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {isAMMV3 ? (
                    position?.liquidityUSD ? (
                      `$${formatTokenAmountNumber({
                        input: position.liquidityUSD,
                        decimals: 2,
                      })}`
                    ) : (
                      '-'
                    )
                  ) : (
                    <>
                      {singleSideLp ? (
                        <TokenLogo
                          address={baseToken?.address}
                          chainId={item.chainId}
                          url={baseToken?.logoURI}
                          width={24}
                          height={24}
                          noShowChain
                          sx={{
                            mr: 4,
                          }}
                        />
                      ) : (
                        <TokenLogoPair
                          tokens={
                            baseToken && quoteToken
                              ? [baseToken, quoteToken]
                              : []
                          }
                          width={24}
                          mr={4}
                          showChainLogo={false}
                          chainId={item.chainId}
                        />
                      )}
                      {baseLpTokenBalance
                        ? formatReadableNumber({
                            input: baseLpTokenBalance,
                          })
                        : '-'}
                      {singleSideLp && (
                        <>
                          {' / '}
                          <TokenLogo
                            address={quoteToken?.address}
                            chainId={item.chainId}
                            url={quoteToken?.logoURI}
                            width={24}
                            height={24}
                            noShowChain
                            sx={{
                              mx: 4,
                            }}
                          />
                          {quoteLpTokenBalance
                            ? formatReadableNumber({
                                input: quoteLpTokenBalance,
                              })
                            : '0'}
                        </>
                      )}
                      {isAMMV2 && (
                        <Box
                          sx={{
                            ml: 4,
                            px: 4,
                            py: 2,
                            borderRadius: 4,
                            fontSize: '10px',
                            fontWeight: 600,
                            lineHeight: 1,
                            backgroundColor: 'background.paperDarkContrast',
                            color: 'text.secondary',
                          }}
                        >
                          {formatPercentageNumber({
                            input: lq.liquidityPositions?.[0]?.poolShare,
                          })}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {onlyV3 ? (
                <Box component="td">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'text.primary',
                    }}
                  >
                    <InRangeDot outOfRange={position?.outOfRange ?? false} />
                    <Box>
                      <>
                        <span>
                          {formatTickPrice({
                            price: position?.priceRange?.token0LowerPrice,
                            atLimit: {},
                            direction: Bound.LOWER,
                          })}
                          &nbsp;
                        </span>
                        {baseToken?.symbol}
                      </>
                    </Box>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                    >
                      <path
                        d="M15.75 9.50293L12.75 12.5029L11.7 11.4529L12.8813 10.2529L5.11875 10.2529L6.3 11.4529L5.25 12.5029L2.25 9.50293L5.25 6.50293L6.31875 7.55293L5.11875 8.75293L12.8813 8.75293L11.7 7.55293L12.75 6.50293L15.75 9.50293Z"
                        fill="currentColor"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <Box>
                      <>
                        <span>
                          {formatTickPrice({
                            price: position?.priceRange?.token0UpperPrice,
                            atLimit: {},
                            direction: Bound.UPPER,
                          })}
                          &nbsp;
                        </span>
                        {baseToken?.symbol}
                      </>
                    </Box>
                  </Box>
                </Box>
              ) : null}

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
                    <>
                      {isAMMV3
                        ? null
                        : !!account && (
                            <NeedConnectButton
                              variant={Button.Variant.outlined}
                              size={Button.Size.small}
                              onClick={(evt) => {
                                evt.stopPropagation();
                                setOperatePool({
                                  operate: OperateTab.Remove,
                                  pool: convertFetchMyLiquidityToOperateData(
                                    lq,
                                  ),
                                  hasMining,
                                });
                              }}
                            >
                              <Trans>Remove</Trans>
                            </NeedConnectButton>
                          )}
                      <NeedConnectButton
                        size={Button.Size.small}
                        onClick={() => {
                          setOperatePool({
                            pool: convertFetchMyLiquidityToOperateData(lq),
                            hasMining,
                          });
                        }}
                      >
                        {isAMMV3 ? t`Manage` : t`Add`}
                      </NeedConnectButton>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </LiquidityTable>
  );
}

export default function MyLiquidity({
  account,
  filterChainIds,
  activeChainId,
  handleChangeActiveChainId,
  operatePool,
  setOperatePool,
}: {
  account?: string;
  filterChainIds?: ChainId[];

  activeChainId: ChainId | undefined;
  handleChangeActiveChainId: (chainId: number | undefined) => void;
  operatePool: Partial<PoolOperateProps> | null;
  setOperatePool: (operate: Partial<PoolOperateProps> | null) => void;
}) {
  const theme = useTheme();
  const { minDevice, isMobile } = useWidgetDevice();
  const queryClient = useQueryClient();
  const { onlyChainId, supportAMMV2, supportAMMV3 } = useUserOptions();
  const [onlyV3, setOnlyV3] = React.useState(false);

  const {
    filterTokens,
    filterASymbol,
    filterBSymbol,
    filterAddressLqList,

    handleDeleteToken,
    handleChangeFilterTokens,
    handleChangeFilterAddress,
  } = usePoolListFilterTokenAndPool();

  const defaultQueryFilter = {
    currentPage: 1,
    pageSize: 1000,
    user: account,
    filterState: {
      viewOnlyOwn: true,
      filterTypes: supportAMMV3
        ? onlyV3
          ? ['AMMV3']
          : ['CLASSICAL', 'DVM', 'DSP', 'GSP', 'AMMV2']
        : undefined,
    },
  };

  const graphQLRequests = useGraphQLRequests();
  const query = graphQLRequests.getQuery(PoolApi.graphql.fetchMyLiquidityList, {
    where: {
      ...defaultQueryFilter,
      filterState: {
        filterASymbol,
        filterBSymbol,
        ...defaultQueryFilter.filterState,
      },
    },
  });
  const fetchResult = useQuery({
    ...query,
  });

  let lqList = fetchResult.data?.liquidity_list?.lqList ?? [];
  const hasFilterAddress = !!filterAddressLqList?.length;
  if (hasFilterAddress) {
    lqList = [...filterAddressLqList];
  } else if (filterChainIds) {
    lqList =
      fetchResult.data?.liquidity_list?.lqList?.filter((lq) =>
        filterChainIds.includes(lq?.pair?.chainId ?? 0),
      ) ?? [];
  }

  const filterSmallDeviceWidth = 475;

  return (
    <>
      <Box
        sx={{
          py: 16,
          display: 'flex',
          gap: 8,
          ...(minDevice(filterSmallDeviceWidth)
            ? {}
            : {
                flexDirection: 'column',
              }),
          ...(isMobile
            ? {}
            : {
                px: 20,
                borderBottomWidth: 1,
              }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            ...(minDevice(filterSmallDeviceWidth)
              ? {}
              : {
                  '& > button': {
                    flex: 1,
                  },
                }),
            ...(isMobile
              ? {
                  flexWrap: 'wrap',
                }
              : {}),
          }}
        >
          {!onlyChainId && (
            <SelectChain
              chainId={activeChainId}
              setChainId={handleChangeActiveChainId}
            />
          )}
          {supportAMMV3 && (
            <OnlyV3Toggle
              onlyV3={onlyV3}
              setOnlyV3={setOnlyV3}
              sx={
                isMobile
                  ? {
                      flexGrow: 1,
                      flexBasis: '100%',
                    }
                  : undefined
              }
            />
          )}
          <TokenAndPoolFilter
            value={filterTokens}
            onChange={handleChangeFilterTokens}
            searchAddress={async (address, onClose) => {
              const query = graphQLRequests.getInfiniteQuery(
                PoolApi.graphql.fetchLiquidityList,
                'currentPage',
                {
                  where: {
                    ...defaultQueryFilter,
                    filterState: {
                      address,
                      ...defaultQueryFilter.filterState,
                    },
                  },
                },
              );
              const result = await queryClient.fetchQuery(query);
              const lqList = result.liquidity_list?.lqList;
              if (lqList?.length) {
                return (
                  <TokenListPoolItem
                    list={lqList}
                    onClick={() => {
                      handleChangeFilterAddress(lqList);
                      onClose();
                    }}
                  />
                );
              }
              return null;
            }}
          />
        </Box>

        {/* filter tag */}
        {(hasFilterAddress || !!filterTokens.length) && (
          <Box
            sx={{
              my: 0,
            }}
          >
            {hasFilterAddress ? (
              <FilterAddressTags
                lqList={filterAddressLqList}
                onDeleteTag={() => handleChangeFilterAddress([])}
              />
            ) : (
              ''
            )}
            <FilterTokenTags
              tags={filterTokens}
              onDeleteTag={handleDeleteToken}
            />
          </Box>
        )}
      </Box>

      {/* list */}
      {isMobile ? (
        <DataCardGroup>
          {fetchResult.isLoading ? <LoadingCard /> : ''}
          {!fetchResult.isLoading && !lqList?.length && !fetchResult.error && (
            <EmptyList
              sx={{
                mt: 40,
              }}
              hasSearch={
                !!(
                  (activeChainId && !onlyChainId) ||
                  filterASymbol ||
                  filterBSymbol
                )
              }
            />
          )}
          {!!fetchResult.error && (
            <FailedList
              refresh={fetchResult.refetch}
              sx={{
                mt: 40,
              }}
            />
          )}
          <CardList
            account={account}
            lqList={lqList}
            setOperatePool={setOperatePool}
            supportAMM={supportAMMV2 || supportAMMV3}
          />
        </DataCardGroup>
      ) : (
        <>
          <TableList
            account={account}
            lqList={lqList}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
            supportAMM={supportAMMV2 || supportAMMV3}
            onlyV3={onlyV3}
          />

          <CardStatus
            loading={fetchResult.isLoading}
            refetch={fetchResult.error ? fetchResult.refetch : undefined}
            empty={!lqList?.length}
            hasSearch={
              !!(
                (activeChainId && !onlyChainId) ||
                filterASymbol ||
                filterBSymbol
              )
            }
          />
        </>
      )}
    </>
  );
}
