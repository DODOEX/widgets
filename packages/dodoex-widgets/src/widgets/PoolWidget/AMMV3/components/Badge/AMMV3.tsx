import { BoxProps } from '@dodoex/components';
import { PoolTypeTag } from '../../../PoolList/components/tags';

export interface AMMV3Props {
  sx?: BoxProps['sx'];
}

export const AMMV3 = ({ sx }: AMMV3Props) => {
  return <PoolTypeTag poolType="AMM V3" />;
};
