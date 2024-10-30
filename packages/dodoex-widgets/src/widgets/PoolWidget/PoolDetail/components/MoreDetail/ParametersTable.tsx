import { Box, BoxProps, useTheme, Skeleton } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { merge } from 'lodash';
import dayjs from 'dayjs';
import React from 'react';
import { ChainId } from '@dodoex/api';
import TokenLogo from '../../../../../components/TokenLogo';
import { TokenInfo } from '../../../../../hooks/Token';
import {
  formatPercentageNumber,
  formatReadableNumber,
} from '../../../../../utils';
import { AddressWithLinkAndCopy } from '../../../../../components/AddressWithLinkAndCopy';
import { usePoolDetail } from '../../../hooks/usePoolDetail';
import { usePoolDashboard } from '../../hooks/usePoolDashboard';
import { useQuery } from '@tanstack/react-query';
import { poolApi } from '../../../utils';
import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import { useWidgetDevice } from '../../../../../hooks/style/useWidgetDevice';
import { isNotEmpty } from '../../../../../utils/utils';

export function formatDateTimeStr(timestamp?: number, short?: boolean): string {
  if (!timestamp) {
    return '';
  }
  const dateTime = dayjs(timestamp);
  if (dateTime.isValid()) {
    if (short) {
      return dateTime.format('YYYY/MM/DD');
    }
    return dateTime.format('YYYY/MM/DD HH:mm:ss');
  }
  return '';
}

export function TokenWithSymbolRtL({
  chainId,
  address,
  symbol,
  amount,
  sx,
}: {
  chainId: ChainId;
  address: string;
  symbol: string;
  amount: string;
  sx?: BoxProps['sx'];
}) {
  return (
    <Box
      sx={merge(
        {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        },
        sx,
      )}
    >
      {address && (
        <Box
          sx={{
            height: 16,
            flexBasis: 16,
            flexGrow: 0,
            flexShrink: 0,
            mr: 4,
          }}
        >
          <TokenLogo
            width={16}
            height={16}
            address={address}
            chainId={chainId}
          />
        </Box>
      )}
      <Box
        sx={{
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {amount}&nbsp;
        <Box
          sx={{
            display: 'inline-block',
            maxWidth: '6em',
            minWidth: 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'text-bottom',
          }}
          title={symbol}
        >
          {symbol}
        </Box>
      </Box>
    </Box>
  );
}

function TokenWithSymbolRtLPair({
  chainId,
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  vertical,
}: {
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: string;
  quoteAmount: string;
  vertical?: boolean;
}) {
  const { isMobile } = useWidgetDevice();
  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'flex-end' : 'center',
        flexWrap: 'wrap',
        typography: isMobile ? 'h6' : 'body1',
      }}
    >
      {baseToken ? (
        <TokenWithSymbolRtL
          chainId={chainId}
          address={baseToken?.address}
          amount={baseAmount}
          symbol={baseToken?.symbol}
        />
      ) : (
        '-'
      )}
      {!vertical ? (
        <Box
          sx={{
            mx: 10,
          }}
        >
          /
        </Box>
      ) : (
        ''
      )}
      {quoteToken ? (
        <TokenWithSymbolRtL
          chainId={chainId}
          address={quoteToken?.address}
          amount={quoteAmount}
          symbol={quoteToken?.symbol}
          sx={{
            mt: vertical ? 4 : 0,
          }}
        />
      ) : (
        '-'
      )}
    </Box>
  );
}

function InfoItem({
  label,
  children,
  pairsStatLoading,
  poolDetailLoading,
}: {
  label: string;
  children: React.ReactNode;
  pairsStatLoading?: boolean;
  poolDetailLoading?: boolean;
}) {
  const { isMobile } = useWidgetDevice();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          color: 'text.secondary',
          minWidth: '5em',
          typography: isMobile ? 'h6' : 'body1',
        }}
      >
        {label}
      </Box>
      <Box
        sx={merge(
          {
            textAlign: 'right',
            overflow: 'hidden',
            '& .title': {
              typography: isMobile ? 'body1' : 'caption',
              width: '100%',
            },
          },
          (pairsStatLoading && !poolDetailLoading) ||
            (!pairsStatLoading && poolDetailLoading)
            ? {
                ml: 8,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                '& .title': {
                  display: 'flex',
                  justifyContent: 'flex-end',
                },
              }
            : {},
        )}
      >
        {children}
      </Box>
    </Box>
  );
}

function ParametersSkeleton({ sx }: { sx?: BoxProps['sx'] }) {
  return (
    <Skeleton
      sx={{
        width: '100%',
        maxWidth: 237,
        height: 22,
        ...sx,
      }}
    />
  );
}

function FeeRateDetail({
  detail,
  lpFeeRate,
  mtFeeRate,
}: {
  detail: ReturnType<typeof usePoolDetail>['poolDetail'];
  lpFeeRate: BigNumber | undefined;
  mtFeeRate: BigNumber | undefined;
}) {
  const { isMobile } = useWidgetDevice();
  const isPrivate = detail?.type === 'DPP';
  if (isPrivate) {
    return null;
  }
  if (!detail || !lpFeeRate || !mtFeeRate) {
    return <ParametersSkeleton sx={{ mt: 4 }} />;
  }

  return (
    <Box
      sx={{
        color: 'text.secondary',
        typography: isMobile ? 'h6' : 'body1',
      }}
    >
      <span>LP&nbsp;</span>
      <span>
        {formatPercentageNumber({
          input: lpFeeRate,
          showDecimals: 6,
        })}
      </span>
      <span>&nbsp;/&nbsp;{t`Community Treasury`}&nbsp;</span>
      <span>
        {formatPercentageNumber({
          input: new BigNumber(mtFeeRate ?? 0).toNumber(),
          showDecimals: 6,
        })}
      </span>
    </Box>
  );
}

export default function ParametersTable({
  detail,
}: {
  detail: ReturnType<typeof usePoolDetail>['poolDetail'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { baseToken, quoteToken } = detail ?? {};
  const isPrivate = detail?.type === 'DPP';
  const isDsp = detail?.type === 'DSP' || detail?.type === 'GSP';
  const isClassical = detail?.type === 'CLASSICAL';
  const dashboardQuery = usePoolDashboard({
    address: detail?.address,
    chainId: detail?.chainId,
  });
  const pairsStat = dashboardQuery.dashboard;
  const pairsStatLoading = dashboardQuery.isLoading;

  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      detail?.chainId as number,
      detail?.address,
      detail?.type,
      detail?.baseToken?.decimals,
      detail?.quoteToken?.decimals,
    ),
  );

  const totalSwapVolume = pairsStatLoading ? (
    <ParametersSkeleton />
  ) : pairsStat?.totalVolume === null ||
    pairsStat?.totalVolume === undefined ? (
    '-'
  ) : (
    `$${formatReadableNumber({
      input: new BigNumber(pairsStat?.totalVolume),
      showDecimals: 2,
    })}`
  );
  const totalSwapFee = pairsStatLoading ? (
    <ParametersSkeleton />
  ) : !pairsStat ||
    (!isNotEmpty(pairsStat.totalFee) && !isNotEmpty(pairsStat.totalMtFee)) ? (
    '-'
  ) : (
    `$${formatReadableNumber({
      input: new BigNumber(pairsStat.totalFee || 0).plus(
        pairsStat.totalMtFee || 0,
      ),
      showDecimals: 2,
    })}`
  );
  const { account } = useWeb3React();
  const feeRateQuery = useQuery(
    poolApi.getFeeRateQuery(
      detail?.chainId,
      detail?.address,
      detail?.type,
      account,
    ),
  );
  const mtFeeRate = feeRateQuery.data?.mtFeeRate;
  const lpFeeRate = feeRateQuery.data?.lpFeeRate;
  const fullFeeRate = mtFeeRate?.plus(lpFeeRate ?? 0);

  const poolDetailLoading = !detail;

  const classicalTargetQuery = useQuery(
    poolApi.getClassicalTargetQuery(
      detail?.chainId,
      detail?.address,
      detail?.type,
      detail?.baseToken?.decimals,
      detail?.quoteToken?.decimals,
    ),
  );

  return (
    <Box
      sx={{
        pb: 30,
        position: 'relative',
        overflow: 'hidden',
        ...(isMobile
          ? {
              backgroundColor: 'background.paper',
              p: 20,
            }
          : {
              mt: 32,
            }),
      }}
    >
      <Box
        sx={{
          flex: '1 0 50%',
          '& > div + div': {
            mt: 10,
          },
          '&::after': {
            content: '""',
            display: 'block',
            my: 20,
            width: '100%',
            height: '1px',
            backgroundColor: 'border.main',
          },
        }}
      >
        <InfoItem
          label={t`Total Swap Volume`}
          pairsStatLoading={pairsStatLoading}
        >
          <div className="title">{totalSwapVolume}</div>
        </InfoItem>
        {pairsStatLoading || !detail ? (
          <ParametersSkeleton
            sx={{
              mt: 4,
            }}
          />
        ) : (
          <TokenWithSymbolRtLPair
            chainId={detail.chainId}
            baseToken={detail.baseToken}
            quoteToken={detail.quoteToken}
            baseAmount={formatReadableNumber({
              input: pairsStat?.baseVolumeCumulative ?? 0,
              showDecimals: 2,
            })}
            quoteAmount={formatReadableNumber({
              input: pairsStat?.quoteVolumeCumulative ?? 0,
              showDecimals: 2,
            })}
          />
        )}
        <InfoItem label={t`Total Swap Fee`} pairsStatLoading={pairsStatLoading}>
          <div className="title">{totalSwapFee}</div>
        </InfoItem>
        {pairsStatLoading || !detail ? (
          <ParametersSkeleton
            sx={{
              mt: 4,
            }}
          />
        ) : (
          <TokenWithSymbolRtLPair
            chainId={detail.chainId}
            baseToken={detail.baseToken}
            quoteToken={detail.quoteToken}
            baseAmount={formatReadableNumber({
              input: new BigNumber(pairsStat?.baseFee ?? 0).plus(
                pairsStat?.baseMtFee ?? 0,
              ),
              showDecimals: 2,
            })}
            quoteAmount={formatReadableNumber({
              input: new BigNumber(pairsStat?.quoteFee ?? 0).plus(
                pairsStat?.quoteMtFee ?? 0,
              ),
              showDecimals: 2,
            })}
          />
        )}
        <InfoItem
          label={t`Total Number of Traders`}
          pairsStatLoading={pairsStatLoading}
        >
          {pairsStatLoading ? (
            <ParametersSkeleton
              sx={{
                mt: 4,
              }}
            />
          ) : (
            formatReadableNumber({
              input: pairsStat?.txUsers ?? 0,
              showDecimals: 0,
            })
          )}
        </InfoItem>
      </Box>

      <Box
        sx={{
          flex: '1 0 50%',
          overflow: 'hidden',
          '& > div + div': {
            mt: 10,
          },
        }}
      >
        <InfoItem label={t`Creator`} poolDetailLoading={!detail}>
          {!detail ? (
            <ParametersSkeleton />
          ) : detail.isCpPool ? (
            <AddressWithLinkAndCopy
              address={detail.cpCreator ?? ''}
              truncate
              data-key="link"
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          ) : (
            <AddressWithLinkAndCopy
              address={detail.creator ?? ''}
              truncate
              data-key="link"
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          )}
        </InfoItem>
        {detail?.isCpPool || detail?.owner ? (
          <InfoItem label={t`Owner`} poolDetailLoading={poolDetailLoading}>
            {poolDetailLoading ? (
              <ParametersSkeleton />
            ) : detail?.isCpPool ? (
              <AddressWithLinkAndCopy
                address={detail?.cpCreator as string}
                truncate
                data-key="link"
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            ) : (
              <AddressWithLinkAndCopy
                address={detail.owner ?? ''}
                truncate
                data-key="link"
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            )}
          </InfoItem>
        ) : (
          ''
        )}
        <InfoItem
          label={t`Creation Time`}
          poolDetailLoading={poolDetailLoading}
        >
          {poolDetailLoading ? (
            <ParametersSkeleton />
          ) : (
            formatDateTimeStr(
              Number(
                detail?.isCpPool
                  ? detail.cpCreatedAtTimestamp || 0
                  : detail.createdAtTimestamp || 0,
              ) * 1000,
            ) || '-'
          )}
        </InfoItem>
        {detail?.isCpPool ? (
          <>
            <InfoItem label={t`Settler`} poolDetailLoading={poolDetailLoading}>
              {poolDetailLoading ? (
                <ParametersSkeleton />
              ) : (
                <AddressWithLinkAndCopy
                  address={detail?.cpLiquidator || ''}
                  truncate
                  data-key="link"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                />
              )}
            </InfoItem>
            <InfoItem
              label={t`Related CrowdPooling`}
              poolDetailLoading={poolDetailLoading}
            >
              {poolDetailLoading ? (
                <ParametersSkeleton />
              ) : (
                <AddressWithLinkAndCopy
                  address={detail?.cpAddress as string}
                  truncate
                  data-key="link"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                />
              )}
            </InfoItem>
          </>
        ) : undefined}

        <InfoItem label={t`Fee Rate`} poolDetailLoading={poolDetailLoading}>
          <div className="detail-title" style={{ textAlign: 'right' }}>
            {formatPercentageNumber({
              input: fullFeeRate?.toNumber(),
              showDecimals: 6,
            })}
          </div>
          <FeeRateDetail
            detail={detail}
            lpFeeRate={lpFeeRate}
            mtFeeRate={mtFeeRate}
          />
        </InfoItem>
        <InfoItem
          label={t`Slippage Coefficient`}
          poolDetailLoading={poolDetailLoading}
        >
          {poolDetailLoading ? (
            <ParametersSkeleton />
          ) : (
            pmmStateQuery.data?.pmmParamsBG?.k.toString()
          )}
        </InfoItem>
        <InfoItem
          poolDetailLoading={poolDetailLoading}
          label={
            isClassical
              ? t`Guide Price`
              : isPrivate
                ? t`Mid Price`
                : isDsp
                  ? t`Pegged Exchange Rate`
                  : t`Min Price`
          }
        >
          {poolDetailLoading ? (
            <ParametersSkeleton />
          ) : (
            (baseToken !== null &&
              (isDsp
                ? `1 ${
                    baseToken?.symbol
                  } = ${pmmStateQuery.data?.pmmParamsBG?.i?.toString()} ${
                    quoteToken?.symbol
                  }`
                : pmmStateQuery.data?.pmmParamsBG?.i?.toString())) ||
            '-'
          )}
        </InfoItem>
        {isClassical && (
          <>
            <InfoItem
              label={t`Equilibrium target`}
              poolDetailLoading={poolDetailLoading}
            >
              {poolDetailLoading ? (
                <ParametersSkeleton />
              ) : (
                <>{pmmStateQuery.data?.pmmParamsBG?.k?.toString()}</>
              )}
            </InfoItem>

            {classicalTargetQuery.data ? (
              <TokenWithSymbolRtLPair
                vertical
                chainId={detail.chainId}
                baseToken={detail.baseToken}
                quoteToken={detail.quoteToken}
                baseAmount={formatReadableNumber({
                  input: classicalTargetQuery.data.baseTarget,
                  showDecimals: 2,
                })}
                quoteAmount={formatReadableNumber({
                  input: classicalTargetQuery.data.quoteTarget,
                  showDecimals: 2,
                })}
              />
            ) : (
              ''
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
