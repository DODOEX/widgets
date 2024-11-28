import { useSolanaProgram } from './useSolanaProgram';
import idl from '../../contract/solana/idl/DODOStablePool.json';

export function useSolanaStablePoolProgram() {
  return useSolanaProgram(idl);
}
