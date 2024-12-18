import { TicksQuery } from '../../gql/graphql';

export { AMMV3Api } from './AMMV3Api';

export type Ticks = NonNullable<TicksQuery['ticks']>;
export type TickData = Ticks[number];
