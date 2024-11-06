import { ABIName } from './abi/abiName';

export interface Query<T = any> {
  abiName: ABIName;
  contractAddress: string;
  method: string;
  params: readonly any[];
  callback?: (res: T) => T | undefined;
}
