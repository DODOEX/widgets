import type { ContractInterface } from '@ethersproject/contracts';

const abi: ContractInterface = [
  {
    inputs: [
      { internalType: 'address payable', name: 'weth', type: 'address' },
      { internalType: 'address', name: 'settlexApproveProxy', type: 'address' },
      { internalType: 'address', name: 'dppFactory', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: '_DPP_FACTORY_',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_SETTLEX_APPROVE_PROXY_',
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
      { internalType: 'address', name: 'baseToken', type: 'address' },
      { internalType: 'address', name: 'quoteToken', type: 'address' },
      { internalType: 'uint256', name: 'baseInAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'quoteInAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'lpFeeRate', type: 'uint256' },
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'uint256', name: 'k', type: 'uint256' },
      { internalType: 'bool', name: 'isOpenTwap', type: 'bool' },
      { internalType: 'uint256', name: 'deadLine', type: 'uint256' },
    ],
    name: 'createSETTLEXPrivatePool',
    outputs: [
      { internalType: 'address', name: 'newPrivatePool', type: 'address' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'dppAddress', type: 'address' },
      { internalType: 'uint256[]', name: 'paramList', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amountList', type: 'uint256[]' },
      { internalType: 'uint8', name: 'flag', type: 'uint8' },
      { internalType: 'uint256', name: 'minBaseReserve', type: 'uint256' },
      { internalType: 'uint256', name: 'minQuoteReserve', type: 'uint256' },
      { internalType: 'uint256', name: 'deadLine', type: 'uint256' },
    ],
    name: 'resetSETTLEXPrivatePool',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];

export default abi;
