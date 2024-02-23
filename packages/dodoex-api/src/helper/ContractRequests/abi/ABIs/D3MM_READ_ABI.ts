const D3MM_READ_ABI = [
  /** -----ERC20Mock----- */
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  /** -----D3Oracle-----  */
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'isFeasible',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  /**
   * -----D3PoolQuota-----
   */
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getPoolQuota',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  /**
   * -----D3Vault-----
   */
  {
    inputs: [],
    name: 'getTokenList',
    outputs: [
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
    inputs: [],
    name: '_ORACLE_',
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
    name: '_POOL_QUOTA_',
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
    name: 'getIMMM',
    outputs: [
      {
        internalType: 'uint256',
        name: 'IM',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'MM',
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
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getPoolBorrowAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'assetInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'dToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalBorrows',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'accrualTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalReserves',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'withdrawnReserves',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveFactor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxDepositAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxCollateralAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collateralWeight',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'debtWeight',
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
        name: 'pool',
        type: 'address',
      },
    ],
    name: 'getCollateralRatio',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getPoolLeftQuota',
    outputs: [
      {
        internalType: 'uint256',
        name: 'leftQuota',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'tokens',
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
    ],
    name: 'allPoolAddrMap',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'accrueInterestForRead',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalBorrowsNew',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalReservesNew',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowIndexNew',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'accrualTime',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  /** -----D3MM----- */
  {
    inputs: [],
    name: 'getD3MMInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'feeRateModel',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'maintainer',
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
    name: 'isInLiquidation',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getTokenReserve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPoolTokenlist',
    outputs: [
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getFeeRate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDepositedTokenList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  /** -----D3Maker----- */
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getTokenMMInfoForPool',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'askDownPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'askUpPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bidDownPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bidUpPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'askAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'bidAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'kAsk',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'kBid',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cumulativeAsk',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cumulativeBid',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'swapFeeRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'mtFeeRate',
            type: 'uint256',
          },
        ],
        internalType: 'struct Types.TokenMMInfo',
        name: 'tokenMMInfo',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'tokenIndex',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getOneTokenPriceSet',
    outputs: [
      {
        internalType: 'uint80',
        name: 'priceSet',
        type: 'uint80',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNSTokenInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'tokenPrices',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'curFlag',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStableTokenInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'numberOfStable',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'tokenPriceStable',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'curFlag',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default D3MM_READ_ABI;
