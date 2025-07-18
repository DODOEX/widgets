import { ChainId } from '@dodoex/api';
import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useState } from 'react';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenInfo } from '../../../../hooks/Token';
import { Actions, StateProps, Types } from '../reducer';
import { Currency } from '../sdks/sdk-core/entities/currency';
import { convertBackToTokenInfo } from '../utils';
import { ReactComponent as Arrow } from './arrow.svg';

function TokenPickSelect({
  chainId,
  token,
  oppositeTokenAddress,
  dispatch,
  tokenSelectOnChange,
}: {
  chainId: ChainId;
  token: Maybe<Currency>;
  oppositeTokenAddress: string;
  dispatch: React.Dispatch<Actions>;
  tokenSelectOnChange: (value: TokenInfo) => void;
}) {
  const theme = useTheme();

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
            opacity: 0.8,
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
        value={convertBackToTokenInfo(token)}
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
              type: Types.UpdateBaseTokenAndClearQuoteToken,
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
  chainId: ChainId;
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  dispatch: React.Dispatch<Actions>;
}

export const TokenPairSelect = ({
  chainId,
  baseToken,
  quoteToken,
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
        chainId={chainId}
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
        chainId={chainId}
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
    </Box>
  );
};
