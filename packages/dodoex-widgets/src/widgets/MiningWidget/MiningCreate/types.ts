import BigNumber from 'bignumber.js';
import { ApprovalState } from '../../../hooks/Token/type';
import { TokenType } from './hooks/reducers';

export interface CreateMiningTypeI {
  type: TokenType;
  title: string;
  description: string;
}

export interface RewardStatus {
  pendingReset?: boolean;
  state?: ApprovalState;
  balance: BigNumber | null;
}

export type SectionStatusT = 'waiting' | 'running' | 'completed';
