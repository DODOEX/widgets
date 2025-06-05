import { Box, Button, ButtonBase, Input, useTheme } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { ChainId } from '@dodoex/api';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import Dialog from '../../Dialog';
import { chainListMap } from '../../../constants/chainList';
import { useAddressValidation } from '../../../hooks/useAddressValidation';

export interface ReceiveAddressInputModalProps {
  chainId: ChainId;
  open: boolean;
  onClose: () => void;
  inputToAddress: string | null;
  setInputToAddress: Dispatch<SetStateAction<string | null>>;
}

export const ReceiveAddressInputModal = ({
  chainId,
  open,
  onClose,
  inputToAddress,
  setInputToAddress,
}: ReceiveAddressInputModalProps) => {
  const theme = useTheme();

  const [address, setAddress] = useState(inputToAddress || '');

  const isInvalidAddress = useAddressValidation(address, chainId);

  const chain = useMemo(() => {
    return chainListMap.get(chainId);
  }, [chainId]);

  return (
    <Dialog open={open} onClose={onClose} title="Receive address" modal>
      <Box
        sx={{
          minWidth: 420,
          p: 20,
          borderTop: `1px solid ${theme.palette.border.main}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Input
            fullWidth
            value={address}
            placeholder={`Enter ${chain?.name} address`}
            onChange={(evt) => {
              setAddress(evt.target.value);
            }}
            height={48}
            suffix={
              !address ? null : (
                <Box
                  component={ButtonBase}
                  sx={{
                    ml: 5,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: 'border.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    color: 'text.secondary',
                    '&:focus-visible': {
                      border: 'solid 1px',
                      borderColor: 'text.primary',
                    },
                  }}
                  onClick={() => {
                    setAddress('');
                  }}
                >
                  <Box
                    component={Error}
                    sx={{
                      width: 12,
                    }}
                  />
                </Box>
              )
            }
          />
          {!isInvalidAddress && address && (
            <Box
              sx={{
                typography: 'h6',
                color: 'error.main',
              }}
            >
              Invalid address
            </Box>
          )}
        </Box>

        <Button
          fullWidth
          variant={Button.Variant.contained}
          size={Button.Size.middle}
          disabled={!address || !isInvalidAddress}
          onClick={() => {
            setInputToAddress(address);
            onClose();
          }}
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};
