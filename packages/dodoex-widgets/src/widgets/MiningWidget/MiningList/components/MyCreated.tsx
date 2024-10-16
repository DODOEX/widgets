import { Box } from '@dodoex/components';
import { DataCardGroup } from '../../../../components/DataCard/DataCardGroup';
import LoadingCard from '../../../PoolWidget/PoolList/components/LoadingCard';
import { useMyCreatedMiningList } from '../../hooks/useMyCreatedMiningList';
import { MiningListEmpty } from './MiningListEmpty';

export function MyCreated({
  miningList,
  loading,
  refetch,
  error,
  hasSearch,
}: {
  miningList: ReturnType<typeof useMyCreatedMiningList>['miningList'];
  loading: ReturnType<typeof useMyCreatedMiningList>['loading'];
  refetch: ReturnType<typeof useMyCreatedMiningList>['refetch'];
  error: ReturnType<typeof useMyCreatedMiningList>['error'];
  hasSearch?: boolean;
}) {
  if (loading) {
    return (
      <DataCardGroup gap={12} repeatBaseForLargeScreen={2}>
        <LoadingCard />
      </DataCardGroup>
    );
  }

  if (!miningList || !miningList.length) {
    return (
      <MiningListEmpty
        notFoundText={i18n._('You have not create any mining')}
        hasSearch={hasSearch}
      />
    );
  }

  return (
    <DataCardGroup gap={12} repeatBaseForLargeScreen={2}>
      {miningList.map((miningItem) => {
        const key = miningItem.id;
        return <Box key={key}>{miningItem.name}</Box>;
      })}
    </DataCardGroup>
  );
}
