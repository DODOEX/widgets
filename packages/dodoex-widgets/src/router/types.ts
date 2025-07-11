import { ChainId } from '@dodoex/api';
import { PoolTab } from '../widgets/PoolWidget/PoolList/hooks/usePoolListTabs';

export enum PageType {
  Pool = 'pool',
  PoolDetail = 'poolDetail',
  CurvePoolDetail = 'curvePoolDetail',
  CreatePool = 'createPool',
  ModifyPool = 'modifyPool',
  MiningList = 'miningList',
  MiningDetail = 'miningDetail',
  createPoolAMMV2 = 'createPoolAMMV2',
  createPoolAMMV3 = 'createPoolAMMV3',
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
  [PageType.CurvePoolDetail]: {
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
  [PageType.MiningList]: {
    chainId: number;
  };
  [PageType.MiningDetail]: {
    chainId: number;
    miningContractAddress: string | undefined;
    stakeTokenAddress: string | undefined;
  };
  [PageType.createPoolAMMV2]: undefined;
  [PageType.createPoolAMMV3]:
    | {
        from?: string;
        to?: string;
        fee?: string;
      }
    | undefined;
}

export interface Page<T extends PageType = PageType> {
  type: T;
  params?: PageTypeParams[T];
}
