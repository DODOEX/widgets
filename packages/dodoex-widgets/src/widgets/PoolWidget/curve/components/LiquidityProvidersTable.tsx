import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import React, { Fragment } from 'react';
import { CardStatus } from '../../../../components/CardWidgets';
import TokenLogo from '../../../../components/TokenLogo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { formatTokenAmountNumber } from '../../../../utils';
import { useLiquidityProviders } from '../hooks/useLiquidityProviders';
import { formatDateTimeStr } from './SwapsTable';

export interface LiquidityProvidersTableProps {
  chainId: number | undefined;
  address: string | undefined;
}

export const LiquidityProvidersTable = ({
  chainId,
  address,
}: LiquidityProvidersTableProps) => {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const positionQuery = useLiquidityProviders({
    address,
    chainId,
  });

  const [page, setPage] = React.useState(1);
  const pageSize = isMobile ? 4 : 8;
  const currentCount = page * pageSize;
  const listOrigin = positionQuery.list;
  const hasMore = currentCount < (listOrigin?.length ?? 0);
  const list = listOrigin?.slice(0, currentCount) ?? [];

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
                      <Trans>Time</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Action</Trans>
                    </Box>
                    <Box component="th">
                      <Trans>Assets</Trans>
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {list?.map((item) => {
                    return (
                      <Box
                        component="tr"
                        key={item.id}
                        sx={{
                          '& td': {
                            px: 24,
                            py: 20,
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <td>{formatDateTimeStr(item.time * 1000)}</td>
                        <td>{item.action}</td>
                        <td>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            {item.assets?.map((asset, index) => {
                              return (
                                <Fragment key={asset.token.address}>
                                  {index > 0 && (
                                    <Box
                                      sx={{
                                        width: '1px',
                                        height: '16px',
                                        backgroundColor:
                                          theme.palette.border.main,
                                        margin: '0 8px',
                                      }}
                                    />
                                  )}
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 2,
                                    }}
                                  >
                                    <TokenLogo
                                      address={asset.token.address}
                                      chainId={chainId}
                                      width={24}
                                      height={24}
                                      noBorder
                                      noShowChain
                                      marginRight={0}
                                    />
                                    <Box
                                      sx={{
                                        typography: 'body2',
                                      }}
                                    >
                                      {formatTokenAmountNumber({
                                        input: asset.amount,
                                        decimals: asset.token.decimals,
                                      })}
                                      &nbsp;{asset.token.symbol}
                                    </Box>
                                  </Box>
                                </Fragment>
                              );
                            })}
                          </Box>
                        </td>
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
};
