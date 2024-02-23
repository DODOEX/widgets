export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lendingPool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_weth',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_DODOApprove',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_template',
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
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'CleanETH',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'CleanToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_marginAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_marginAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_margin',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'DepositMarginTradingERC20',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_marginAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_margin',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'DepositMarginTradingETH',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'modes',
        type: 'uint256[]',
      },
    ],
    name: 'ExecuteMarginTradingFlashLoans',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'marginAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userMarginNum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'MarginTradingCreated',
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'SendMarginTradingERC20',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'SendMarginTradingETH',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'ALLOWED_FLASH_LOAN',
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
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_proxy',
        type: 'address',
      },
    ],
    name: 'addFlashLoanProxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amt',
        type: 'uint256',
      },
    ],
    name: 'cleanETH',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amt',
        type: 'uint256',
      },
    ],
    name: 'cleanToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'depositParams',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'executeParams',
        type: 'bytes',
      },
    ],
    name: 'createMarginTrading',
    outputs: [
      {
        internalType: 'address',
        name: 'marginTrading',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'crossMarginTrading',
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
    inputs: [
      {
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_marginAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_marginAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_margin',
        type: 'bool',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'depositMarginTradingERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_margin',
        type: 'bool',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'depositMarginTradingETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'modes',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'mainToken',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'executeMarginTradingFlashLoans',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_num',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getCreateMarginTradingAddress',
    outputs: [
      {
        internalType: 'address',
        name: '_ad',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getUserMarginTradingNum',
    outputs: [
      {
        internalType: 'uint256',
        name: '_crossNum',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_isolateNum',
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
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_proxy',
        type: 'address',
      },
    ],
    name: 'isAllowedProxy',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isolatedMarginTrading',
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
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
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
    inputs: [
      {
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_proxy',
        type: 'address',
      },
    ],
    name: 'removeFlashLoanProxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'sendMarginTradingERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_marginTradingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'sendMarginTradingETH',
    outputs: [],
    stateMutability: 'payable',
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
    stateMutability: 'payable',
    type: 'receive',
  },
];
