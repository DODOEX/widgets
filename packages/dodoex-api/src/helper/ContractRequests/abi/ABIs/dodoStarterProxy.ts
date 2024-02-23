import type { ContractInterface } from '@ethersproject/contracts';

const abi: ContractInterface = [
  {
    inputs: [
      { internalType: 'address payable', name: 'weth', type: 'address' },
      {
        internalType: 'address',
        name: 'dodoApproveProxy',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: '_DODO_APPROVE_PROXY_',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_WETH_',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'uint256', name: 'fundAmount', type: 'uint256' },
      { internalType: 'uint8', name: 'flag', type: 'uint8' },
      { internalType: 'uint256', name: 'deadLine', type: 'uint256' },
    ],
    name: 'bid',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
];

export default abi;
