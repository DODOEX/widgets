import { ChainId } from '@dodoex/api';
import { Box, Button } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { Currency, CurrencyAmount } from '../sdks/sdk-core';
import { Field } from '../types';
import { AutoColumn } from './widgets';

export interface ButtonsProps {
  chainId: ChainId;
  approvalA: ReturnType<typeof useTokenStatus>;
  approvalB: ReturnType<typeof useTokenStatus>;
  parsedAmounts: {
    CURRENCY_A?: CurrencyAmount<Currency> | undefined;
    CURRENCY_B?: CurrencyAmount<Currency> | undefined;
  };
  isValid: boolean;
  depositADisabled: boolean;
  depositBDisabled: boolean;
  errorMessage: React.ReactNode;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons = ({
  chainId,
  approvalA,
  approvalB,
  parsedAmounts,
  isValid,
  depositADisabled,
  depositBDisabled,
  errorMessage,
  setShowConfirm,
}: ButtonsProps) => {
  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA =
    approvalA.needApprove && !!parsedAmounts[Field.CURRENCY_A];
  const showApprovalB =
    approvalB.needApprove && !!parsedAmounts[Field.CURRENCY_B];

  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <AutoColumn gap="md">
        {(approvalA.needApprove || approvalB.needApprove) && isValid && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              padding: 0,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {showApprovalA && (
              <Button
                size={Button.Size.big}
                isLoading={approvalA.isApproving}
                onClick={approvalA.submitApprove}
                disabled={approvalA.insufficientBalance}
                width={showApprovalB ? '48%' : '100%'}
              >
                {approvalA.isApproving ? (
                  <Trans>Approving</Trans>
                ) : (
                  approvalA.approveTitle
                )}
              </Button>
            )}

            {showApprovalB && (
              <Button
                size={Button.Size.big}
                isLoading={approvalB.isApproving}
                onClick={approvalB.submitApprove}
                disabled={approvalB.insufficientBalance}
                width={showApprovalB ? '48%' : '100%'}
              >
                {approvalB.isApproving ? (
                  <Trans>Approving</Trans>
                ) : (
                  approvalB.approveTitle
                )}
              </Button>
            )}
          </Box>
        )}

        <Button
          size={Button.Size.big}
          onClick={() => {
            setShowConfirm(true);
          }}
          disabled={
            !isValid ||
            (approvalA.needApprove && !depositADisabled) ||
            (approvalB.needApprove && !depositBDisabled)
          }
          danger={
            !isValid &&
            !!parsedAmounts[Field.CURRENCY_A] &&
            !!parsedAmounts[Field.CURRENCY_B]
          }
        >
          {errorMessage ? errorMessage : t`Preview`}
        </Button>
      </AutoColumn>
    </NeedConnectButton>
  );
};
