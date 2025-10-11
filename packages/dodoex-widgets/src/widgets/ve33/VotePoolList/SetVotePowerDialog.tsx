import { t } from '@lingui/macro';
import {
  Box,
  Button,
  LoadingSkeleton,
  useMediaDevices,
  useTheme,
} from '@dodoex/components';
import Dialog from '../../../components/Dialog';
import { VotePoolInfoI } from '../types';
import PoolTokenInfo from '../components/PoolTokenInfo';
import {
  MyVoteWidgets,
  SelectLock,
  TotalVoteWidgets,
  VAPRWidgets,
} from './widgets';
import { Lock } from '../Ve33LockList/hooks/useFetchUserLocks';
import React from 'react';
import { formatShortNumber, formatTokenAmountNumber } from '../../../utils';
import BigNumber from 'bignumber.js';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useVoteVe33 } from './hooks/useVoteVe33';
import { useQueryClient } from '@tanstack/react-query';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { PoolApi } from '@dodoex/api';

export default function SetVotePowerDialog({
  chainId,
  account,
  open,
  onClose,
  data,
  lock,
  setLock,
  refetch,
}: {
  chainId: number | undefined;
  account: string | undefined;
  open: boolean;
  onClose: () => void;
  data: Array<VotePoolInfoI>;
  lock: Lock | null;
  setLock: (lock: Lock | null) => void;
  refetch?: () => void;
}) {
  const theme = useTheme();
  const { isMobile } = useMediaDevices();
  const [partObject, setPartObject] = React.useState<{
    [key: string]: number;
  }>({});
  const fixPart = (lastId: string) => {
    setPartObject((prev) => {
      let part = 0;
      const result = { ...prev };
      Object.values(result).forEach((p) => {
        part += p;
      });
      if (part <= 100) {
        return prev;
      }
      let lastValue = result[lastId] ?? 0;
      lastValue = lastValue - (part - 100);
      result[lastId] = lastValue > 0 ? lastValue : 0;
      return result;
    });
  };
  const totalPart = Object.values(partObject).reduce((prev, current) => {
    return prev + current;
  }, 0);
  const disabled = totalPart !== 100 || !lock;

  const grahqlRequest = useGraphQLRequests();
  const queryClient = useQueryClient();
  const voteMutation = useVoteVe33({
    refetch: () => {
      setPartObject({});
      queryClient.invalidateQueries({
        queryKey: grahqlRequest.getQuery(PoolApi.graphql.fetchVe33UserLocks, {
          where: {
            user: account?.toLowerCase() ?? '',
          },
        }).queryKey,
      });
      refetch?.();
      onClose();
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t`Set vote power`}
      modal
      pcWidth={1124}
    >
      <Box
        sx={{
          borderTop: `solid 1px ${theme.palette.border.main}`,
        }}
      >
        {isMobile ? (
          <CardList
            data={data}
            lock={lock}
            partObject={partObject}
            setPartObject={setPartObject}
            fixPart={fixPart}
          />
        ) : (
          <TableList
            data={data}
            lock={lock}
            partObject={partObject}
            setPartObject={setPartObject}
            fixPart={fixPart}
          />
        )}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: 20,
            p: 20,
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 -4px 16px 0 ${theme.palette.background.paperDarkContrast}`,
          }}
        >
          <SelectLock
            chainId={chainId}
            account={account}
            selectedLock={lock}
            setSelectedLock={setLock}
            fullWidth={isMobile}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: isMobile ? '100%' : undefined,
              justifyContent: isMobile ? 'space-between' : undefined,
            }}
          >
            {disabled ? (
              <Box
                sx={{
                  typography: isMobile ? 'h6' : 'body2',
                  fontWeight: 600,
                  textAlign: isMobile ? 'left' : 'right',
                }}
              >
                <Box>{t`Allocate 100% of your votes above.`}</Box>
                <Box
                  sx={{ mt: 4, color: theme.palette.purple.main }}
                >{t`Distribute equally`}</Box>
              </Box>
            ) : (
              <Button
                sx={{
                  px: 16,
                  height: 60,
                  borderRadius: 16,
                }}
                onClick={() => {
                  setPartObject({});
                }}
              >{t`Reset`}</Button>
            )}
            <NeedConnectButton
              chainId={chainId}
              disabled={disabled}
              isLoading={voteMutation.isPending}
              onClick={() =>
                voteMutation.mutate({
                  tokenId: lock?.tokenId!,
                  poolIds: data.map((item) => item.id),
                  weights: data.map((item) => partObject[item.id]),
                })
              }
              sx={{
                px: 16,
                height: 60,
                borderRadius: 16,
              }}
            >
              Vote
            </NeedConnectButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

function TableList({
  data,
  lock,
  partObject,
  setPartObject,
  fixPart,
}: {
  data: Array<VotePoolInfoI>;
  lock: Lock | null;
  partObject: {
    [key: string]: number;
  };
  setPartObject: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
  fixPart: (id: string) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      component="table"
      sx={{
        width: '100%',
        '& th, & td': {
          px: 24,
          py: 12,
        },
        '& th': {
          textAlign: 'left',
          typography: 'h6',
          fontWeight: 600,
          color: 'text.secondary',
          '&:last-child': {
            textAlign: 'right',
          },
        },
        '& td': {
          typography: 'body2',
          fontWeight: 600,
        },
      }}
    >
      <thead>
        <tr>
          <th>{t`Pair`}</th>
          <th>{t`VAPR`}</th>
          <th>{t`Total Vote`}</th>
          <th>{t`Est. Rewards`}</th>
          <th>{t`My Vote`}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          if (!item) return null;
          const { id } = item;
          return (
            <tr>
              <td>
                <PoolTokenInfo item={item} />
              </td>
              <td>
                <VAPRWidgets item={item} />
              </td>
              <td>
                <TotalVoteWidgets item={item} />
              </td>
              <td>~$0</td>
              <td>
                <MyVoteWidgets
                  value={partObject[id]}
                  onChange={(v) => {
                    setPartObject((prev) => {
                      const result = { ...prev };
                      if (v === undefined) {
                        delete result[id];
                      } else {
                        result[id] = v;
                      }
                      return result;
                    });
                  }}
                  onBlur={() => fixPart(id)}
                  veNFTAmount={formatTokenAmountNumber({
                    input: new BigNumber(lock?.votingPower ?? 0)
                      .times(partObject[id] ?? 0)
                      .div(100),
                    decimals: lock?.token?.decimals,
                  })}
                  veNFTSymbol={`ve${lock?.token?.symbol ?? ''}`}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Box>
  );
}

function CardList({
  data,
  lock,
  partObject,
  setPartObject,
  fixPart,
}: {
  data: Array<VotePoolInfoI>;
  lock: Lock | null;
  partObject: {
    [key: string]: number;
  };
  setPartObject: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
  fixPart: (id: string) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 12,
        p: 20,
      }}
    >
      {data.map((item) => {
        if (!item) return null;
        const { id } = item;
        return (
          <Box
            sx={{
              p: 20,
              border: `solid 1px ${theme.palette.border.main}`,
              borderRadius: 24,
            }}
          >
            <PoolTokenInfo item={item} />
            <LoadingSkeleton
              loading={!item}
              loadingProps={{
                width: 100,
              }}
              sx={{
                mt: 40,
              }}
            >
              <VAPRWidgets item={item!} />
            </LoadingSkeleton>
            <Box
              sx={{ typography: 'h6', color: 'text.secondary' }}
            >{t`APR`}</Box>

            <Box
              sx={{
                display: 'grid',
                gap: 8,
                mt: 16,
                pt: 16,
                borderTop: `solid 1px ${theme.palette.border.main}`,
              }}
            >
              <ItemInfo label={t`Total Vote`} loading={!item}>
                <TotalVoteWidgets item={item!} showLogo singleLine />
              </ItemInfo>
              <ItemInfo label={t`Est. Rewards`} loading={!item}>
                ~${formatShortNumber(0)}
              </ItemInfo>
              <MyVoteWidgets
                label={t`My Vote`}
                loading={!item}
                value={partObject[id]}
                onChange={(v) => {
                  setPartObject((prev) => {
                    const result = { ...prev };
                    if (v === undefined) {
                      delete result[id];
                    } else {
                      result[id] = v;
                    }
                    return result;
                  });
                }}
                onBlur={() => fixPart(id)}
                veNFTAmount={formatTokenAmountNumber({
                  input: new BigNumber(lock?.votingPower ?? 0)
                    .times(partObject[id] ?? 0)
                    .div(100),
                  decimals: lock?.token?.decimals,
                })}
                veNFTSymbol={`ve${lock?.token?.symbol ?? ''}`}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
function ItemInfo({
  label,
  loading,
  children,
}: React.PropsWithChildren<{
  loading?: boolean;
  label: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ typography: 'h6', color: 'text.secondary' }}>{label}</Box>
      <LoadingSkeleton
        loading={loading}
        loadingProps={{
          width: 100,
        }}
        sx={{
          typography: 'body2',
          fontWeight: 600,
        }}
      >
        {children}
      </LoadingSkeleton>
    </Box>
  );
}
