import type { ContractInterface } from '@ethersproject/contracts';

const abi: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dvmFactory',
        type: 'address',
      },
      {
        internalType: 'address payable',
        name: 'weth',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'dodoApproveProxy',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'dodoSellHelper',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'fromToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'toToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fromAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    name: 'OrderHistory',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferPrepared',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: '_DODO_APPROVE_PROXY_',
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
    name: '_DODO_SELL_HELPER_',
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
    name: '_DVM_FACTORY_',
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
    name: '_NEW_OWNER_',
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
    name: '_OWNER_',
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
    name: '_WETH_',
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
    name: 'claimOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'initOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isWhiteListed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddr',
        type: 'address',
      },
    ],
    name: 'addWhiteList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddr',
        type: 'address',
      },
    ],
    name: 'removeWhiteList',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: 'baseInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteInAmount',
        type: 'uint256',
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
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'createDODOVendingMachine',
    outputs: [
      {
        internalType: 'address',
        name: 'newVendingMachine',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dvmAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'baseInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseMinAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteMinAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'flag',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'addDVMLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseAdjustedInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteAdjustedInAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'toToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'dodoPairs',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'directions',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'dodoSwapV2ETHToToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fromToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fromTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'dodoPairs',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'directions',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'dodoSwapV2TokenToETH',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
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
        name: 'fromToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'toToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fromTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'dodoPairs',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'directions',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'dodoSwapV2TokenToToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
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
        name: 'fromToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'toToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'approveTarget',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'swapTarget',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fromTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'callDataConcat',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'externalSwap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fromToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'toToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'fromTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minReturnAmount',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'dodoPairs',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'directions',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'dodoSwapV1',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
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
        internalType: 'uint256',
        name: 'quoteAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'flag',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'bid',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseMinShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteMinShares',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'flag',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'deadLine',
        type: 'uint256',
      },
    ],
    name: 'addLiquidityToV1',
    outputs: [
      {
        internalType: 'uint256',
        name: 'baseShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'quoteShares',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
];

export default abi;
