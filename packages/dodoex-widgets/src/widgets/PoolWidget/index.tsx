import { useRouterStore } from '../../router';
import { PageType } from '../../router/types';
import PoolList from './PoolList';
import PoolCreate from './PoolCreate';
import PoolModify from './PoolModify';
import PoolDetail from './PoolDetail';

export function Pool() {
  const pageType = useRouterStore((state) => state.page?.type);
  switch (pageType) {
    case PageType.Pool:
      return <PoolList />;
    case PageType.CreatePool:
      return <PoolCreate />;
    case PageType.ModifyPool:
      return <PoolModify />;
    case PageType.PoolDetail:
      return <PoolDetail />;
    default:
      return <PoolList />;
  }
}
