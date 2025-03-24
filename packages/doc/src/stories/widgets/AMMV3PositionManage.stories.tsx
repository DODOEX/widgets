import { ChainId } from '@dodoex/api';
import { AMMV3PositionManage, Widget } from '@dodoex/widgets';
import { NATIVE_MINT } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export default {
  title: 'Widgets/AMMV3PositionManage',
  component: 'div',
};

export const Primary = (props: any) => {
  const { apiKey, ...other } = props;

  return (
    <Widget {...other} apikey={apiKey}>
      <AMMV3PositionManage
        // mint1Address="4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz"
        // mint2Address="36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva"
        // feeAmount={1000}
        // poolId="GNHrfEqtYW11gNntydFBm7UEzcYGvG7Rf9ZEo5Q8b9FH"
        // nftMint="58qBN1NptvUR6PG78KjxFqSyPCYdGpqBLkq6EJsPSA2C"
        mint1Address="4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz"
        mint2Address="5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ"
        feeAmount={1000}
        poolId="6tvyKAe7gF2Qtm2ur94nZa7QsYSATFyZSdm7Be53Fbf1"
        nftMint="5GYbLuwfpeees1aguGk1ggMLKk8NUPUJeAQ9SHGXipWg"
        onClose={() => window.alert('onClose')}
      />
    </Widget>
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  apiDomain: process.env.STORYBOOK_API_DOMAIN,
  colorMode: 'dark',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  // onlyChainId: 1,
  tokenList: [
    {
      decimals: 9,
      name: 'SOL',
      address: PublicKey.default.toBase58(),
      symbol: 'SOL',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'Wrapped SOL',
      address: NATIVE_MINT.toBase58(),
      symbol: 'WSOL',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'SOON Training Token',
      address: '4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz',
      symbol: 'TRAINING',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'SOON Training1 Token',
      address: '5FLzARYothWbBDeiJAqwzusz4hM2ah4QrGxXW6X4RRWZ',
      symbol: 'TRAINING1',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: '36LzY',
      address: '36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva',
      symbol: '36LzY',
      chainId: ChainId.SOON_TESTNET,
    },
    {
      decimals: 9,
      name: 'GLfqS',
      address: 'GLfqSuSUUB6mTA4rfk5BHYbRjQHxYknJu8pSHcMnYgzE',
      symbol: 'GLfqS',
      chainId: ChainId.SOON_TESTNET,
    },
  ],
};
