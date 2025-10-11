import { ChainId } from '@dodoex/api';
import { Box, Button, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { formatApy, formatShortNumber } from '../../../utils';
import LiquidityTable from '../../PoolWidget/PoolList/components/LiquidityTable';
import { Ve33PoolInfoI } from '../types';
import PoolTokenInfo from '../components/PoolTokenInfo';

export interface TableListProps {
  chainId: ChainId;
  poolList: Ve33PoolInfoI[];
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
  onAdd: (pool: Ve33PoolInfoI) => void;
}

export const TableList = ({
  chainId,
  poolList,
  hasMore,
  loadMore,
  loadMoreLoading,
  onAdd,
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
          <Box component="th" sx={{ width: 200 }}>
            <Trans>Pair</Trans>
          </Box>
          <Box component="th">
            <Trans>APR</Trans>
          </Box>
          <Box component="th">
            <Trans>TVL</Trans>
          </Box>
          <Box component="th" sx={{ width: 140 }}></Box>
        </Box>
      </Box>
      <Box component="tbody">
        {poolList?.map((item) => {
          if (!item) {
            return null;
          }

          const aprText = item.apr ? formatApy(item.apr.fees) : undefined;

          const hoverBg = theme.palette.background.tag;

          return (
            <Box
              component="tr"
              key={item.id + chainId}
              sx={{
                [`&:hover td`]: {
                  backgroundImage: `linear-gradient(${hoverBg}, ${hoverBg})`,
                },
                cursor: 'pointer',
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
                  {`$${formatShortNumber(item.totalValueLockedUSD)}`}
                </Box>
              </Box>
              <Box component="td">
                <Button
                  variant={Button.Variant.outlined}
                  size={Button.Size.small}
                  onClick={() => onAdd(item)}
                >{t`Add Incentive`}</Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </LiquidityTable>
  );
};
