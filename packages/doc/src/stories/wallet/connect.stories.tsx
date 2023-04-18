import { Box, Button, Input } from '@dodoex/components';
import { useEffect, useState } from 'react';
import { WithTheme } from '../../components/theme/WithTheme';
import DODOWallet, {
  standaloneList,
  WalletType,
  walletState,
  approve,
  Wallet,
} from '@dodoex/wallet';
import { useSnapshot } from 'valtio';

const allWalletListObject = {
  [WalletType.injected]: 'Injected',
} as {
  [key in WalletType]: string;
};

standaloneList.forEach((wallet) => {
  allWalletListObject[wallet.type] = wallet.showName;
});

const shortAddress = (address?: string) => {
  return address && address.slice
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
};

export default {
  title: 'Wallet/Connect',
  // https://storybook.js.org/docs/react/essentials/controls#annotation
  argTypes: {
    excludes: {
      options: Object.keys(allWalletListObject),
      control: {
        type: 'multi-select',
        labels: allWalletListObject,
      },
    },
    includes: {
      options: Object.keys(allWalletListObject),
      control: {
        type: 'multi-select',
        labels: allWalletListObject,
      },
    },
    chainId: {
      control: 'number',
    },
    rpcUrl: {
      control: 'text',
      defaultValue: 'https://eth.llamarpc.com',
    },
    appName: {
      control: 'text',
      defaultValue: 'Example',
    },
    appLogoUrl: {
      control: 'text',
    },
    darkMode: {
      control: 'boolean',
    },
    ledgerParams: {
      control: 'object',
    },
    portisParams: {
      control: 'object',
    },
    uAuthParams: {
      control: 'object',
      defaultValue: {
        // https://dashboard.auth.unstoppabledomains.com/
        clientID: 'f1f5919f-9b37-47ed-9651-4b56c8390a24',
        redirectUri: window.location.origin,
      },
    },
    walletConnectParams: {
      control: 'object',
    },
  },
};

async function sign712() {
  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: walletState.chainId,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  };

  // The named list of all type definitions
  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  };

  // The data to sign
  const value = {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  };

  const { provider } = walletState;
  if (!provider) {
    throw new Error('provider is undefined');
  }
  const signer = provider.getSigner();

  const signature = await signer._signTypedData(domain, types, value);
  console.log(signature);
}

export const Primary = (args: any) => {
  const [dodoWallet, setDodoWallet] = useState<DODOWallet | null>(null);
  const [walletList, setWalletList] = useState<Wallet[]>([]);
  const [approveTokenAddress, setApproveTokenAddress] = useState(
    '0xC4106029d03c33731Ca01Ba59b5A6368c660E596',
  );
  const [approveTokenContractAddress, setApproveContractTokenAddress] =
    useState('0xC9143e54021f4a6d33b9b89DBB9F458AaEdd56FB');
  const [approveAmount, setApproveAmount] = useState('100');
  const walletSnap = useSnapshot(walletState);
  useEffect(() => {
    const wallet = new DODOWallet({
      providerConfig: {
        chainId: args.chainId,
        rpcUrl: args.rpcUrl,
        appName: args.appName,
        appLogoUrl: args.appLogoUrl,
        darkMode: args.darkMode,
        ledgerParams: args.ledgerParams,
        portisParams: args.portisParams,
        uAuthParams: args.uAuthParams,
        walletConnectParams: args.walletConnectParams,
      },
      walletListConfig: {
        excludes: args.excludes,
        includes: args.includes,
      },
    });
    setWalletList(wallet.getWalletList(args.chainId ?? 1));
    setDodoWallet(wallet);
  }, [JSON.stringify(args)]);

  const connectInfo = [
    {
      label: 'Account',
      value: shortAddress(walletSnap.account),
    },
    {
      label: 'chainId',
      value: walletSnap.chainId,
    },
  ];

  const walletListLen = walletList.length;
  console.log('jie', walletList);

  return (
    <WithTheme>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box
          sx={{
            p: 40,
            width: 'max-content',
            backgroundColor: 'background.paper',
          }}
        >
          {walletSnap.account &&
            connectInfo.map((item) => (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                }}
                key={item.label}
              >
                <Box>{item.label}:</Box>
                <Box>{item.value}</Box>
              </Box>
            ))}
          <Box
            component="ul"
            sx={{
              display: 'grid',
              gap: walletListLen > 2 ? 8 : 82,
              rowGap: 28,
              p: 0,
              gridTemplateColumns: `repeat(${
                walletListLen > 2 ? 3 : walletListLen
              }, 1fr)`,
            }}
          >
            {walletList.map((wallet) => (
              <Box
                component="li"
                key={wallet.showName}
                sx={{
                  px: 6,
                  py: 4,
                  listStyle: 'none',
                  textAlign: 'center',
                  borderRadius: 4,
                  ...(walletSnap.disabledWalletTypeSet.has(wallet.type)
                    ? {
                        opacity: 0.3,
                      }
                    : {
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'hover.default',
                        },
                      }),
                  ...(walletSnap.walletType === wallet.type
                    ? {
                        backgroundColor: 'background.input',
                      }
                    : {}),
                }}
                onClick={() => {
                  dodoWallet?.clickWallet(wallet);
                }}
              >
                <Box
                  sx={{
                    '& > *': {
                      width: 60,
                      height: 60,
                    },
                  }}
                >
                  {wallet.logo}
                </Box>
                <Box
                  sx={{
                    typography: 'h6',
                  }}
                >
                  {wallet.showName}
                </Box>
              </Box>
            ))}
          </Box>
          {dodoWallet && walletSnap.account ? (
            <Button fullWidth onClick={() => dodoWallet.disconnectWallet()}>
              Disconnect
            </Button>
          ) : (
            ''
          )}
        </Box>
        {walletSnap.account ? (
          <Box
            sx={{
              p: 40,
              ml: 8,
              width: 425,
              backgroundColor: 'background.paper',
            }}
          >
            <Button
              fullWidth
              sx={{
                mt: 6,
              }}
              onClick={sign712}
            >
              Sign 712
            </Button>
            <Input
              fullWidth
              placeholder="Token address"
              value={approveTokenAddress}
              onChange={(evt) => setApproveTokenAddress(evt.target.value)}
              sx={{
                mt: 20,
              }}
            />
            <Input
              fullWidth
              placeholder="Approve contract address"
              value={approveTokenContractAddress}
              onChange={(evt) =>
                setApproveContractTokenAddress(evt.target.value)
              }
              sx={{
                mt: 4,
              }}
            />
            <Input
              fullWidth
              placeholder="Approve amount"
              value={approveAmount}
              onChange={(evt) => setApproveAmount(evt.target.value)}
              sx={{
                mt: 4,
              }}
            />
            <Button
              fullWidth
              sx={{
                mt: 6,
              }}
              onClick={() => {
                if (
                  !approveTokenAddress ||
                  !approveTokenContractAddress ||
                  !approveAmount
                )
                  return;
                approve(
                  approveTokenAddress,
                  approveTokenContractAddress,
                  approveAmount,
                );
              }}
            >
              Approve Token
            </Button>
          </Box>
        ) : (
          ''
        )}
      </Box>
    </WithTheme>
  );
};
