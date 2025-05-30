export default [
  {
    inputs: [
      { internalType: 'address', name: '_dodoMine', type: 'address' },
      { internalType: 'address', name: '_dodo', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getUserStakedBalance',
    outputs: [
      { internalType: 'uint256', name: 'baseBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'quoteBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_dodoMine', type: 'address' },
      { internalType: 'address', name: '_dodo', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getUserTotalBalance',
    outputs: [
      { internalType: 'uint256', name: 'baseBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'quoteBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
