import { PublicKey } from '@solana/web3.js';
import { utils } from '@coral-xyz/anchor';

export const POOL_SEED = Buffer.from(utils.bytes.utf8.encode('pool'));

export const POOL_LPMINT_SEED = Buffer.from(utils.bytes.utf8.encode('lp_mint'));

export const POOL_BASE_VAULT_SEED = Buffer.from(
  utils.bytes.utf8.encode('base_vault'),
);
export const POOL_QUOTE_VAULT_SEED = Buffer.from(
  utils.bytes.utf8.encode('quote_vault'),
);
export const POOL_AUTH_SEED = Buffer.from(utils.bytes.utf8.encode('authority'));

export async function getAuthAddress(
  programId: PublicKey,
): Promise<[PublicKey, number]> {
  return await PublicKey.findProgramAddress([POOL_AUTH_SEED], programId);
}

export function sortsBeforeToken(baseToken: PublicKey, quoteToken: PublicKey) {
  return (
    baseToken.toString().toLowerCase() < quoteToken.toString().toLowerCase()
  );
}

export async function getPoolAddress(
  baseToken: PublicKey,
  quoteToken: PublicKey,
  programId: PublicKey,
): Promise<[PublicKey, number]> {
  const isBaseBefore = sortsBeforeToken(baseToken, quoteToken);
  const token0 = isBaseBefore ? baseToken : quoteToken;
  const token1 = isBaseBefore ? quoteToken : baseToken;
  return await PublicKey.findProgramAddress(
    [token0.toBuffer(), token1.toBuffer(), POOL_SEED],
    programId,
  );
}

export async function getPoolLpMintAddress(
  poolAddress: PublicKey,
  programId: PublicKey,
): Promise<[PublicKey, number]> {
  return await PublicKey.findProgramAddress(
    [POOL_LPMINT_SEED, poolAddress.toBuffer()],
    programId,
  );
}

export async function getBaseVaultAddress(
  poolState: PublicKey,
  programId: PublicKey,
): Promise<[PublicKey, number]> {
  return await PublicKey.findProgramAddress(
    [POOL_BASE_VAULT_SEED, poolState.toBuffer()],
    programId,
  );
}

export async function getQuoteVaultAddress(
  poolState: PublicKey,
  programId: PublicKey,
): Promise<[PublicKey, number]> {
  return await PublicKey.findProgramAddress(
    [POOL_QUOTE_VAULT_SEED, poolState.toBuffer()],
    programId,
  );
}
