import { ChainId } from '@dodoex/api';
import { ApiClmmConfigV3, ApiCpmmConfigInfo } from '@raydium-io/raydium-sdk-v2';
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
export const CREATE_CPMM_CONFIG: ApiCpmmConfigInfo[] = [
  {
    id: 'CH6Hqtxeo2vdyn5BvXB952sy4e2hiWEPLZFn74wGDMVz',
    index: 0,
    protocolFeeRate: 200,
    tradeFeeRate: 1000,
    fundFeeRate: 100,
    createPoolFee: '10000000',
  },
];

export const cpmmConfigMap: Record<
  ChainId,
  {
    programId: PublicKey;
    auth: PublicKey;
    config: ApiCpmmConfigInfo[];
    feeAcc: PublicKey;
  }
> = {
  [ChainId.SOON_TESTNET]: {
    programId: CREATE_CPMM_POOL_PROGRAM,
    auth: CREATE_CPMM_POOL_AUTH,
    config: CREATE_CPMM_CONFIG,
    feeAcc: CREATE_CPMM_POOL_FEE_ACC,
  },
  [ChainId.SOON]: {
    programId: CREATE_CPMM_POOL_PROGRAM,
    auth: CREATE_CPMM_POOL_AUTH,
    config: CREATE_CPMM_CONFIG,
    feeAcc: CREATE_CPMM_POOL_FEE_ACC,
  },
};

export const CLMM_PROGRAM_ID = new PublicKey(
  '2cjsT5HYL1qM8KmhdCjjJrXSrnMpbDbDruAT7UYTH8af',
);

export const CREATE_CLMM_CONFIG: ApiClmmConfigV3[] = [
  {
    id: '9vUeSD34ggBLRbqdyUALxwuMqbVCioMp4wQRriQ7ydPw',
    index: 0,
    protocolFeeRate: 200,
    tradeFeeRate: 1000,
    tickSpacing: 20,
    fundFeeRate: 0,
    description: '',
    defaultRange: 0,
    defaultRangePoint: [],
  },
];

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

export const clmmConfigMap: Record<
  ChainId,
  {
    programId: PublicKey;
    config: ApiClmmConfigV3[];
  }
> = {
  [ChainId.SOON_TESTNET]: {
    programId: CLMM_PROGRAM_ID,
    config: CREATE_CLMM_CONFIG,
  },
  [ChainId.SOON]: {
    programId: CLMM_PROGRAM_ID,
    config: CREATE_CLMM_CONFIG,
  },
};
