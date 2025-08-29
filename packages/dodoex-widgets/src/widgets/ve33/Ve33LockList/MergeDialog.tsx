import { t } from '@lingui/macro';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  LoadingSkeleton,
  Tooltip,
  useMediaDevices,
  useTheme,
} from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import TokenLogo from '../../../components/TokenLogo';
import { ChainId } from '@dodoex/api';
import { Alarm, ArrowBack, Switch } from '@dodoex/icons';
import { QuestionTooltip } from '../../../components/Tooltip';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useMergeLock } from './hooks/useMergeLock';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFetchVE33RewardsDistributorClaimableQueryOptions,
  getFetchVE33VotingEscrowBalanceOfNFTQueryOptions,
} from '@dodoex/dodo-contract-request';
import { Lock } from './hooks/useFetchUserLocks';
import {
  getUnlockTimeText,
  getUnlockTimeTextShort,
} from '../Ve33LockOperate/utils';
import React from 'react';
import { useClaimRebases } from './hooks/useClaimRebases';

export default function MergeDialog({
  open,
  onClose,
  locks,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  locks: [Lock | undefined, Lock | undefined];
  refetch?: () => void;
}) {
  const theme = useTheme();
  const { isMobile } = useMediaDevices();
  const chainId = ChainId.MORPH_HOLESKY_TESTNET;
  const queryClient = useQueryClient();
  const [isSwitch, setIsSwitch] = React.useState(false);
  const [fromLock, toLock] = isSwitch ? [locks[1], locks[0]] : locks;
  const fromTokenId = fromLock?.tokenId;
  const toTokenId = toLock?.tokenId;
  const fetchRebases = useQuery(
    getFetchVE33RewardsDistributorClaimableQueryOptions(
      fromLock?.chainId,
      fromLock?.tokenId,
    ),
  );

  const claimRebasesMutation = useClaimRebases({
    refetch: () => {
      fetchRebases.refetch();
    },
  });

  const mergeLockMutation = useMergeLock({
    fromTokenId,
    toTokenId,
    refetch: () => {
      onClose();
      refetch?.();
      queryClient.invalidateQueries({
        queryKey: getFetchVE33VotingEscrowBalanceOfNFTQueryOptions(
          chainId,
          fromTokenId,
        ).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getFetchVE33VotingEscrowBalanceOfNFTQueryOptions(
          chainId,
          toTokenId,
        ).queryKey,
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t`Merge`}
      modal
      pcWidth={560}
      headerSx={{
        borderBottom: `solid 1px ${theme.palette.border.main}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          p: theme.spacing(24, 20),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'auto' : '1fr auto 1fr',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Before */}
          <Box
            sx={{
              borderRadius: 12,
              backgroundColor: theme.palette.background.paperContrast,
            }}
          >
            <Box
              sx={{
                p: theme.spacing(8, 20),
              }}
            >
              <LockItem lock={fromLock} border />
              <LockItem lock={toLock} />
            </Box>
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                borderRadius: theme.spacing(0, 0, 12, 12),
                backgroundColor: theme.palette.background.paperDarkContrast,
                typography: 'h6',
                fontWeight: 600,
              }}
            >{t`Before`}</Box>
          </Box>
          {/* icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mx: isMobile ? 'auto' : 'undefined',
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: theme.palette.background.paperDarkContrast,
            }}
          >
            <Box
              component={ArrowBack}
              sx={{
                width: 18,
                height: 18,
                transform: isMobile ? 'rotate(-90deg)' : 'rotate(180deg)',
              }}
            />
          </Box>
          {/* After  */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              borderRadius: 12,
              backgroundColor: theme.palette.background.paperContrast,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                p: theme.spacing(8, 20),
              }}
            >
              <LockItem
                lock={toLock}
                onSwitch={() => setIsSwitch((prev) => !prev)}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                py: 8,
                textAlign: 'center',
                borderRadius: theme.spacing(0, 0, 12, 12),
                backgroundColor: theme.palette.background.paperDarkContrast,
                typography: 'h6',
                fontWeight: 600,
              }}
            >
              {t`After`}
              <QuestionTooltip
                title={t`Merging two locks will inherit the longest lock time of the two and will increase the final Lock (veNFT) voting power by adding up the two underlying locked amounts based on the new lock time.`}
              />
            </Box>
          </Box>
        </Box>

        {fetchRebases.isLoading || fetchRebases.data ? (
          <LoadingSkeleton
            loading={fetchRebases.isLoading}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              p: 12,
              borderRadius: 8,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Alarm />
              {t`Claim Lock#${fromLock?.tokenId} rewards before merge.`}
            </Box>
            <Button
              sx={{
                px: 16,
                py: 0,
                height: 40,
                minHeight: 'max-content',
                borderRadius: 8,
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                typography: 'h6',
                fontWeight: 600,
              }}
              isLoading={claimRebasesMutation.isPending}
              onClick={() =>
                claimRebasesMutation.mutate({
                  tokenId: fromLock?.tokenId!,
                })
              }
            >{t`Claim`}</Button>
          </LoadingSkeleton>
        ) : (
          ''
        )}

        <Box>
          <NeedConnectButton
            fullWidth
            size={Button.Size.big}
            chainId={chainId}
            includeButton
          >
            <Button
              fullWidth
              size={Button.Size.big}
              disabled={fetchRebases.isLoading}
              isLoading={mergeLockMutation.isPending}
              onClick={() => mergeLockMutation.mutate()}
            >{t`Confirm`}</Button>
          </NeedConnectButton>
          <Box
            sx={{
              mt: 4,
              typography: 'h6',
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >{t`*Merging an Auto Max-Lockis not allowed.`}</Box>
        </Box>
      </Box>
    </Dialog>
  );
}

function LockItem({
  lock,
  border,
  onSwitch,
}: {
  lock: Lock | undefined;
  border?: boolean;
  onSwitch?: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        py: 12,
        borderBottomWidth: border ? 1 : undefined,
      }}
    >
      <TokenLogo
        chainId={lock?.chainId}
        address={lock?.token?.address}
        width={28}
        height={28}
        marginRight={0}
      />
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
            fontWeight: 600,
          }}
        >
          {t`Lock`}
          {` #${lock?.tokenId}`}
          {!!onSwitch && (
            <ButtonBase
              sx={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                ml: 4,
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: 'background.paperDarkContrast',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
              onClick={() => onSwitch()}
            >
              <Box component={Switch} />
            </ButtonBase>
          )}
        </Box>
        <Box
          sx={{
            mt: 4,
            typography: 'h6',
            color: 'text.secondary',
          }}
        >
          {`${lock?.value} ${lock?.token?.symbol} Locked Until\n`}
          {lock?.lockedEnd ? (
            <Tooltip title={getUnlockTimeText(lock.lockedEnd)}>
              <Box>{getUnlockTimeTextShort(lock?.lockedEnd)}</Box>
            </Tooltip>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
