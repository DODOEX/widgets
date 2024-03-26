import { useRouterStore } from '../../router';
import { PageType } from '../../router/types';
import PoolList from './list';
import PoolCreate from './PoolCreate';

export function Pool() {
  const pageType = useRouterStore((state) => state.page?.type);
  switch (pageType) {
    case PageType.Pool:
      return <PoolList />;
    case PageType.CreatePool:
      return <PoolCreate />;
    default:
      return <PoolCreate />;
  }
}
