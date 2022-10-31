/**
 * Let's pretend that typescript has ADT
 */

import { BigNumber } from 'bignumber.js';
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';

/**
 * All supported opcodes, as tagged union discriminants
 */
export enum OpCode {
  Approval = 'APPROVAL',
  TX = 'TX',
  TypedSign = 'TypedSign',
}

export enum SwapType {
  Normal = 'Normal',
  Privacy = 'Privacy',
  LimitOrder = 'LimitOrder',
  RFQ = 'RFQ',
}

export type TokenData = {
  address: string;
};

export type ApprovalStep = {
  opcode: OpCode.Approval;

  /**
   * The address of the token
   */
  token: TokenData;

  /**
   * The approved contract address
   */
  contract: string;

  /**
   * The amount to set the allowance to, in Wei, in base-10. If omitted, a (very) big constants is used
   * TODO(meow): bigint shows a 87% support rate. Can we use it here?
   */
  amt?: BigNumber;
};

export type TXStep = {
  opcode: OpCode.TX;

  value: number | string;
  to: string;
  data: string;

  // Gas is handled by the tx submodule
  swapType?: SwapType;
  gasLimit?: EthersBigNumber;
  gasPrice?: number;
  ddlSecRel?: number;
};

export type TypedSignStep = {
  opcode: OpCode.TypedSign;
  swapType?: SwapType;
  signer?: string;
  typedData: Record<string, unknown>;
};

export type Step = ApprovalStep | TXStep | TypedSignStep;
export type Steps = Step[];
