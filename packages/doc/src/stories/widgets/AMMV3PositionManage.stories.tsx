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
        chainId={11155111}
        baseToken={{
          address: '0x163D876AF3949f45D934870a1783A040Cf717Bc5',
          decimals: 18,
          symbol: 'uni_test2',
          name: 'uni_test2',
          chainId: 11155111,
        }}
        quoteToken={{
          address: '0x444d30Eeb001Dc8B7B96cEF088381418B82f9441',
          decimals: 6,
          symbol: 'uni_test3',
          name: 'uni_test3',
          chainId: 11155111,
        }}
        // feeAmount={500}
        // tokenId={'25235'}
        feeAmount={500}
        tokenId={'4'}
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
