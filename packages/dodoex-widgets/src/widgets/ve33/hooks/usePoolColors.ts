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
  if (type === PoolTypeE.CLPool) {
    return {
      color: '#C39624',
      backgroundColor: '#C3962433',
      name: `V3·CL=${fee}`,
    };
  }

  return {
    color: '#9BB168',
    backgroundColor: '#68873D33',
    name: stable ? 'V2·Stable' : 'V2·Volatile',
  };
}
