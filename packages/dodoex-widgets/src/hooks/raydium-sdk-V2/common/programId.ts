import { PublicKey } from '@solana/web3.js';

/** -----soon testnet----- */
export const CREATE_CPMM_POOL_PROGRAM = new PublicKey(
  '7edX7tQeA2wFLPAJGMXaAMgQCFsCucfh8U13uwy5SEfG',
);
export const CREATE_CPMM_POOL_AUTH = new PublicKey(
  'GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL',
);
/** create pool fee account */
export const CREATE_CPMM_POOL_FEE_ACC = new PublicKey(
  'H2aUP7F3sby7cGrZoKDn1GiPRsw5TjPoPc6kYYasfLYE',
);
/**
 * @see https://api-v3.raydium.io/main/cpmm-config
 */
export const CREATE_CPMM_CONFIG = [
  {
    id: 'CH6Hqtxeo2vdyn5BvXB952sy4e2hiWEPLZFn74wGDMVz',
    index: 0,
    protocolFeeRate: 200,
    tradeFeeRate: 1000,
    fundFeeRate: 100,
    createPoolFee: '10000000',
  },
];
