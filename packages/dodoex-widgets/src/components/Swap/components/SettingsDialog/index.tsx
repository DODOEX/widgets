import { Trans } from '@lingui/macro';
import { useMemo } from 'react';
import Dialog from '../Dialog';
import { QuestionTooltip } from '../../../Tooltip';
import { Box, useTheme } from '@dodoex/components';
import { NumberInput } from './NumberInput';
import { MAX_SWAP_SLIPPAGE } from '../../../../constants/swap';
import { setLastSlippage } from '../../../../constants/localstorage';
import { useDefaultSlippage } from '../../../../hooks/setting/useDefaultSlippage';
import { setSlippage, useGlobalState } from '../../../../hooks/useGlobalState';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  isBridge: boolean | undefined;
  isDialogModal: boolean;
}
export function SettingsDialog({
  open,
  onClose,
  isBridge,
  isDialogModal,
}: SettingsDialogProps) {
  const theme = useTheme();
  const { slippage } = useGlobalState();
  const isSlippageGTMax = useMemo(
    () => Number(slippage) >= MAX_SWAP_SLIPPAGE,
    [slippage],
  );
  const { defaultSlippage } = useDefaultSlippage(isBridge);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      id="swap-settings"
      title={<Trans>Cross chain setting</Trans>}
      modal={isDialogModal}
    >
      <Box
        sx={{
          mx: 20,
        }}
      >
        <Box
          sx={{ py: 20, borderTop: `1px solid ${theme.palette.border.main}` }}
        >
          <Box sx={{ mb: 16, display: 'flex', alignItems: 'center' }}>
            <Trans>Slippage Tolerance</Trans>
            <QuestionTooltip
              title={
                <Trans>
                  Attention: High slippage tolerance will increase the success
                  rate of transaction, but might not get the best quote.
                </Trans>
              }
              ml={7}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <NumberInput
              fullWidth
              maxVal={100}
              value={slippage ?? ''}
              placeholder={defaultSlippage.toString()}
              onInputChange={(v: string | null) => {
                setLastSlippage(!!isBridge, v);
                setSlippage(v);
              }}
              suffix={<Box sx={{ color: 'text.disabled' }}>%</Box>}
              height={36}
              sx={{
                mt: 12,
              }}
            />
            {isSlippageGTMax && (
              <Box
                sx={{
                  typography: 'h6',
                  mt: 6,
                  color: 'error.main',
                }}
              >
                <Trans>Maximum slippage do not exceed 50%</Trans>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
