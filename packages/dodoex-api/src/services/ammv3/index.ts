import type { Amm_GetTicksDataQuery } from '../../gql/graphql';

export { AMMV3Api } from './AMMV3Api';

export type Ticks = NonNullable<
  Amm_GetTicksDataQuery['amm_getTicksData']['ticks']
>;
export type TickData = Ticks[number];
