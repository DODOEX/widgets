export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getCPInfoByUser',
    outputs: [
      {
        internalType: 'bool',
        name: 'isHaveCap',
        type: 'bool',
      },
      {
        internalType: 'int256',
        name: 'curQuota',
        type: 'int256',
      },
      {
        internalType: 'uint256',
        name: 'userFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
