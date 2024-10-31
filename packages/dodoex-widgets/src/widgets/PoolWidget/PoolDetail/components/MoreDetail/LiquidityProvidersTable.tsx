import { useTheme, Box, ButtonBase } from '@dodoex/components';
import { useWidgetDevice } from '../../../../../hooks/style/useWidgetDevice';
import { ArrowRight } from '@dodoex/icons';
import { usePoolDetail } from '../../../hooks/usePoolDetail';
import { useQuery } from '@tanstack/react-query';
import { poolApi } from '../../../utils';
import React from 'react';
import { useLiquidityProviders } from '../../hooks/useLiquidityProviders';
import { Trans } from '@lingui/macro';
import { AddressWithLinkAndCopy } from '../../../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../../../components/TokenLogo';
import { CardStatus } from '../../../../../components/CardWidgets';

export default function LiquidityProvidersTable({
  poolDetail,
}: {
  poolDetail: ReturnType<typeof usePoolDetail>['poolDetail'];
}) {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const chainId = poolDetail?.chainId;
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

  const positionQuery = useLiquidityProviders({
    pool: poolDetail,
  });

  const [page, setPage] = React.useState(1);
  const pageSize = isMobile ? 4 : 8;
  const currentCount = page * pageSize;
  const listOrigin = positionQuery.list;
  const hasMore = currentCount < listOrigin.length;
  const list = listOrigin.slice(0, currentCount);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardStatus
        refetch={positionQuery.error ? positionQuery.refetch : undefined}
        loading={positionQuery.isLoading && !list?.length}
        empty={!list?.length}
      >
        {!!list?.length && (
          <Box>
            <Box
              sx={{
                overflowX: 'auto',
                minHeight: 244,
              }}
            >
              <Box
                component="table"
                sx={{
                  minWidth: '100%',
                }}
              >
                <Box
                  component="thead"
                  sx={{
                    position: 'sticky',
                    top: 0,
                  }}
                >
                  <Box
                    component="tr"
                    sx={{
                      '& th': {
                        p: 24,
                        borderBottomWidth: 1,
                        typography: 'body1',
                        lineHeight: 1,
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <Box component="th">
                      <Trans>Liquidity Provider</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Liquidity Supplied</Trans>
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        '&&': {
                          textAlign: 'right',
                        },
                      }}
                    >
                      <Trans>Value (USD)</Trans>
                    </Box>
                    <Box
                      component="th"
                      sx={{
                        '&&': {
                          textAlign: 'right',
                        },
                      }}
                    >
                      <Trans>Share</Trans>
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {list?.map((item) => {
                    return (
                      <Box
                        component="tr"
                        key={item.userId}
                        sx={{
                          '& td': {
                            px: 24,
                            py: 20,
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <td>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <AddressWithLinkAndCopy
                              address={item.userId}
                              customChainId={chainId}
                              truncate
                            />
                          </Box>
                        </td>
                        <td>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <TokenLogo
                              address={item.baseTokenAddress}
                              chainId={chainId}
                              width={18}
                              height={18}
                            />
                            {`${item.baseSupplied} ${item.baseTokenSymbol}`}
                          </Box>
                          <Box
                            sx={{
                              mt: 4,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <TokenLogo
                              address={item.quoteTokenAddress}
                              chainId={chainId}
                              width={18}
                              height={18}
                            />
                            {`${item.quoteSupplied} ${item.quoteTokenSymbol}`}
                          </Box>
                        </td>
                        <Box
                          component="td"
                          sx={{
                            textAlign: 'right',
                          }}
                        >
                          {item.dollarValue}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            textAlign: 'right',
                          }}
                        >
                          {`${item.sharePercentage}%`}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/** load more */}
            {hasMore && (
              <ButtonBase
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 64,
                  width: '100%',
                  borderStyle: 'solid',
                  borderColor: 'border.main',
                  borderWidth: theme.spacing(1, 0, 0, 0),
                  typography: 'body2',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <Trans>Load more</Trans>
                <Box
                  component={ArrowRight}
                  sx={{
                    transform: 'rotate(90deg)',
                  }}
                />
              </ButtonBase>
            )}
          </Box>
        )}
      </CardStatus>
    </Box>
  );
}
