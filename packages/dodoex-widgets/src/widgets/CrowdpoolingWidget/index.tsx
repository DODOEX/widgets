import { useRouterStore } from '../../router';
import { Page, PageType } from '../../router/types';
import CrowdpoolingList from './CrowdpoolingList/index';
import CrowdpoolingDetail from './CrowdpoolingDetail/index';
import CrowdpoolingCreate from './CrowdpoolingCreate';
import MyCrowdpoolingList from './MyCrowdpoolingList';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { CrowdpoolingPoolDetail } from './CrowdpoolingDetail/components/CrowdpoolingPoolDetail';

export function Crowdpooling() {
  const { routerPage } = useUserOptions();
  const pageLocal = useRouterStore((state) => state.page);
  const page = routerPage ?? pageLocal;

  switch (page?.type) {
    case PageType.CrowdpoolingList:
      return (
        <CrowdpoolingList
          params={(page as Page<PageType.CrowdpoolingList>).params}
        />
      );
    case PageType.CrowdpoolingDetail:
      return (
        <CrowdpoolingDetail
          params={(page as Page<PageType.CrowdpoolingDetail>).params}
        />
      );
    case PageType.CrowdpoolingPoolDetail:
      return (
        <CrowdpoolingPoolDetail
          params={(page as Page<PageType.CrowdpoolingPoolDetail>).params}
        />
      );
    case PageType.CreateCrowdpooling:
      return <CrowdpoolingCreate />;
    case PageType.MyCrowdpoolingList:
      return <MyCrowdpoolingList />;
    default:
      return (
        <CrowdpoolingList
          params={(page as Page<PageType.CrowdpoolingList>)?.params}
        />
      );
  }
}

export { CrowdpoolingPoolDetail };
