import {
  Box,
  Button,
  Checkbox,
  useTheme,
  WidgetModal,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import { ChangeEvent, useEffect, useState } from 'react';
import { chainListMap } from '../../constants/chainList';
import { ChainId } from '../../constants/chains';
import {
  getAuthSwitchCache,
  setAuthSwitchCache,
} from '../../constants/localstorage';
import { useSwitchChain } from '../../hooks/ConnectWallet/useSwitchChain';
import { WIDGET_CLASS_NAME } from '../Widget';

export default function SwitchChainDialog({
  chainId,
  open,
  onClose,
}: {
  chainId?: ChainId;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [openTarget, setOpenTarget] = useState(false);
  const { chainId: currentChainId } = useWeb3React();
  const [autoSwitch, setAutoSwitch] = useState(getAuthSwitchCache());
  const switchChain = useSwitchChain(chainId);
  useEffect(() => {
    const computed = async () => {
      if (open) {
        if (
          currentChainId &&
          chainId &&
          chainId !== currentChainId &&
          switchChain
        ) {
          if (autoSwitch) {
            await switchChain();
            onClose();
            return;
          }
          setOpenTarget(true);
        } else {
          onClose();
        }
      } else if (openTarget) {
        setOpenTarget(false);
      }
    };
    computed();
  }, [open]);
  const network = chainId ? chainListMap[chainId]?.name ?? '' : '';
  return (
    <WidgetModal
      open={openTarget}
      onClose={onClose}
      container={document.querySelector(`.${WIDGET_CLASS_NAME}`)}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: theme.spacing(20, 16),
          gap: 20,
          borderRadius: theme.spacing(16, 16, 0, 0),
          outline: 0,
        }}
      >
        <Box
          sx={{
            typography: 'caption',
            textAlign: 'center',
          }}
        >
          <Trans>This token is on</Trans>
          &nbsp;{network}.
          <br />
          <Trans>Are you sure swapping to another chain?</Trans>
        </Box>
        <Box
          component="label"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            typography: 'h6',
            cursor: 'pointer',
          }}
        >
          <Checkbox
            sx={{
              top: -1,
            }}
            checked={autoSwitch}
            onChange={(evt: ChangeEvent<HTMLInputElement>) => {
              const { checked } = evt.target;
              setAuthSwitchCache(checked);
              setAutoSwitch(checked);
            }}
          />
          <Trans>Auto switch network</Trans>
        </Box>
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
        >
          <Button variant={Button.Variant.second} onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            variant={Button.Variant.outlined}
            onClick={async () => {
              if (switchChain) {
                await switchChain();
              }
              onClose();
            }}
          >
            <Trans>Confirm</Trans>
          </Button>
        </Box>
      </Box>
    </WidgetModal>
  );
}
