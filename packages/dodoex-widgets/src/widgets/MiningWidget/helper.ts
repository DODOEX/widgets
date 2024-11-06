import { MiningApi } from '@dodoex/api';
import { contractRequests } from '../../constants/api';

export const miningApi = new MiningApi({
  contractRequests,
});
