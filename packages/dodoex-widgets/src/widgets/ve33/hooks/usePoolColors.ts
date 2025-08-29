import { alpha, useTheme } from '@dodoex/components';
import { PoolTypeE } from '../types';
import { Ve33PoolInfoI } from '../types';

export function usePoolColors({
  type,
  stable,
  fee,
}: {
  type: PoolTypeE;
  stable: boolean;
  fee: Ve33PoolInfoI['fee'];
}) {
  const theme = useTheme();
  if (type === PoolTypeE.CLPool) {
    return {
      color: theme.palette.warning.main,
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      name: `V3·CL=${fee}`,
    };
  }

  return {
    color: theme.palette.purple.main,
    backgroundColor: alpha(theme.palette.purple.main, 0.1),
    name: stable ? 'V2·Stable' : 'V2·Volatile',
  };
}
