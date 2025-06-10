import { Box, ButtonBase, RotatingIcon, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import TokenLogo from '../../../../components/TokenLogo';
import { tokenApi } from '../../../../constants/api';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { Actions, StateProps, Types } from '../reducer';
import { ReactComponent as Arrow } from './arrow.svg';
import { SettingItemWrapper } from './widgets';

function TokenPickSelect({
  token,
  oppositeTokenAddress,
  dispatch,
  tokenSelectOnChange,
}: {
  token: TokenInfo | null;
  oppositeTokenAddress: string;
  dispatch: React.Dispatch<Actions>;
  tokenSelectOnChange: (value: TokenInfo) => void;
}) {
  const theme = useTheme();
  const { chainId, account } = useWalletInfo();

  const [tokenPickerVisible, setTokenPickerVisible] = React.useState(false);

  const tokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(chainId, token?.address, account),
  });

  if (!token) return null;

  return (
    <>
      <Box
        component={ButtonBase}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 20,
          py: 8,
          borderRadius: 8,
          backgroundColor: theme.palette.background.cardInput,
          '&:hover': {
            backgroundColor: theme.palette.hover.default,
          },
        }}
        onClick={() => {
          setTokenPickerVisible(true);
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <TokenLogo
            address={token.address}
            marginRight={0}
            width={24}
            height={24}
            chainId={token.chainId || chainId}
            noShowChain
            sx={{
              flexShrink: 0,
            }}
          />
          <Box
            sx={{
              typography: 'h5',
              color: theme.palette.text.primary,
              fontWeight: 600,
              lineHeight: '32px',
              flexShrink: 0,
            }}
          >
            {token.symbol}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'h6',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              wordBreak: 'break-all',
            }}
          >
            (<Trans>Balance</Trans>:&nbsp;
            {!token.address || tokenQuery.isLoading ? (
              <RotatingIcon />
            ) : (
              formatTokenAmountNumber({
                input: tokenQuery.data?.balance,
                decimals: token.decimals,
              })
            )}
            )
          </Box>
        </Box>

        <Box
          component={Arrow}
          sx={{
            flexShrink: 0,
            ml: 'auto',
            width: 18,
            height: 18,
            color: theme.palette.text.secondary,
          }}
        />
      </Box>

      <TokenPickerDialog
        value={token}
        open={tokenPickerVisible}
        chainId={chainId}
        occupiedAddrs={[oppositeTokenAddress]}
        occupiedChainId={token.chainId}
        onClose={() => {
          setTokenPickerVisible(false);
        }}
        onTokenChange={(selectedToken, occupied) => {
          if (Array.isArray(selectedToken)) {
            return;
          }
          if (occupied) {
            dispatch({
              type: Types.SwitchTokens,
            });
            setTokenPickerVisible(false);
            return;
          }
          tokenSelectOnChange(selectedToken);
          setTokenPickerVisible(false);
        }}
        modal
      />
    </>
  );
}

export interface TokenPairSelectProps {
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  dispatch: React.Dispatch<Actions>;
}

export const TokenPairSelect = ({
  baseToken,
  quoteToken,
  dispatch,
}: TokenPairSelectProps) => {
  return (
    <SettingItemWrapper title={<Trans>Select Token Pair</Trans>}>
      <TokenPickSelect
        token={baseToken}
        oppositeTokenAddress={quoteToken?.address ?? ''}
        dispatch={dispatch}
        tokenSelectOnChange={(payload: TokenInfo) => {
          dispatch({
            type: Types.UpdateBaseToken,
            payload,
          });
        }}
      />

      <TokenPickSelect
        token={quoteToken}
        oppositeTokenAddress={baseToken?.address ?? ''}
        dispatch={dispatch}
        tokenSelectOnChange={(payload: TokenInfo) => {
          dispatch({
            type: Types.UpdateQuoteToken,
            payload,
          });
        }}
      />
    </SettingItemWrapper>
  );
};
