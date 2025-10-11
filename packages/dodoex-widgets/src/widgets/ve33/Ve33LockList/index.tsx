import {
  Box,
  Button,
  LoadingSkeleton,
  useMediaDevices,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { TableList } from './TableList';
import React from 'react';
import MergeDialog from './MergeDialog';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { Lock, useFetchUserLocks } from './hooks/useFetchUserLocks';
import LockManageDialog from './LockManageDialog';
import ClaimLockDialog from './ClaimLockDialog';
import { CardItem, CardList } from './CardList';
import { CardStatus } from '../../../components/CardWidgets';

export default function Ve33LockList() {
  const [selectedId, setSelectedId] = React.useState<number[]>([]);
  const [inSelected, setInSelected] = React.useState(false);
  const selectedLen = selectedId.length;
  const [openMerge, setOpenMerge] = React.useState(false);
  const { onlyChainId } = useUserOptions();
  const { chainId: connectedChainId, account } = useWalletInfo();
  const chainId = onlyChainId ?? connectedChainId;
  const fetchUserLocks = useFetchUserLocks({
    chainId,
    account,
  });
  const { isMobile } = useMediaDevices();

  const [manageLock, setManageLock] = React.useState<Lock | null>(null);
  const [showClaimLock, setShowClaimLock] = React.useState<Lock | null>(null);

  if (!account) return;

  const fromLock = fetchUserLocks.userLocks?.find(
    (item) => item.tokenId === selectedId[0],
  );
  const toLock = fetchUserLocks.userLocks?.find(
    (item) => item.tokenId === selectedId[1],
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 12,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            typography: 'h5',
          }}
        >
          <Trans>My Locks</Trans>(
          <LoadingSkeleton
            component="span"
            loading={fetchUserLocks.isLoading}
            loadingProps={{
              width: 40,
            }}
          >
            {fetchUserLocks.userLocks?.length ?? 0}
          </LoadingSkeleton>
          )
        </Box>
        {!!fetchUserLocks.userLocks?.length && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!!selectedLen && (
              <Box sx={{ typography: 'h6', fontWeight: 600 }}>
                <Trans>{selectedLen} Lock selected</Trans>
              </Box>
            )}
            <Button
              sx={{
                py: 0,
                px: 16,
                height: 32,
                borderRadius: 24,
                typography: 'body2',
              }}
              variant={inSelected ? undefined : Button.Variant.outlined}
              disabled={inSelected && !selectedLen}
              onClick={() => {
                if (inSelected) {
                  setOpenMerge(true);
                } else {
                  setInSelected(true);
                }
              }}
            >
              <Trans>Merge</Trans>
            </Button>
          </Box>
        )}
      </Box>

      <CardStatus
        loading={fetchUserLocks.isLoading}
        refetch={fetchUserLocks.error ? fetchUserLocks.refetch : undefined}
        empty={!fetchUserLocks.userLocks?.length}
        loadingCard={
          isMobile ? (
            <CardItem
              inSelected={inSelected}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onManage={(lock) => setManageLock(lock)}
              onClaim={(lock) => setShowClaimLock(lock)}
            />
          ) : undefined
        }
      >
        {isMobile ? (
          <CardList
            inSelected={inSelected}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            fetchUserLocks={fetchUserLocks}
            onManage={(lock) => setManageLock(lock)}
            onClaim={(lock) => setShowClaimLock(lock)}
          />
        ) : (
          <TableList
            inSelected={inSelected}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            fetchUserLocks={fetchUserLocks}
            onManage={(lock) => setManageLock(lock)}
            onClaim={(lock) => setShowClaimLock(lock)}
          />
        )}
      </CardStatus>
      <MergeDialog
        open={openMerge}
        onClose={() => setOpenMerge(false)}
        locks={[fromLock, toLock]}
        refetch={() => {
          fetchUserLocks.refetch();
        }}
      />
      <LockManageDialog
        open={!!manageLock}
        onClose={() => setManageLock(null)}
        lock={manageLock}
        refetch={() => {
          fetchUserLocks.refetch();
        }}
      />
      <ClaimLockDialog
        open={!!showClaimLock}
        onClose={() => setShowClaimLock(null)}
        lock={showClaimLock}
      />
    </Box>
  );
}
