import { getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions } from '@dodoex/dodo-contract-request';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { increaseArray } from '../../../../utils/utils';

export function useVe33PoolPositions({
  address,
  chainId,
  account,
}: {
  address: string | undefined;
  chainId: number | undefined;
  account: string | undefined;
}) {
  const balanceQuery = useQuery(
    getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions(
      chainId,
      account,
    ),
  );
  const tokenIdsArgs = React.useMemo(() => {
    if (!balanceQuery.data) return [];
    return increaseArray(Number(balanceQuery.data)).map((_, i) => [account, i]);
  }, [account, balanceQuery.data]);

  console.log(tokenIdsArgs);
}
