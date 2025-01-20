import { Box, Skeleton, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import TokenLogo from '../../../../components/TokenLogo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { formatShortNumber, formatUnknownTokenSymbol } from '../../../../utils';
import { usePoolDetail } from '../../hooks/usePoolDetail';
import { poolApi } from '../../utils';
import { BaseQuotePie } from './BaseQuotePie';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { useRouterStore } from '../../../../router';

export default function TotalLiquidity({
  poolDetail,
}: {
  poolDetail: ReturnType<typeof usePoolDetail>['poolDetail'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      poolDetail?.chainId as number,
      poolDetail?.address,
      poolDetail?.type,
      poolDetail?.baseToken?.decimals,
      poolDetail?.quoteToken?.decimals,
    ),
  );
  const midPrice = pmmStateQuery.data?.midPrice;

  const reserveQuery = useQuery(
    poolApi.getReserveLpQuery(
      poolDetail?.chainId,
      poolDetail?.address,
      poolDetail?.type,
      poolDetail?.baseToken?.decimals,
      poolDetail?.quoteToken?.decimals,
    ),
  );
  const { baseReserve, quoteReserve } = reserveQuery.data || {};

  const baseAmount =
    baseReserve && midPrice ? midPrice?.multipliedBy(baseReserve) : undefined;
  const quoteAmount =
    quoteReserve && midPrice ? new BigNumber(quoteReserve) : undefined;
  let total =
    baseAmount && quoteAmount ? baseAmount?.plus(quoteAmount) : undefined;
  total = !total || total.lte(0) ? new BigNumber(1) : total;
  const basePercentage =
    baseAmount && baseAmount.div(total).multipliedBy(100).toFixed(2);
  const quotePercentage =
    quoteAmount && quoteAmount.div(total).multipliedBy(100).toFixed(2);
  console.log(
    'je',
    baseReserve?.toString(),
    quoteReserve?.toString(),
    baseAmount?.toString(),
    quoteAmount?.toString(),
    midPrice?.toString(),
  );

  return (
    <Box
      sx={{
        mt: isMobile ? 24 : 32,
      }}
    >
      {/* title */}
      <Box
        sx={{
          fontWeight: 600,
        }}
      >
        <Trans>Total Liquidity</Trans>
      </Box>
      {/* detail */}
      <Box
        sx={{
          display: 'flex',
          mt: 16,
          backgroundColor: 'background.paper',
          borderRadius: 16,
          overflowX: 'auto',
        }}
      >
        {/* chart */}
        <Box
          sx={{
            flex: isMobile ? 1 : undefined,
            padding: isMobile
              ? theme.spacing(20, 30, 20, 20)
              : theme.spacing(20, 30, 16),
          }}
        >
          <BaseQuotePie
            pieRadius={36}
            baseReserve={baseReserve}
            baseAmount={baseAmount}
            baseTokenDecimals={poolDetail?.baseToken?.decimals}
            quoteAmount={quoteAmount}
            baseTvlRate={basePercentage}
            quoteTvlRate={quotePercentage}
            chainId={poolDetail?.chainId}
            quoteTokenDecimals={poolDetail?.quoteToken?.decimals || undefined}
            baseTokenSymbol={formatUnknownTokenSymbol(poolDetail?.baseToken)}
            quoteTokenSymbol={formatUnknownTokenSymbol(poolDetail?.quoteToken)}
            baseTokenAddress={isMobile ? poolDetail?.baseToken?.address : ''}
            quoteTokenAddress={isMobile ? poolDetail?.quoteToken?.address : ''}
            shortNumber
            disabledRate={!isMobile}
            disabledAmount={!isMobile}
            loading={pmmStateQuery.isLoading || reserveQuery.isLoading}
            sx={
              isMobile
                ? {
                    typography: 'body2',
                    fontWeight: 600,
                  }
                : {
                    '& .symbol-wrapper': {
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      '& > div, & > span': {
                        mt: 0,
                        '&:last-child': {
                          ml: 16,
                        },
                      },
                      '& .MuiSkeleton-root': {
                        width: '40px !important',
                      },
                    },
                  }
            }
          />
        </Box>
        {/* table */}
        {isMobile ? (
          ''
        ) : (
          <Box
            component="table"
            sx={{
              flex: 1,
              fontWeight: 600,
              borderStyle: 'solid',
              borderColor: 'border.main',
              borderWidth: '0 0 0 1px',
              '& thead': {
                typography: 'h6',
                color: 'text.secondary',
                '& th': {
                  textAlign: 'right',
                  px: 20,
                  py: 16,
                  borderStyle: 'solid',
                  borderColor: 'border.main',
                  borderWidth: '0 0 1px',
                  '&:first-child': {
                    textAlign: 'left',
                  },
                },
              },
              '& tbody': {
                typography: 'body2',
                textAlign: 'right',
                '& td': {
                  px: 20,
                  py: 0,
                  '&:first-child': {
                    textAlign: 'left',
                  },
                },
              },
            }}
          >
            <thead>
              <tr>
                <th>
                  <Trans>Asset</Trans>
                </th>
                <th>
                  <Trans>Token Amount</Trans>
                </th>
                <th>
                  <Trans>Ratio</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {poolDetail ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <TokenLogo
                        address={poolDetail.baseToken.address}
                        width={24}
                        height={24}
                        marginRight={4}
                        chainId={poolDetail.chainId}
                      />
                      <Box>
                        {poolDetail.baseToken.symbol}
                        <AddressWithLinkAndCopy
                          address={poolDetail.baseToken.address}
                          truncate
                          showCopy
                          size="small"
                          iconSpace={4}
                          customChainId={poolDetail.chainId}
                          sx={{
                            typography: 'h6',
                            color: 'text.secondary',
                          }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Skeleton width={100} height={24} />
                  )}
                </td>
                <td>
                  {poolDetail ? (
                    formatShortNumber(new BigNumber(poolDetail.baseReserve))
                  ) : (
                    <Skeleton
                      width={50}
                      height={24}
                      sx={{
                        display: 'inline-block',
                      }}
                    />
                  )}
                </td>
                <td>
                  {pmmStateQuery.isLoading ? (
                    <Skeleton
                      width={50}
                      height={24}
                      sx={{
                        display: 'inline-block',
                      }}
                    />
                  ) : (
                    `${basePercentage ?? '-'}%`
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  {poolDetail ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <TokenLogo
                        address={poolDetail.quoteToken.address}
                        width={24}
                        height={24}
                        marginRight={4}
                        chainId={poolDetail.chainId}
                      />
                      <Box>
                        {poolDetail.quoteToken.symbol}
                        <AddressWithLinkAndCopy
                          address={poolDetail.quoteToken.address}
                          truncate
                          showCopy
                          size="small"
                          iconSpace={4}
                          customChainId={poolDetail.chainId}
                          sx={{
                            typography: 'h6',
                            color: 'text.secondary',
                          }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Skeleton width={100} height={24} />
                  )}
                </td>
                <td>
                  {poolDetail ? (
                    formatShortNumber(new BigNumber(poolDetail.quoteReserve))
                  ) : (
                    <Skeleton
                      width={50}
                      height={24}
                      sx={{
                        display: 'inline-block',
                      }}
                    />
                  )}
                </td>
                <td>
                  {pmmStateQuery.isLoading ? (
                    <Skeleton
                      width={50}
                      height={24}
                      sx={{
                        display: 'inline-block',
                      }}
                    />
                  ) : (
                    `${quotePercentage ?? '-'}%`
                  )}
                </td>
              </tr>
            </tbody>
          </Box>
        )}
      </Box>
    </Box>
  );
}
