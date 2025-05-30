import type { ContractInterface } from '@ethersproject/contracts';

const abi: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'sellBase',
    outputs: [
      {
        internalType: 'uint256',
        name: 'receiveQuoteAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'sellQuote',
    outputs: [
      {
        internalType: 'uint256',
        name: 'receiveBaseAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVaultReserve',
    outputs: [
      {
        internalType: 'uint256',
        name: 'baseReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteReserve',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_BASE_TOKEN_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_QUOTE_TOKEN_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPMMStateForCall',
    outputs: [
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'K',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'B',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'Q',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'B0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'Q0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'R',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserFeeRate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lpFeeRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'mtFeeRate',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
    ],
    name: 'getDODOPoolBidirection',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'baseToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'quoteToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lpFeeRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'k',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isOpenTWAP',
        type: 'bool',
      },
    ],
    name: 'createDODOVendingMachine',
    outputs: [
      {
        internalType: 'address',
        name: 'newVendingMachine',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'buyShares',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'createDODOPrivatePool',
    outputs: [
      {
        internalType: 'address',
        name: 'newPrivatePool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dppAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'baseToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'quoteToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lpFeeRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'k',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isOpenTwap',
        type: 'bool',
      },
    ],
    name: 'initDODOPrivatePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'newLpFeeRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'newI',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'newK',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseOutAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteOutAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minBaseReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minQuoteReserve',
        type: 'uint256',
      },
    ],
    name: 'reset',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: '_OWNER_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'createCrowdPooling',
    outputs: [
      {
        internalType: 'address payable',
        name: 'newCrowdPooling',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'cpAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'baseToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'quoteToken',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'timeLine',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'valueList',
        type: 'uint256[]',
      },
      {
        internalType: 'bool',
        name: 'isOpenTWAP',
        type: 'bool',
      },
    ],
    name: 'initCrowdPooling',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'bid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default abi;
