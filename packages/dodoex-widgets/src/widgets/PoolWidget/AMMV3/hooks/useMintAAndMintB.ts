import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { useMemo } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useTokenInfo } from './useTokenInfo';

export function useMintAAndMintB({
  mint1Address,
  mint2Address,
}: {
  mint1Address: string;
  mint2Address: string;
}) {
  const { chainId } = useWalletInfo();

  const mint1 = useTokenInfo({
    mint: mint1Address,
    chainId,
  });
  const mint2 = useTokenInfo({
    mint: mint2Address,
    chainId,
  });

  // clmm 中 mint 的实际顺序
  const [mintA, mintB] = useMemo(() => {
    if (!mint1 || !mint2) {
      return [undefined, undefined];
    }

    return new BN(new PublicKey(mint1.address).toBuffer()).gt(
      new BN(new PublicKey(mint2.address).toBuffer()),
    )
      ? [mint2, mint1]
      : [mint1, mint2];
  }, [mint1, mint2]);

  return {
    mintA,
    mintB,
  };
}
