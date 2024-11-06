import type { ContractInterface } from '@ethersproject/contracts';

const spec: ContractInterface = [
  {
    inputs: [
      { internalType: 'address', name: 'dodoZoo', type: 'address' },
      { internalType: 'address payable', name: 'weth', type: 'address' },
    ],
    stateMutability: 'nonpayable' as const,
    type: 'constructor' as const,
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'quoteToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'receiveEth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payQuote',
        type: 'uint256',
      },
    ],
    name: 'ProxyBuyEth',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'lp', type: 'address' },
      { indexed: true, internalType: 'address', name: 'DODO', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ethAmount',
        type: 'uint256',
      },
    ],
    name: 'ProxyDepositEth',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'quoteToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payEth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'receiveQuote',
        type: 'uint256',
      },
    ],
    name: 'ProxySellEth',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'lp', type: 'address' },
      { indexed: true, internalType: 'address', name: 'DODO', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ethAmount',
        type: 'uint256',
      },
    ],
    name: 'ProxyWithdrawEth',
    type: 'event',
  },
  {
    stateMutability: 'payable' as const,
    type: 'fallback' as const,
  },
  {
    inputs: [],
    name: '_DODO_ZOO_',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view' as const,
    type: 'function' as const,
  },
  {
    inputs: [],
    name: '_WETH_',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view' as const,
    type: 'function' as const,
  },
  {
    inputs: [
      { internalType: 'address', name: 'quoteTokenAddress', type: 'address' },
      { internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'maxPayTokenAmount', type: 'uint256' },
    ],
    name: 'buyEthWith',
    outputs: [
      { internalType: 'uint256', name: 'payTokenAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable' as const,
    type: 'function' as const,
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      { internalType: 'address', name: 'quoteTokenAddress', type: 'address' },
    ],
    name: 'depositEth',
    outputs: [],
    stateMutability: 'payable' as const,
    type: 'function' as const,
  },
  {
    inputs: [
      { internalType: 'address', name: 'quoteTokenAddress', type: 'address' },
      { internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'minReceiveTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'sellEthTo',
    outputs: [
      { internalType: 'uint256', name: 'receiveTokenAmount', type: 'uint256' },
    ],
    stateMutability: 'payable' as const,
    type: 'function' as const,
  },
  {
    inputs: [
      { internalType: 'address', name: 'quoteTokenAddress', type: 'address' },
    ],
    name: 'withdrawAllEth',
    outputs: [
      { internalType: 'uint256', name: 'withdrawAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable' as const,
    type: 'function' as const,
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      { internalType: 'address', name: 'quoteTokenAddress', type: 'address' },
    ],
    name: 'withdrawEth',
    outputs: [
      { internalType: 'uint256', name: 'withdrawAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable' as const,
    type: 'function' as const,
  },
  /*

  FIXME(meow): typing error, suppressed temporarily.

  {
    stateMutability: 'payable' as const,
    type: 'receive' as const,
  }
  */
];

export default spec;
