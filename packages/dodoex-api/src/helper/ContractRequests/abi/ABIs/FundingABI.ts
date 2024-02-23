import type { ContractInterface } from '@ethersproject/contracts';

const FundingABI: ContractInterface = [
  {
    inputs: [],
    name: 'getBaseFundInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'fundAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'totalTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price1',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'versionType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'bidDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokenVestingStart',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokenVestingDuration',
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
    name: 'getCurrentFundingInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'raiseFundAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'userFundAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'soldTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalClaimAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimableTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimedTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isHaveCap',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'userQuota',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'userCurrentQuota',
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
    name: 'getFairFundInfo',
    outputs: [
      {
        internalType: 'bool',
        name: 'isOverCapStop',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'finalPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'userUnusedFundAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'coolDuration',
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
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawFunds',
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
    name: 'claimToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: '_TOKEN_CLIFF_RATE_',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'settle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default FundingABI;
