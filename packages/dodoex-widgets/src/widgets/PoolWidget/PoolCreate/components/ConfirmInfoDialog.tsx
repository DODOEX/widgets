import { Button, Box } from '@dodoex/components';
import { t } from '@lingui/macro';
import TokenLogo from '../../../../components/TokenLogo';
import WidgetDialog from '../../../../components/WidgetDialog';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useCreatePmm } from '../hooks/useCreatePmm';
import {
  getSubPeggedVersionMap,
  useVersionList,
} from '../hooks/useVersionList';
import { StateProps } from '../reducer';
import { Version } from '../types';
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
  loading,
}: {
  on: boolean;
  onClose: () => void;
  state: StateProps;
  onConfirm: () => void;
  isModify?: boolean;
  loading?: boolean;
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

  const subPeggedVersionMap = getSubPeggedVersionMap();
  const isPeggedVersion = state.selectedVersion === Version.pegged;

  return (
    <WidgetDialog
      open={on}
      onClose={onClose}
      title={isModify ? t`Modify Confirmation` : t`Pool Creation Confirmation`}
    >
      <Box
        sx={{
          flex: 1,
          px: 20,
          pb: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            pt: 40,
            px: 8,
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
          <Item
            label={t`Slippage Coefficient`}
            value={state.slippageCoefficient}
          />
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
          {isPeggedVersion && (
            <Item
              label={t`Pricing Model`}
              value={
                state.selectedSubPeggedVersion
                  ? subPeggedVersionMap[state.selectedSubPeggedVersion]?.title
                  : '-'
              }
            />
          )}
          <Item label={t`Fee Rate`} value={`${state.feeRate}%`} />
          {isPeggedVersion && (
            <Item
              label={t`Initial asset ratio`}
              value={
                <>
                  {state.peggedBaseTokenRatio}%&nbsp;{state.baseToken?.symbol}
                  &nbsp;:&nbsp;{state.peggedQuoteTokenRatio}%&nbsp;
                  {state.quoteToken?.symbol}
                </>
              }
            />
          )}
        </Box>
        <Button
          fullWidth
          isLoading={loading}
          sx={{
            mt: 30,
          }}
          onClick={onConfirm}
        >
          {isModify ? t`Confirm` : t`Create`}
        </Button>
      </Box>
    </WidgetDialog>
  );
}
