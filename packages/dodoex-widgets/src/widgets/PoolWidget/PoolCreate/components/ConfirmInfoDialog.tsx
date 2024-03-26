import { Button, Box } from '@dodoex/components';
import { t } from '@lingui/macro';
import Dialog from '../../../../components/Dialog';
import TokenLogo from '../../../../components/TokenLogo';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useCreatePmm } from '../hooks/useCreatePmm';
import { useVersionList } from '../hooks/useVersionList';
import { StateProps } from '../reducer';
import { computeInitPriceText } from '../utils';

function Item({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode | string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 16,
      }}
    >
      <Box
        sx={{
          color: 'text.secondary',
          mr: 8,
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          textAlign: 'right',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export default function ConfirmInfoDialog({
  on,
  onClose,
  state,
  onConfirm,
  isModify,
}: {
  on: boolean;
  onClose: () => void;
  state: StateProps;
  onConfirm: () => void;
  isModify?: boolean;
}) {
  const { chainId } = useWalletInfo();
  const { versionMap } = useVersionList();

  const { title, initPriceLabel } = versionMap[state.selectedVersion];
  const { midPrice } = useCreatePmm({
    selectedVersion: state.selectedVersion,
    baseAmount: state.baseAmount,
    quoteAmount: state.quoteAmount,
    initPrice: state.initPrice,
    slippageCoefficient: state.slippageCoefficient,
  });
  return (
    <Dialog
      open={on}
      onClose={onClose}
      title={isModify ? t`Modify Confirmation` : t`Pool Creation Confirmation`}
    >
      <Box
        sx={{
          pt: 40,
          pb: 22,
        }}
      >
        <Item label={t`Version`} value={title} />
        <Item
          label={t`Initial Tokens`}
          value={
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <TokenLogo
                  address={state.baseToken?.address}
                  chainId={chainId}
                  marginRight={8}
                  width={18}
                  height={18}
                />
                {state.baseAmount || '-'}&nbsp;
                {state.baseToken?.symbol}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  mt: 4,
                }}
              >
                <TokenLogo
                  address={state.quoteToken?.address}
                  chainId={chainId}
                  marginRight={8}
                  width={18}
                  height={18}
                />
                {state.quoteAmount || '-'}&nbsp;
                {state.quoteToken?.symbol}
              </Box>
            </>
          }
        />
        <Item label={t`Fee Rate`} value={`${state.feeRate}%`} />
        <Item
          label={initPriceLabel}
          value={
            state.baseToken && state.quoteToken
              ? `1 ${state.baseToken.symbol} = ${computeInitPriceText({
                  midPrice,
                  quoteToken: state.quoteToken,
                  selectedVersion: state.selectedVersion,
                  initPrice: state.initPrice,
                })} ${state.quoteToken.symbol}`
              : ''
          }
        />
        <Item
          label={t`Slippage Coefficient`}
          value={state.slippageCoefficient}
        />
        <Button
          fullWidth
          sx={{
            mt: 30,
          }}
          onClick={onConfirm}
        >
          {isModify ? t`Confirm` : t`Create`}
        </Button>
      </Box>
    </Dialog>
  );
}
