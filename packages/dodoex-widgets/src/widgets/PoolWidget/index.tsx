import { useRouterStore } from '../../router';
import { Page, PageType } from '../../router/types';
import PoolList from './PoolList';
import PoolCreate from './PoolCreate';
import PoolModify from './PoolModify';
import PoolDetail from './PoolDetail';
import { useUserOptions } from '../../components/UserOptionsProvider';
import AMMV2Create from './AMMV2Create';

export function Pool() {
  const { routerPage } = useUserOptions();
  const pageLocal = useRouterStore((state) => state.page);
  const page = routerPage ?? pageLocal;

  switch (page?.type) {
    case PageType.Pool:
      return <PoolList params={(page as Page<PageType.Pool>).params} />;
    case PageType.CreatePool:
      return <PoolCreate />;
    case PageType.ModifyPool:
      return <PoolModify params={(page as Page<PageType.ModifyPool>).params} />;
    case PageType.PoolDetail:
      return <PoolDetail params={(page as Page<PageType.PoolDetail>).params} />;
    case PageType.createPoolAMMV2:
      return <AMMV2Create />;
    default:
      return <PoolList params={(page as Page<PageType.Pool>)?.params} />;
  }
}
