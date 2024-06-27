import { MiningApi, MiningStatusE } from '@dodoex/api';
import { graphQLRequests } from '../../../constants/api';
import OperateArea from '../OperateArea';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { OperateType } from '../types';
import { useStatusAndStartBlockNumber } from '../hooks/useStatusAndStartBlockNumber';

export default function LpTokenMiningOperate({
  chainId,
  account,
  poolAddress,
  goLpLink,
}: {
  chainId: number;
  account: string | undefined;
  poolAddress: string;
  goLpLink?: () => void;
}) {
  const query = graphQLRequests.getQuery(MiningApi.graphql.fetchMiningList, {
    where: {
      chainIds: [chainId],
      user: account,
      filterState: {
        address: poolAddress,
      },
    },
  });
  const fetchResult = useQuery({
    ...query,
    enabled: !!poolAddress,
  });
  const miningItem = fetchResult.data?.mining_list?.list?.[0];

  const { status } = useStatusAndStartBlockNumber({
    miningItem,
  });
  const [operateType, setOperateType] = React.useState<OperateType>(
    status === MiningStatusE.ended ? 'unstake' : 'stake',
  );

  return (
    <OperateArea
      chainId={chainId}
      loading={fetchResult.isLoading || fetchResult.isPending}
      operateType={operateType}
      setOperateType={setOperateType}
      associatedMineSectionVisible
      miningItem={miningItem}
      status={status}
      goLpLink={goLpLink}
      poolAddress={poolAddress}
    />
  );
}
