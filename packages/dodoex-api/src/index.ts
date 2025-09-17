export { setContractRequests } from '@dodoex/dodo-contract-request';
export {
  basicTokenMap,
  btcSignet,
  ChainId,
  contractConfig,
  etherTokenAddress,
  platformIdMap,
  SOL_NATIVE_MINT,
  sui,
  SUI_NATIVE_MINT,
  suiTestnet,
  ton,
  TON_NATIVE_MINT,
  tonEndpointByChain,
  tonTestnet,
  WSOL_NATIVE_MINT,
  zetachainTestnet,
} from './chainConfig';

export {
  ABIName,
  CONTRACT_QUERY_KEY,
  default as ContractRequests,
} from './helper/ContractRequests';
export type { ContractRequestsConfig, Query } from './helper/ContractRequests';
export { default as GraphQLRequests } from './helper/GraphQLRequests';
export { default as RestApiRequests } from './helper/RestApiRequests';

export { AMMV3Api } from './services/ammv3';
export type { TickData, Ticks } from './services/ammv3';
export {
  getPmmModel,
  PMMHelper,
  PMMModel,
  PMMState,
  PoolApi,
  solveQuadraticFunctionForTarget,
} from './services/pool';
export type { PmmModelParams, PoolType } from './services/pool';
export { SwapWidgetApi } from './services/SwapWidgetApi';

export { CurveApi } from './services/curve';

export { MiningApi, MiningStatusE } from './services/mining';
export type { MiningMiningInfo } from './services/mining';

export { TokenApi } from './services/TokenApi';

export type {
  Cross_Chain_Swap_Zetachain_OrderCreateQuery,
  Cross_Chain_Swap_Zetachain_RoutesQuery,
  Cross_Chain_Swap_Zetachain_TransactionEncodeQuery,
  Cross_Chain_Swap_ZetachainorderCreateData,
  Cross_Chain_Swap_ZetachainrouteParams,
  Cross_Chain_Swap_ZetachaintransactionEncodeParams,
  Curve_Stableswap_Ng_GetPoolInfoQuery,
} from './gql/graphql';
export { SwapApi } from './services/swap/SwapApi';
export { SystemApi } from './services/system/SystemApi';

export type ExcludeNone<T> = NonNullable<T>;
