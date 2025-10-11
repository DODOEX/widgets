import { ChainId } from '@dodoex/api';
import { Box, Checkbox } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { formatShortNumber } from '../../../utils';
import LiquidityTable from '../../PoolWidget/PoolList/components/LiquidityTable';
import { VotePoolInfoI } from '../types';
import {
  FeesWidgets,
  IncentivesWidgets,
  TotalVoteWidgets,
  VAPRWidgets,
} from './widgets';
import PoolTokenInfo from '../components/PoolTokenInfo';

export interface TableListProps {
  chainId: ChainId;
  poolList: VotePoolInfoI[];
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
  onSelectPool: (item: VotePoolInfoI) => void;
  selectedPoolList: string[];
  onAddIncentives: (item: VotePoolInfoI) => void;
}

export const TableList = ({
  chainId,
  poolList,
  hasMore,
  loadMore,
  loadMoreLoading,
  onSelectPool,
  selectedPoolList,
  onAddIncentives,
}: TableListProps) => {
  return (
    <LiquidityTable
      hasMore={hasMore}
      loadMore={loadMore}
      loadMoreLoading={loadMoreLoading}
      sx={{
        maxHeight: 'max-content',
      }}
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

          return (
            <Box component="tr" key={item.id + chainId}>
              <Box component="td">
                <PoolTokenInfo item={item} />
              </Box>
              <Box component="td">
                <VAPRWidgets item={item} />{' '}
              </Box>
              <Box component="td">${formatShortNumber(item.tvl)}</Box>
              <Box component="td">
                <FeesWidgets item={item} />
              </Box>
              <Box component="td">
                <IncentivesWidgets
                  item={item}
                  onAddIncentives={onAddIncentives}
                />
              </Box>
              <Box component="td">
                <TotalVoteWidgets item={item} />
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
                    checked={!!selectedPoolList.includes(item.id)}
                    onChange={() => {
                      onSelectPool(item);
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
