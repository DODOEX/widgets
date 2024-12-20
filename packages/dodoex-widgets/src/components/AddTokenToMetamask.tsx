import { Box, BoxProps } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import { merge } from 'lodash';
import { MouseEventHandler, useState } from 'react';
import { ReactComponent as metamaskLogo } from '../assets/logo/metamask.svg';
import { useSwitchChain } from '../hooks/ConnectWallet/useSwitchChain';
import { registerTokenWithMetamask } from '../hooks/contract/wallet';
import { TokenInfo } from '../hooks/Token';
import { useMessageState } from '../hooks/useMessageState';

export function AddTokenToMetamask({
  token,
  size = 'small',
  sx,
  children,
}: {
  token: TokenInfo;
  size?: 'small' | 'medium';
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
}) {
  const [addLoading, setLoading] = useState(false);
  const { provider, chainId: currentChainId } = useWeb3React();
  const switchChain = useSwitchChain(token.chainId);

  const handleAdd: MouseEventHandler = async (e) => {
    e.stopPropagation();

    if (
      token.chainId !== undefined &&
      token.chainId !== currentChainId &&
      switchChain
    ) {
      const result = await switchChain();
      if (!result) return;
    }

    if (addLoading) return;

    setLoading(true);
    const { result, failMsg } = await registerTokenWithMetamask(
      provider,
      token,
    );
    if (result) {
      useMessageState.getState().toast({
        message: t`Added successful`,
        type: 'success',
        timeout: 3000,
      });
    } else {
      useMessageState.getState().toast({
        message: `${t`Failed to add`}${failMsg ? `: ${failMsg}` : ''}`,
        type: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Box
      sx={merge(
        {
          margin: '0',
          border: 'none',
          padding: '0',
          background: 'none',
          cursor: 'pointer',
          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            outline: 'none',
          },
        },
        sx,
      )}
      onClick={handleAdd}
      component="button"
    >
      <Box
        component={metamaskLogo}
        sx={{
          ...(size === 'medium'
            ? {
                width: 16,
                height: 16,
              }
            : {
                width: 14,
                height: 14,
              }),
        }}
      />
      {children}
    </Box>
  );
}
