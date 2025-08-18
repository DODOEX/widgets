import { ChainId } from '@dodoex/api';
import { useAddressValidation } from './useAddressValidation';

// Mock the chainListMap
jest.mock('../constants/chainList', () => ({
  chainListMap: new Map([
    [
      ChainId.BTC,
      {
        chainId: ChainId.BTC,
        isEVMChain: false,
        isSolanaChain: false,
        isBTCChain: true,
        isTestNet: false,
      },
    ],
    [
      ChainId.BTC_SIGNET,
      {
        chainId: ChainId.BTC_SIGNET,
        isEVMChain: false,
        isSolanaChain: false,
        isBTCChain: true,
        isTestNet: true,
      },
    ],
  ]),
}));

describe('useAddressValidation', () => {
  it('should validate mainnet Bitcoin addresses correctly', () => {
    const mainnetAddress = 'bc1qp3gvgma5jy3xyc70d7r0sm92g4vt08tlj64nvk';
    const result = useAddressValidation(mainnetAddress, ChainId.BTC);
    expect(result).toBe(true);
  });

  it('should validate signet Bitcoin addresses correctly', () => {
    const signetAddress = 'tb1qcrd8yvatjzpxl0ew29jsps2z595jpwtm5mj38v';
    const result = useAddressValidation(signetAddress, ChainId.BTC_SIGNET);
    expect(result).toBe(true);
  });

  it('should reject invalid Bitcoin addresses', () => {
    const invalidAddress = 'invalid-address';
    const result = useAddressValidation(invalidAddress, ChainId.BTC);
    expect(result).toBe(false);
  });

  it('should handle empty addresses', () => {
    const result = useAddressValidation('', ChainId.BTC);
    expect(result).toBe(false);
  });
});
