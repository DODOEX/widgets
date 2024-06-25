import { ChainId } from '@dodoex/api';
import { PoolTab } from '../widgets/PoolWidget/PoolList/hooks/usePoolListTabs';

export enum PageType {
  Pool = 'pool',
  PoolDetail = 'poolDetail',
  CreatePool = 'createPool',
  ModifyPool = 'modifyPool',
  MiningDetail = 'miningDetail',
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
  [PageType.CreatePool]:
    | {
        fromAddress?: string;
        toAddress?: string;
      }
    | undefined;
  [PageType.MiningDetail]: {
    address: string;
    chainId: ChainId;
  };
}

export interface Page<T extends PageType = PageType> {
  type: T;
  params?: PageTypeParams[T];
}
