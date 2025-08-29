import { Box, LoadingSkeleton, Tooltip } from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import { t } from '@lingui/macro';
import { Lock } from './hooks/useFetchUserLocks';
import TokenLogo from '../../../components/TokenLogo';
import {
  getUnlockTimeText,
  getUnlockTimeTextShort,
} from '../Ve33LockOperate/utils';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useQuery } from '@tanstack/react-query';
import { getFetchVE33RewardsDistributorClaimableQueryOptions } from '@dodoex/dodo-contract-request';
import { useClaimRebases } from './hooks/useClaimRebases';
import { formatTokenAmountNumber } from '../../../utils';
import { formatUnits } from '@dodoex/contract-request';
import { FailedList } from '../../../components/List/FailedList';

export default function ClaimLockDialog({
  open,
  onClose,
  lock,
}: {
  open: boolean;
  onClose: () => void;
  lock: Lock | null;
}) {
  const isUnlock = !!lock && lock?.lockedEnd < Date.now();
  const title = isUnlock ? t`Claim` : t`Claim & Lock`;
  const fetchRebases = useQuery(
    getFetchVE33RewardsDistributorClaimableQueryOptions(
      lock?.chainId,
      lock?.tokenId,
    ),
  );
  const claimMutation = useClaimRebases({
    refetch: () => {
      fetchRebases.refetch();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} title={title} modal pcWidth={420}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20,
          px: 20,
          py: 24,
          borderTopWidth: 1,
        }}
      >
        {fetchRebases.isError && <FailedList refresh={fetchRebases.refetch} />}
        <Box>
          <TokenLogo
            width={36}
            height={36}
            address={lock?.token?.address}
            chainId={lock?.chainId}
          />
          <LoadingSkeleton
            loading={!lock || fetchRebases.isLoading}
            loadingProps={{
              width: 100,
            }}
            sx={{
              mt: 8,
              typography: 'h3',
            }}
          >
            {lock && fetchRebases.data !== undefined
              ? formatTokenAmountNumber({
                  input: formatUnits(fetchRebases.data, lock?.token?.decimals),
                  decimals: lock.token?.decimals,
                })
              : ''}
          </LoadingSkeleton>
          <Box
            sx={{
              mt: 4,
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            {lock?.token?.symbol}
          </Box>
        </Box>

        <Box
          sx={{
            fontWeight: 600,
          }}
        >
          {title + ' '}
          {t`into Lock`}
          {`#${lock?.tokenId}`}
          <br />
          {t`until`}{' '}
          {!!lock && (
            <Tooltip title={getUnlockTimeText(lock?.lockedEnd)}>
              <span>{getUnlockTimeTextShort(lock?.lockedEnd)}</span>
            </Tooltip>
          )}
        </Box>

        <NeedConnectButton
          fullWidth
          chainId={lock?.chainId}
          disabled={!fetchRebases.data || !lock}
          isLoading={claimMutation.isPending}
          onClick={() => {
            if (!lock) return;
            claimMutation.mutate({
              tokenId: lock?.tokenId,
            });
          }}
        >{t`Confirm`}</NeedConnectButton>
      </Box>
    </Dialog>
  );
}
