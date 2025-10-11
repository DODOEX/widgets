import { ChainId } from '@dodoex/api';
import {
  Box,
  Button,
  ButtonBase,
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
import { OperateTypeE, Ve33PoolInfoI, Ve33PoolOperateProps } from '../types';
import PoolTokenInfo from '../components/PoolTokenInfo';

export interface TableListProps {
  chainId: ChainId;
  poolList: Ve33PoolInfoI[];
  usdValueChecked: boolean;
  operatePool: Ve33PoolOperateProps | null;
  setOperatePool: (operate: Ve33PoolOperateProps | null) => void;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
  onClickPoolListRow: (id: string, chainId: ChainId) => void;
}

export const TableList = ({
  chainId,
  poolList,
  usdValueChecked,
  operatePool,
  setOperatePool,
  hasMore,
  loadMore,
  loadMoreLoading,
  onClickPoolListRow,
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
            <Trans>APR</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>TVL</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>Volume</Trans>
          </Box>
          <Box component="th" sx={{ width: 177, minWidth: 177 }}>
            <Trans>Fees</Trans>
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

          let operateBtnText = '';
          if (operatePool?.poolInfo?.id === item.id) {
            switch (operatePool.operateType) {
              case OperateTypeE.Remove:
                operateBtnText = t`Removing`;
                break;
              default:
                operateBtnText = t`Adding`;
                break;
            }
          }

          const hoverBg = theme.palette.background.tag;

          return (
            <Box
              component="tr"
              key={item.id + chainId}
              sx={{
                [`&:hover td${operateBtnText ? ', & td' : ''}`]: {
                  backgroundImage: `linear-gradient(${hoverBg}, ${hoverBg})`,
                },
                cursor: 'pointer',
              }}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('button')) {
                  onClickPoolListRow(item.id, chainId);
                }
              }}
            >
              <Box component="td">
                <PoolTokenInfo item={item} />
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
                  {usdValueChecked ? (
                    `$${formatShortNumber(item.totalValueLockedUSD)}`
                  ) : (
                    <>
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
                    </>
                  )}
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
                  {usdValueChecked ? (
                    `$${formatShortNumber(item.volumeUSD)}`
                  ) : (
                    <>
                      <Box>
                        {formatShortNumber(item.volumeToken0)}
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
                        {formatShortNumber(item.volumeToken1)}&nbsp;
                        <Box
                          component="span"
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {quoteToken.symbol}
                        </Box>
                      </Box>
                    </>
                  )}
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
                  {usdValueChecked ? (
                    `$${formatShortNumber(item.feesUSD)}`
                  ) : (
                    <>
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
                    </>
                  )}
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
                  {operateBtnText ? (
                    <Box
                      component={ButtonBase}
                      sx={{
                        typography: 'body2',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        px: 8,
                        width: 'max-content',
                        height: 32,
                        backgroundColor:
                          theme.palette.background.paperDarkContrast,
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setOperatePool(null);
                      }}
                    >
                      {operateBtnText}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.33335 9.16671H13.475L8.81669 4.50837L10 3.33337L16.6667 10L10 16.6667L8.82502 15.4917L13.475 10.8334H3.33335V9.16671Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Box>
                  ) : (
                    <Button
                      size={Button.Size.small}
                      onClick={() => {
                        setOperatePool({
                          chainId,
                          poolInfo: item,
                          operateType: OperateTypeE.Add,
                        });
                      }}
                      sx={{ height: 32, px: 0, width: 40 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.8125 10C17.8125 10.2486 17.7137 10.4871 17.5379 10.6629C17.3621 10.8387 17.1236 10.9375 16.875 10.9375H10.9375V16.875C10.9375 17.1236 10.8387 17.3621 10.6629 17.5379C10.4871 17.7137 10.2486 17.8125 10 17.8125C9.75136 17.8125 9.5129 17.7137 9.33709 17.5379C9.16127 17.3621 9.0625 17.1236 9.0625 16.875V10.9375H3.125C2.87636 10.9375 2.6379 10.8387 2.46209 10.6629C2.28627 10.4871 2.1875 10.2486 2.1875 10C2.1875 9.75136 2.28627 9.5129 2.46209 9.33709C2.6379 9.16127 2.87636 9.0625 3.125 9.0625H9.0625V3.125C9.0625 2.87636 9.16127 2.6379 9.33709 2.46209C9.5129 2.28627 9.75136 2.1875 10 2.1875C10.2486 2.1875 10.4871 2.28627 10.6629 2.46209C10.8387 2.6379 10.9375 2.87636 10.9375 3.125V9.0625H16.875C17.1236 9.0625 17.3621 9.16127 17.5379 9.33709C17.7137 9.5129 17.8125 9.75136 17.8125 10Z"
                          fill="currentColor"
                        />
                      </svg>
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
