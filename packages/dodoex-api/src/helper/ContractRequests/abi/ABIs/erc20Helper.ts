import type { ContractInterface } from '@ethersproject/contracts';

const abi: ContractInterface = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'isERC20',
    outputs: [
      { internalType: 'bool', name: 'isOk', type: 'bool' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'decimals', type: 'uint256' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'allownance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'judgeERC20',
    outputs: [
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'decimals', type: 'uint256' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'allownance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default abi;
