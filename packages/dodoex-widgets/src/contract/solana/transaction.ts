import {
  ACCOUNT_SIZE,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createInitializeAccountInstruction,
  createSyncNativeInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptAccount,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

export async function wrappedSOL(
  tx: Transaction,
  connection: Connection,
  user: PublicKey,
  amount: string | number,
) {
  const ata = await getAssociatedTokenAddress(
    NATIVE_MINT, // mint
    user, // owner
  );
  const mintATAActual = await connection.getTokenAccountsByOwner(user, {
    mint: NATIVE_MINT,
  });
  // need create ATA
  if (!mintATAActual.value.length) {
    tx.add(
      createAssociatedTokenAccountInstruction(user, ata, user, NATIVE_MINT),
    );
  }
  tx.add(
    // trasnfer SOL
    SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: ata,
      lamports: BigInt(amount),
    }),
    // sync wrapped SOL balance
    createSyncNativeInstruction(ata),
  );
}

export async function unWrappedPartSOL(
  tx: Transaction,
  connection: Connection,
  user: PublicKey,
  amount: number,
) {
  const auxAccount = Keypair.generate();
  const auxAccountAta = await getAssociatedTokenAddress(
    NATIVE_MINT, // mint
    user,
  );
  const rent = await getMinimumBalanceForRentExemptAccount(connection);
  tx.add(
    // create token account
    SystemProgram.createAccount({
      fromPubkey: user,
      newAccountPubkey: auxAccount.publicKey,
      space: ACCOUNT_SIZE,
      lamports: rent + amount, // rent + amount
      programId: TOKEN_PROGRAM_ID,
    }),
    // init token account
    // createInitializeAccountInstruction(auxAccount.publicKey, NATIVE_MINT, user),
    // transfer WSOL
    // createCloseAccountInstruction(auxAccountAta, user, auxAccount.publicKey),
    // createTransferInstruction(auxAccount.publicKey, ata, user, amount),
    // close aux account
    createCloseAccountInstruction(auxAccount.publicKey, user, user),
  );
}
