import {
  alpha,
  Box,
  BoxProps,
  Button,
  ButtonBase,
  Checkbox,
  useMediaDevices,
  useTheme,
} from '@dodoex/components';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import Dialog from '../../../components/Dialog';
import { TokenInfo } from '../../../hooks/Token';
import { t } from '@lingui/macro';
import React from 'react';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { ChainId } from '@dodoex/api';
import TokenStatusButton from '../../../components/TokenStatusButton';
import { Error } from '@dodoex/icons';
import { getEpochVoteEnd } from '../Ve33LockOperate/utils';
import { formatReadableTimeDuration } from '../../../utils/time';
import { PoolTypeE } from '../types';
import {
  getVE33V2BribeVotingRewardContractAddressByChainId,
  getVE33V3BribeVotingRewardContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { useAddIncentive } from '../hooks/useAddIncentive';

interface AddIncentiveProps {
  data?: {
    chainId: ChainId;
    token: TokenInfo;
    type: PoolTypeE;
  };
  onClose: () => void;
  refetch?: () => void;
  sx?: BoxProps['sx'];
}

export default function AddIncentiveDialog(props: AddIncentiveProps) {
  const { isMobile } = useWidgetDevice();

  return (
    <Box
      sx={{
        position: 'relative',
        width: 375,
        overflow: 'hidden',
      }}
    >
      {isMobile ? (
        <Dialog
          modal={isMobile}
          scope={!isMobile}
          open={!!props.data}
          onClose={props.onClose}
        >
          <AddIncentive {...props} />
        </Dialog>
      ) : (
        <AddIncentive
          {...props}
          sx={{
            width: 375,
            height: 'max-content',
            backgroundColor: 'background.paper',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        />
      )}
    </Box>
  );
}

function AddIncentive({ sx, data, onClose, refetch }: AddIncentiveProps) {
  const theme = useTheme();
  const { isMobile } = useMediaDevices();
  const [token, setToken] = React.useState<TokenInfo | null>(
    data?.token ?? null,
  );
  const [amount, setAmount] = React.useState('');
  const [understand, setUnderstand] = React.useState(false);
  React.useEffect(() => {
    if (!token && data?.token) {
      setToken(data.token);
    }
  }, [data]);

  const isV2 = data?.type === PoolTypeE.Pool;
  const contractAddress = data?.chainId
    ? isV2
      ? getVE33V2BribeVotingRewardContractAddressByChainId(data.chainId)
      : getVE33V3BribeVotingRewardContractAddressByChainId(data.chainId)
    : undefined;
  const tokenStatus = useTokenStatus(token, {
    amount,
    contractAddress,
  });
  const nowTime = Date.now();
  const epochVoteEnd = getEpochVoteEnd(nowTime);

  const addMutation = useAddIncentive({
    refetch: () => {
      onClose();
      refetch?.();
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        p: 20,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          typography: 'caption',
        }}
      >
        {t`Incentive`}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: isMobile ? 1 : undefined,
          }}
        >
          <Box
            sx={{
              px: 8,
              py: 4,
              typography: 'body2',
              fontWeight: 600,
              borderRadius: 12,
              backgroundColor: theme.palette.background.paperDarkContrast,
            }}
          >
            <Box
              component="span"
              sx={{ typography: 'h6', color: 'text.secondary' }}
            >
              {t`Epoch ends in`}:
            </Box>{' '}
            <Box component="span" sx={{ color: theme.palette.success.main }}>
              {formatReadableTimeDuration({
                start: nowTime,
                end: epochVoteEnd * 1000,
              })}
            </Box>
          </Box>
          {isMobile && (
            <ButtonBase
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 24,
                height: 24,
                borderRadius: 12,
                border: `solid 1px ${theme.palette.border.main}`,
              }}
              onClick={() => onClose()}
            >
              <Box
                component={Error}
                sx={{
                  width: 18,
                  height: 18,
                }}
              />
            </ButtonBase>
          )}
        </Box>
      </Box>

      <Box
        component="label"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          p: 12,
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          typography: 'body2',
          cursor: 'pointer',
        }}
      >
        <Checkbox
          sx={{
            mx: 4,
          }}
          checked={understand}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setUnderstand(evt.target.checked)
          }
        />
        {t`I understand I will NOT be able to withdraw incentives`}
      </Box>

      <TokenCard
        token={token}
        onTokenChange={setToken}
        amt={amount}
        onInputChange={setAmount}
      />

      <Box>
        <Box
          sx={{
            p: 12,
            borderRadius: 8,
            backgroundColor: theme.palette.background.paperDarkContrast,
            typography: 'h6',
            color: 'text.secondary',
          }}
        >{t`Your incentive will be released linearly over the remaining time of the current epoch.`}</Box>
        <Box
          sx={{
            pt: 8,
            position: 'sticky',
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <NeedConnectButton chainId={data?.chainId} includeButton fullWidth>
            <TokenStatusButton status={tokenStatus}>
              <Button
                fullWidth
                disabled={!understand || !token || !amount || !data}
                isLoading={addMutation.isPending}
                onClick={() =>
                  addMutation.mutate({
                    chainId: data?.chainId!,
                    token: token!,
                    type: data?.type!,
                    amount,
                  })
                }
              >{t`Add Incentive`}</Button>
            </TokenStatusButton>
          </NeedConnectButton>
        </Box>
      </Box>
    </Box>
  );
}
