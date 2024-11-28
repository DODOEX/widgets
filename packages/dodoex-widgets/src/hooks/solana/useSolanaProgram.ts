import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import React from 'react';

export function useSolanaProgram(idl: Idl) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = React.useMemo(() => {
    if (!wallet) {
      return undefined;
    }
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions(),
    );
    return new Program(idl, provider);
  }, [idl, wallet, connection]);

  return program;
}
