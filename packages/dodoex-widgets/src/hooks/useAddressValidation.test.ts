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
        isSUIChain: false,
        isTONChain: false,
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
        isSUIChain: false,
        isTONChain: false,
        isTestNet: true,
      },
    ],
    [
      ChainId.SUI,
      {
        chainId: ChainId.SUI,
        isEVMChain: false,
        isSolanaChain: false,
        isBTCChain: false,
        isSUIChain: true,
        isTONChain: false,
        isTestNet: false,
      },
    ],
    [
      ChainId.SUI_TESTNET,
      {
        chainId: ChainId.SUI_TESTNET,
        isEVMChain: false,
        isSolanaChain: false,
        isBTCChain: false,
        isSUIChain: true,
        isTONChain: false,
        isTestNet: true,
      },
    ],
    [
      ChainId.TON,
      {
        chainId: ChainId.TON,
        isEVMChain: false,
        isSolanaChain: false,
        isBTCChain: false,
        isSUIChain: false,
        isTONChain: true,
        isTestNet: false,
      },
    ],
    [
      ChainId.TON_TESTNET,
      {
        chainId: ChainId.TON_TESTNET,
        isEVMChain: false,
        isSolanaChain: false,
        isBTCChain: false,
        isSUIChain: false,
        isTONChain: true,
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

  describe('SUI address validation', () => {
    it('should validate mainnet SUI addresses correctly', () => {
      const mainnetAddress =
        '0xf5361d9079c5769b7b0c83841357f8f5b96d48b0477e1721e81c875ac7277e73';
      const result = useAddressValidation(mainnetAddress, ChainId.SUI);
      expect(result).toBe(true);
    });

    it('should validate testnet SUI addresses correctly', () => {
      const testnetAddress =
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const result = useAddressValidation(testnetAddress, ChainId.SUI_TESTNET);
      expect(result).toBe(true);
    });

    it('should reject invalid SUI addresses', () => {
      const invalidAddresses = [
        '0x123', // too short
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // too long
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefg', // invalid hex character
        '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // missing 0x prefix
        '0X1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // uppercase X
      ];

      invalidAddresses.forEach((address) => {
        const result = useAddressValidation(address, ChainId.SUI);
        expect(result).toBe(false);
      });
    });
  });

  describe('TON address validation', () => {
    it('should validate mainnet TON addresses correctly', () => {
      const mainnetAddress = '0QArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcRd';
      const result = useAddressValidation(mainnetAddress, ChainId.TON);
      expect(result).toBe(true);
    });

    it('should validate testnet TON addresses correctly', () => {
      const testnetAddress = 'kQArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcRd';
      const result = useAddressValidation(testnetAddress, ChainId.TON_TESTNET);
      expect(result).toBe(true);
    });

    it('should reject invalid TON addresses', () => {
      const invalidAddresses = [
        '0QArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcRd!', // invalid character
        '0QArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcR', // too short
        '0QArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcRdd', // too long
        '', // empty
      ];

      invalidAddresses.forEach((address) => {
        const result = useAddressValidation(address, ChainId.TON);
        expect(result).toBe(false);
      });
    });
  });
});
