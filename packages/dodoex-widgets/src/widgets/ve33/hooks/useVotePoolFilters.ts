import React from 'react';
import { PoolTypeE } from '../types';

export enum VotePoolFilters {
  All = 'all',
  V2 = PoolTypeE.Pool,
  V3 = PoolTypeE.CLPool,
}

export function useVotePoolFilters() {
  const [votePoolFilter, setVotePoolFilter] = React.useState(
    VotePoolFilters.All,
  );
  const filters = React.useMemo(() => {
    const result = [
      { key: VotePoolFilters.All, value: 'All' },
      {
        key: VotePoolFilters.V2,
        value: 'V2',
      },
      {
        key: VotePoolFilters.V3,
        value: 'V3',
      },
    ];

    return result;
  }, []);

  const handleChangeVotePoolFilter = (votePoolFilter: VotePoolFilters) => {
    setVotePoolFilter(votePoolFilter);
  };

  return {
    votePoolFilter,
    filters,
    handleChangeVotePoolFilter,
  };
}
