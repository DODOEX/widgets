import { ChainId } from '@dodoex/api';
import { AMMV3PositionsView, Widget } from '@dodoex/widgets';
import { NATIVE_MINT } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export default {
  title: 'Widgets/AMMV3PositionsView',
  component: 'div',
};

export const Primary = (props: any) => {
  const { apiKey, ...other } = props;

  return (
    <Widget {...other} apikey={apiKey}>
      <AMMV3PositionsView
        mint1Address="4wnJ7T4w92YM3Taet7DtTUMquDv8HDkktQbpbAH5itHz"
        mint2Address="36LzY5yGXRvySE7safeHuLejhsg8mPjmPiitAQr3Axva"
        feeAmount={1000}
        poolId="GNHrfEqtYW11gNntydFBm7UEzcYGvG7Rf9ZEo5Q8b9FH"
        onClose={() => window.alert('onClose')}
        handleGoToAddLiquidityV3={() =>
          window.alert('handleGoToAddLiquidityV3')
        }
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
