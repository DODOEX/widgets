import { TokenInfo } from '../../../../../hooks/Token/type';

export interface BifrostMintToken {
  /** The source token to send (e.g. native PHRS/ASTR) */
  token: TokenInfo;
  /** The wrapped liquid staking token received after minting (e.g. vASTR).
   *  Used to match against pool tokens to decide whether to show this module. */
  wrapToken: TokenInfo;
  chainId: number;
}
