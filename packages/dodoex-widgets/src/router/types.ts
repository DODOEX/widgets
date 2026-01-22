import { ChainId } from '@dodoex/api';
import { PoolTab } from '../widgets/PoolWidget/PoolList/hooks/usePoolListTabs';

export enum PageType {
  Pool = 'pool',
  PoolDetail = 'poolDetail',
  CreatePool = 'createPool',
  ModifyPool = 'modifyPool',
  MiningList = 'miningList',
  MiningDetail = 'miningDetail',
  createPoolAMMV2 = 'createPoolAMMV2',
  createPoolAMMV3 = 'createPoolAMMV3',
  CrowdpoolingList = 'crowdpoolingList',
  CrowdpoolingDetail = 'crowdpoolingDetail',
  CrowdpoolingPoolDetail = 'crowdpoolingPoolDetail',
  CreateCrowdpooling = 'createCrowdpooling',
  MyCrowdpoolingList = 'myCrowdpoolingList',
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
  [PageType.CrowdpoolingList]:
    | {
        tab?: 'all' | 'my';
      }
    | undefined;
  [PageType.CrowdpoolingDetail]: {
    address: string;
    chainId: ChainId;
  };
  [PageType.CrowdpoolingPoolDetail]: {
    address: string;
    chainId: ChainId;
  };
  [PageType.CreateCrowdpooling]: undefined;
  [PageType.MyCrowdpoolingList]: undefined;
}

export interface Page<T extends PageType = PageType> {
  type: T;
  params?: PageTypeParams[T];
}
