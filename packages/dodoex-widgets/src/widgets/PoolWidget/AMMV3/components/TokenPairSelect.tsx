import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useState } from 'react';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import TokenLogo from '../../../../components/TokenLogo';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token';
import { Actions, Types } from '../reducer';
import { ReactComponent as Arrow } from './arrow.svg';

function TokenPickSelect({
  token,
  oppositeTokenAddress,
  dispatch,
  tokenSelectOnChange,
}: {
  token: Maybe<TokenInfo>;
  oppositeTokenAddress: string;
  dispatch: React.Dispatch<Actions>;
  tokenSelectOnChange: (value: TokenInfo) => void;
}) {
  const theme = useTheme();
  const { chainId } = useWalletInfo();

  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);

  return (
    <>
      <Box
        component={ButtonBase}
        sx={{
          flexBasis: '100%',
          flexGrow: 1,
          flexShrink: 1,
          display: 'flex',
          alignItems: 'center',
          px: 20,
          py: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: token
            ? theme.palette.border.main
            : theme.palette.primary.main,
          color: token
            ? theme.palette.text.primary
            : theme.palette.primary.contrastText,
          backgroundColor: token ? 'transparent' : theme.palette.primary.main,
          '&:hover': {
            borderColor: token
              ? theme.palette.border.main
              : theme.palette.primary.main,
          },
          [theme.breakpoints.up('tablet')]: {
            flexBasis: '50%',
          },
        }}
        onClick={() => {
          setTokenPickerVisible(true);
        }}
      >
        {token ? (
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
                fontWeight: 600,
                lineHeight: '32px',
                flexShrink: 0,
              }}
            >
              {token.symbol}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              typography: 'h5',
              fontWeight: 600,
              lineHeight: '32px',
              flexShrink: 0,
            }}
          >
            {t`Select token`}
          </Box>
        )}

        <Box
          component={Arrow}
          sx={{
            flexShrink: 0,
            ml: 'auto',
            width: 18,
            height: 18,
          }}
        />
      </Box>

      <TokenPickerDialog
        value={token}
        open={tokenPickerVisible}
        chainId={chainId}
        occupiedAddrs={[oppositeTokenAddress]}
        occupiedChainId={token?.chainId}
        onClose={() => {
          setTokenPickerVisible(false);
        }}
        onTokenChange={(selectedToken, occupied) => {
          if (Array.isArray(selectedToken)) {
            return;
          }
          if (occupied) {
            dispatch({
              type: Types.UpdateMint1AndClearMint2,
              payload: selectedToken,
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
  mint1: Maybe<TokenInfo>;
  mint2: Maybe<TokenInfo>;
  dispatch: React.Dispatch<Actions>;
}

export const TokenPairSelect = ({
  mint1,
  mint2,
  dispatch,
}: TokenPairSelectProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        [theme.breakpoints.up('tablet')]: {
          flexWrap: 'nowrap',
        },
      }}
    >
      <TokenPickSelect
        token={mint1}
        oppositeTokenAddress={mint2?.address ?? ''}
        dispatch={dispatch}
        tokenSelectOnChange={(payload: TokenInfo) => {
          dispatch({
            type: Types.UpdateMint1,
            payload,
          });
        }}
      />
      <TokenPickSelect
        token={mint2}
        oppositeTokenAddress={mint1?.address ?? ''}
        dispatch={dispatch}
        tokenSelectOnChange={(payload: TokenInfo) => {
          dispatch({
            type: Types.UpdateMint2,
            payload,
          });
        }}
      />
    </Box>
  );
};
