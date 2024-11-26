import { AllV3TicksQuery } from '../../uniswap-data-api/graphql';

export type { Chain as UniswapGraphqlChainId } from '../../uniswap-data-api/graphql';
export { AMMV3Api } from './AMMV3Api';

export type Ticks = NonNullable<
  NonNullable<AllV3TicksQuery['v3Pool']>['ticks']
>;
export type TickData = Ticks[number];
