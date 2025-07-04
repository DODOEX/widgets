import { ChainId } from '@dodoex/api';
import {
  Box,
  Checkbox,
  HoverOpacity,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { WIDGET_CLASS_NAME } from '../../../components/Widget';
import { formatApy, formatShortNumber } from '../../../utils';
import LiquidityTable from '../../PoolWidget/PoolList/components/LiquidityTable';
import { PoolTypeTag } from '../components/PoolTypeTag';
import { VotePoolInfoI } from '../types';

export interface TableListProps {
  chainId: ChainId;
  poolList: VotePoolInfoI[];
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
  onSelectPool: (id: string, selected: boolean) => void;
  selectedPoolList: { [key: string]: boolean };
}

export const TableList = ({
  chainId,
  poolList,
  hasMore,
  loadMore,
  loadMoreLoading,
  onSelectPool,
  selectedPoolList,
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
          <Box component="th" sx={{ width: 280, minWidth: 280 }}>
            <Trans>Pair</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>vAPR</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>TVL</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>Fees</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>Incentives</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>Total Vote</Trans>
          </Box>
          <Box
            component="th"
            sx={{
              width: 136,
              minWidth: 136,
            }}
          ></Box>
        </Box>
      </Box>
      <Box component="tbody">
        {poolList?.map((item) => {
          if (!item) {
            return null;
          }
          const { baseToken, quoteToken } = item;
          const aprText = item.apr ? formatApy(item.apr.fees) : undefined;
          return (
            <Box component="tr" key={item.id + chainId}>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <TokenLogoPair
                    tokens={[baseToken, quoteToken]}
                    width={24}
                    mr={0}
                    chainId={chainId}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        typography: 'body2',
                        fontWeight: 600,
                      }}
                    >
                      {`${baseToken.symbol}/${quoteToken.symbol}`}

                      <Tooltip
                        title={
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                              width: 240,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box
                                sx={{
                                  typography: 'h6',
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                Pool Address
                              </Box>
                              <AddressWithLinkAndCopy
                                address={item.id}
                                customChainId={chainId}
                                showCopy
                                truncate
                                iconSpace={4}
                                iconSize={14}
                                size="small"
                              />
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box
                                sx={{
                                  typography: 'h6',
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                Gauge Address
                              </Box>
                              <AddressWithLinkAndCopy
                                address={item.gaugeAddress}
                                customChainId={chainId}
                                showCopy
                                truncate
                                iconSpace={4}
                                iconSize={14}
                                size="small"
                              />
                            </Box>
                          </Box>
                        }
                        placement="top"
                        container={document.querySelector(
                          `.${WIDGET_CLASS_NAME}`,
                        )}
                        onlyHover
                        sx={{
                          maxWidth: 300,
                        }}
                      >
                        <HoverOpacity
                          sx={{
                            width: 14,
                            height: 14,
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.99999 1.16675C3.77999 1.16675 1.16666 3.78008 1.16666 7.00008C1.16666 10.2201 3.77999 12.8334 6.99999 12.8334C10.22 12.8334 12.8333 10.2201 12.8333 7.00008C12.8333 3.78008 10.22 1.16675 6.99999 1.16675ZM7.58336 5.25006V4.08339H6.4167V5.25006H7.58336ZM7.58336 9.91673V6.41673H6.4167V9.91673H7.58336ZM2.33336 7.00006C2.33336 9.57256 4.42753 11.6667 7.00003 11.6667C9.57253 11.6667 11.6667 9.57256 11.6667 7.00006C11.6667 4.42756 9.57253 2.33339 7.00003 2.33339C4.42753 2.33339 2.33336 4.42756 2.33336 7.00006Z"
                              fill="currentColor"
                            />
                          </svg>
                        </HoverOpacity>
                      </Tooltip>
                    </Box>
                    <PoolTypeTag
                      type={item.type}
                      stable={item.stable}
                      fee={item.fee}
                    />
                  </Box>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    color: theme.palette.success.main,
                  }}
                >
                  {aprText}
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 4,
                  }}
                >
                  <Box>
                    {formatShortNumber(item.totalValueLockedToken0)}
                    &nbsp;
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {baseToken.symbol}
                    </Box>
                  </Box>
                  <Box>
                    {formatShortNumber(item.totalValueLockedToken1)}&nbsp;
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {quoteToken.symbol}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 4,
                  }}
                >
                  <Box>
                    {formatShortNumber(item.feesToken0)}
                    &nbsp;
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {baseToken.symbol}
                    </Box>
                  </Box>
                  <Box>
                    {formatShortNumber(item.feesToken1)}&nbsp;
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {quoteToken.symbol}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 4,
                  }}
                >
                  Incentives
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 4,
                  }}
                >
                  <Box>Votes</Box>
                </Box>
              </Box>
              <Box component="td">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                  }}
                >
                  <Checkbox
                    sx={{
                      top: -1,
                    }}
                    checked={!!selectedPoolList[item.id]}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      const { checked } = evt.target;
                      onSelectPool(item.id, checked);
                    }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </LiquidityTable>
  );
};
