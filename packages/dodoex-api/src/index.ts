export {
  ChainId,
  etherTokenAddress,
  basicTokenMap,
  contractConfig,
  platformIdMap,
} from './chainConfig';
export { setContractRequests } from '@dodoex/dodo-contract-request';

export { default as RestApiRequests } from './helper/RestApiRequests';
export { default as GraphQLRequests } from './helper/GraphQLRequests';
export {
  default as ContractRequests,
  ABIName,
  CONTRACT_QUERY_KEY,
} from './helper/ContractRequests';
export type { Query, ContractRequestsConfig } from './helper/ContractRequests';

export { SwapWidgetApi } from './services/SwapWidgetApi';
export {
  PoolApi,
  PMMModel,
  PMMHelper,
  PMMState,
  getPmmModel,
  solveQuadraticFunctionForTarget,
} from './services/pool';
export type { PmmModelParams } from './services/pool';
export type { PoolType } from './services/pool';

export { MiningApi, MiningStatusE } from './services/mining';
export type { MiningMiningInfo } from './services/mining';

export { TokenApi } from './services/TokenApi';

export { SwapApi } from './services/swap/SwapApi';
export { SystemApi } from './services/system/SystemApi';

export { UniPoolV2Api } from './services/UniPoolV2Api';

export type ExcludeNone<T> = NonNullable<T>;
