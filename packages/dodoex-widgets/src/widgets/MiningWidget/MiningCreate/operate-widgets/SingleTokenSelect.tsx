import { basicTokenMap } from '@dodoex/api';
import { alpha, Box, Input, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useMemo, useState } from 'react';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import TokenLogo from '../../../../components/TokenLogo';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { truncatePoolAddress } from '../../../../utils';
import { Actions, StateProps, Types } from '../hooks/reducers';
import { useTokenPairStatus } from '../hooks/useTokenPairStatus';

export function SingleTokenSelect({
  state,
  dispatch,
}: {
  state: StateProps;
  dispatch: React.Dispatch<Actions>;
}) {
  const theme = useTheme();

  const { account, chainId } = useWalletInfo();

  const [showPicker, setShowPicker] = useState<undefined | 'base' | 'quote'>();

  const {
    token: pickerToken,
    onTokenChange,
    occupiedAddrs,
  } = useTokenPairStatus({
    side: showPicker,
    baseToken: state.saveAToken,
    onChangeBaseToken: (token) => {
      dispatch({
        type: Types.updateSaveAToken,
        payload: token,
      });
    },
  });

  const EtherToken = useMemo(() => basicTokenMap[chainId], [chainId]);
  return (
    <>
      <Box
        sx={{
          px: 20,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 12,
          }}
        >
          {t`Select Token`}
        </Box>
        <Input
          height={48}
          fullWidth
          readOnly
          value={state.saveAToken ? ' ' : ''}
          onClick={() => {
            setShowPicker('base');
          }}
          placeholder={t`SELECT`}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              '.input-right-icon': {
                borderTopColor: alpha(theme.palette.text.primary, 0.5),
              },
            },
          }}
          inputSx={{
            cursor: 'pointer',
          }}
          prefix={
            state.saveAToken ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  typography: 'body2',
                }}
              >
                <TokenLogo
                  address={state.saveAToken.address}
                  width={24}
                  height={24}
                  chainId={state.saveAToken.chainId}
                  url={state.saveAToken.logoURI}
                  noShowChain
                  marginRight={6}
                />
                {state.saveAToken.symbol}
                <Box
                  sx={{
                    ml: 4,
                    color: 'text.secondary',
                    typography: 'h6',
                  }}
                >
                  (
                  {`${t`address`}: ${truncatePoolAddress(
                    state.saveAToken.address,
                  )}`}
                  )
                </Box>
              </Box>
            ) : (
              ''
            )
          }
          suffix={
            <Box
              className="input-right-icon"
              sx={{
                display: 'inline-block',
                borderStyle: 'solid',
                borderWidth: '6px 4px 0 4px',
                borderColor: 'transparent',
                borderTopColor: 'text.primary',
              }}
            />
          }
        />
        <Box
          sx={{
            typography: 'h6',
            mt: 8,
            color: 'text.secondary',
          }}
        >
          *{' '}
          {t`Do not select non-standard ERC20 tokens as this may lead to unknown errors！`}
        </Box>
      </Box>

      <TokenPickerDialog
        value={pickerToken}
        open={!!showPicker}
        chainId={chainId}
        occupiedAddrs={occupiedAddrs}
        hiddenAddrs={[EtherToken.address]}
        occupiedChainId={pickerToken?.chainId}
        onClose={() => {
          setShowPicker(undefined);
        }}
        onTokenChange={(selectedToken, occupied) => {
          if (Array.isArray(selectedToken)) {
            return;
          }
          onTokenChange(selectedToken, occupied);
          setShowPicker(undefined);
        }}
        modal
      />
    </>
  );
}
