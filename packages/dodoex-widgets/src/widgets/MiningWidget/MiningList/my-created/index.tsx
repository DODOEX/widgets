import { useLingui } from '@lingui/react';
import { DataCardGroup } from '../../../../components/DataCard/DataCardGroup';
import LoadingCard from '../../../PoolWidget/PoolList/components/LoadingCard';
import { useMyCreatedMiningList } from '../../hooks/useMyCreatedMiningList';
import { MiningListEmpty } from '../components/MiningListEmpty';
import { MyCreatedMining } from './MyCreatedMining';
import { MiningListLoading } from '../components/MiningListLoading';

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
  const { i18n } = useLingui();

  if (loading) {
    return (
      <DataCardGroup gap={12} repeatBaseForLargeScreen={2}>
        <MiningListLoading />
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
        return (
          <MyCreatedMining
            key={key}
            miningItem={miningItem}
            refetch={refetch}
          />
        );
      })}
    </DataCardGroup>
  );
}
