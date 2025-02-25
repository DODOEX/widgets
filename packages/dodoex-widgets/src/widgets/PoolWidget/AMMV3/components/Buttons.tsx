import { ChainId } from '@dodoex/api';
import { Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import { Field } from '../types';

export interface ButtonsProps {
  chainId: ChainId;
  parsedAmounts: {
    MINT_1?: BigNumber | undefined;
    MINT_2?: BigNumber | undefined;
  };
  isValid: boolean;
  errorMessage: React.ReactNode;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons = ({
  chainId,
  parsedAmounts,
  isValid,
  errorMessage,
  setShowConfirm,
}: ButtonsProps) => {
  return (
    <NeedConnectButton includeButton fullWidth chainId={chainId}>
      <Button
        fullWidth
        size={Button.Size.big}
        onClick={() => {
          setShowConfirm(true);
        }}
        disabled={!isValid}
        danger={
          !isValid &&
          !!parsedAmounts[Field.MINT_1] &&
          !!parsedAmounts[Field.MINT_2]
        }
      >
        {errorMessage ? errorMessage : t`Preview`}
      </Button>
    </NeedConnectButton>
  );
};
