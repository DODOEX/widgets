import type { ContractInterface } from '@ethersproject/contracts';

const abi: ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dodoApproveProxy',
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
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'mysteryBox',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ticketAmount',
        type: 'uint256',
      },
    ],
    name: 'BuyTicket',
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
    inputs: [
      {
        internalType: 'address payable',
        name: 'dodoDrops',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'ticketAmount',
        type: 'uint256',
      },
    ],
    name: 'buyTickets',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export default abi;
