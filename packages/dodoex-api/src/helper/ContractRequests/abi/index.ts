import { ABIName } from './abiName';

export async function getABI(abiName: ABIName) {
  switch (abiName) {
    case ABIName.customERC20IsMintable:
      return [
        {
          inputs: [],
          name: 'isMintable',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          stateMutability: 'view',
          type: 'function',
        },
      ];
    case ABIName.customMultiCallAggregate:
      return [
        {
          constant: false,
          inputs: [
            {
              components: [
                { name: 'target', type: 'address' },
                { name: 'callData', type: 'bytes' },
              ],
              name: 'calls',
              type: 'tuple[]',
            },
          ],
          name: 'aggregate',
          outputs: [
            { name: 'blockNumber', type: 'uint256' },
            { name: 'returnData', type: 'bytes[]' },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];

    default:
      return (await import(`./ABIs/${abiName}.ts`)).default;
  }
}
