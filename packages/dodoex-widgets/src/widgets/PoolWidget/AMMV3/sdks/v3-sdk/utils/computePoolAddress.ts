import { ChainId } from '@dodoex/api';
import { getPdaPoolId } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { clmmConfigMap } from '../../../../../../hooks/raydium-sdk-V2/common/programId';
import { FeeAmount } from '../constants';

/**
 * Computes a pool address
 * @param mint1 The first token of the pair, irrespective of sort order
 * @param mint2 The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param chainId
 * @returns The pool address
 */
export function computePoolAddress({
  chainId,
  feeAmount,
  mint1Address,
  mint2Address,
}: {
  chainId: ChainId;
  feeAmount: FeeAmount;
  mint1Address: string;
  mint2Address: string;
}): PublicKey {
  const [mintA, mintB] = new BN(new PublicKey(mint1Address).toBuffer()).gt(
    new BN(new PublicKey(mint2Address).toBuffer()),
  )
    ? [mint2Address, mint1Address]
    : [mint1Address, mint2Address];
  const [mintAAddress, mintBAddress] = [
    new PublicKey(mintA),
    new PublicKey(mintB),
  ];

  const clmmConfig = clmmConfigMap[chainId];

  if (!clmmConfig) {
    throw new Error('Invalid config');
  }

  const feeConfig = clmmConfig.config.find(
    (config) => config.tradeFeeRate === feeAmount,
  );

  if (!feeConfig) {
    throw new Error('Invalid fee');
  }

  const { publicKey: poolId } = getPdaPoolId(
    clmmConfig.programId,
    new PublicKey(feeConfig.id),
    mintAAddress,
    mintBAddress,
  );

  return poolId;
}
