import { ChainId } from '../constants/chains';
import { PoolTab } from '../widgets/PoolWidget/list/hooks/usePoolListTabs';

export enum PageType {
  Pool = 'pool',
  PoolDetail = 'poolDetail',
  CreatePool = 'createPool',
  ModifyPool = 'modifyPool',
}

interface PageTypeParams {
  [PageType.Pool]:
    | {
        tab?: PoolTab;
      }
    | undefined;
  [PageType.PoolDetail]: {
    address: string;
    chainId: ChainId;
  };
  [PageType.ModifyPool]: {
    address: string;
    chainId: ChainId;
  };
  [PageType.CreatePool]: undefined;
}

export interface Page<T extends PageType = PageType> {
  type: T;
  params: PageTypeParams[T];
}
