import { Interface } from '@ethersproject/abi';
import type { BytesLike } from '@ethersproject/bytes';
import { getABI } from './abi';
import { ABIName } from './abi/abiName';

export const encodeFunctionData = async (
  abiName: ABIName,
  functionFragment: string,
  values: ReadonlyArray<any>,
): Promise<string> => {
  const fragments = await getABI(abiName);
  const face = new Interface(fragments);
  return face.encodeFunctionData(functionFragment, values);
};

export const decodeFunctionResult = async (
  abiName: ABIName,
  functionFragment: string,
  data: BytesLike,
) => {
  const fragments = await getABI(abiName);
  const decodeIface = new Interface(fragments);
  return decodeIface.decodeFunctionResult(functionFragment, data);
};
