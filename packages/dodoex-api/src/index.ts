// export { setContractRequests } from '@dodoex/dodo-contract-request';
export {
  basicTokenMap,
  ChainId,
  chainIdShortNameEnum,
  chainIdToShortName,
  contractConfig,
  platformIdMap,
  SOL_MINT_ADDRESS,
  WSOL_MINT_ADDRESS,
} from './chainConfig';

// export {
//   ABIName,
//   CONTRACT_QUERY_KEY,
//   default as ContractRequests,
// } from './helper/ContractRequests';
// export type { ContractRequestsConfig, Query } from './helper/ContractRequests';
export { default as GraphQLRequests } from './helper/GraphQLRequests';
export { default as RestApiRequests } from './helper/RestApiRequests';

export { AMMV3Api } from './services/ammv3';
export type { TickData, Ticks } from './services/ammv3';
// export {
//   getPmmModel,
//   PMMHelper,
//   PMMModel,
//   PMMState,
//   PoolApi,
//   solveQuadraticFunctionForTarget,
// } from './services/pool';
// export type { PmmModelParams, PoolType } from './services/pool';
export { CLMM, CPMM, PoolApi } from './services/pool';
export type { PoolType } from './services/pool';
export { SwapWidgetApi } from './services/SwapWidgetApi';

// export { MiningApi, MiningStatusE } from './services/mining';
// export type { MiningMiningInfo } from './services/mining';

export { TokenApi } from './services/TokenApi';

// export { SwapApi } from './services/swap/SwapApi';
export { SystemApi } from './services/system/SystemApi';

export type ExcludeNone<T> = NonNullable<T>;
