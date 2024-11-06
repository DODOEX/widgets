export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'swapAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'swapApproveToken',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tradAssets',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tradAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'withdrawAssets',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'withdrawAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_rateMode',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_returnAmounts',
        type: 'uint256[]',
      },
    ],
    name: 'ClosePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
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
      {
        indexed: false,
        internalType: 'address',
        name: 'mainToken',
        type: 'address',
      },
    ],
    name: 'FlashLoans',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'LendingPoolDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'rateMode',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'LendingPoolRepay',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'LendingPoolWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'swapAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'swapApproveToken',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tradAssets',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tradAmounts',
        type: 'uint256[]',
      },
    ],
    name: 'OpenPosition',
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
        indexed: true,
        internalType: 'address',
        name: 'ad',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'SendERC20',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'ad',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'SendETH',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'marginAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'marginAmount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'margin',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'WithdrawERC20',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'marginAmount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'margin',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'WithdrawETH',
    type: 'event',
  },
  {
    inputs: [
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
    name: 'executeFlashLoans',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_assets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_premiums',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: '_initiator',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_params',
        type: 'bytes',
      },
    ],
    name: 'executeOperation',
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
    name: 'getContractAddress',
    outputs: [
      {
        internalType: 'address',
        name: '_lendingPoolAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_WETHAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOwner',
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
        name: '_user',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'lendingPoolDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_repayAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_repayAmt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_rateMode',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'lendingPoolRepay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'lendingPoolWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: '_address',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'sendERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'sendETH',
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
    inputs: [],
    name: 'user',
    outputs: [
      {
        internalType: 'address',
        name: '_userAddress',
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
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_margin',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_marginAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_flag',
        type: 'uint8',
      },
    ],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
