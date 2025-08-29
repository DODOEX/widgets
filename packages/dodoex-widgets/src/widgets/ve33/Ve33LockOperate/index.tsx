import {
  alpha,
  BoxProps,
  Button,
  LoadingSkeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Box } from '@dodoex/components';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import React from 'react';
import { useFetchFiatPriceBatch } from '../../../hooks/useFetchFiatPriceBatch';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../utils/formatter';
import BigNumber from 'bignumber.js';
import { Trans } from '@lingui/macro';
import LockSlider from '../components/LockSlider';
import {
  getCreateLockNftPower,
  getLockDurationRemainder,
  getUnlockTimeText,
  getUnlockTimeTextShort,
} from './utils';
import { useCreateLock } from './hooks/useCreateLock';
import { useQuery } from '@tanstack/react-query';
import {
  getFetchVE33VotingEscrowTokenQueryOptions,
  getVE33VotingEscrowContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { tokenApi } from '../../../constants/api';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import TokenStatusButton from '../../../components/TokenStatusButton';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useFetchUserTotalVeNFT } from './hooks/useFetchUserTotalVeNFT';
import { formatUnits } from '@dodoex/contract-request';

export default function Ve33LockOperate({ sx }: { sx?: BoxProps['sx'] }) {
  const theme = useTheme();
  const [amt, setAmt] = React.useState('');
  const { onlyChainId } = useUserOptions();
  const { chainId: connectedChainId, account } = useWalletInfo();
  const chainId = onlyChainId ?? connectedChainId;
  const fetchTokenAddress = useQuery(
    getFetchVE33VotingEscrowTokenQueryOptions(chainId),
  );
  const proxyContractAddress =
    getVE33VotingEscrowContractAddressByChainId(chainId);
  const tokenQuery = useQuery({
    ...tokenApi.getFetchTokenQuery(
      chainId,
      fetchTokenAddress.data,
      account,
      proxyContractAddress,
    ),
  });
  const token = tokenQuery.data;
  const tokenStatus = useTokenStatus(token, {
    amount: amt,
    contractAddress: proxyContractAddress,
  });
  const fetchFiatPrice = useFetchFiatPriceBatch({
    tokens: token ? [token] : [],
  });
  const tokenUsd = token ? fetchFiatPrice.data?.get(token?.address) : undefined;
  const tokenUsdBg = tokenUsd !== undefined ? new BigNumber(tokenUsd) : null;
  const fiatPrice = tokenUsdBg && amt ? tokenUsdBg.times(amt) : 0;
  const [lockDurationWeek, setLockDurationWeek] = React.useState(0);
  const nowTime = Math.floor(Date.now() / 1000);
  const lockDuration = lockDurationWeek + getLockDurationRemainder(nowTime);
  const nftPowerBg = getCreateLockNftPower(amt, lockDuration);
  const unlockTime = (nowTime + lockDuration) * 1000;

  const fetchTotalNFT = useFetchUserTotalVeNFT(chainId, account);
  const refetch = React.useCallback(async () => {
    setAmt('');
    setLockDurationWeek(0);
    const time = setTimeout(() => {
      fetchTotalNFT.refetch();
    }, 1000);
    return () => {
      clearTimeout(time);
    };
  }, []);

  const createMutation = useCreateLock({
    amount: amt,
    lockDuration,
    decimals: token?.decimals,
    symbol: token?.symbol,
    refetch: () => {
      refetch();
    },
  });

  return (
    <Box>
      <Box
        sx={{
          mb: 12,
          borderRadius: 24,
          textAlign: 'center',
          border: `solid 1px ${theme.palette.border.main}`,
        }}
      >
        <Box
          sx={{
            py: 8,
            borderRadius: theme.spacing(24, 24, 0, 0),
            backgroundColor: theme.palette.background.paperDarkContrast,
            typography: 'body2',
          }}
        >
          <Trans>My total {`ve${token?.symbol}`}</Trans>
        </Box>
        <Box
          sx={{
            p: theme.spacing(12, 20),
          }}
        >
          <LoadingSkeleton
            loading={fetchTotalNFT.isLoading}
            loadingProps={{
              mx: 'auto',
              width: 100,
            }}
            sx={{
              typography: 'h4',
            }}
          >
            {account
              ? formatTokenAmountNumber({
                  input: formatUnits(fetchTotalNFT.totalNFT, token?.decimals),
                  decimals: token?.decimals,
                })
              : '-'}
          </LoadingSkeleton>
          <Box
            sx={{
              mt: 4,
              typography: 'h6',
              color: 'text.secondary',
            }}
          >
            <Trans>Lock More, Vote Stronger, Earn More</Trans>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          padding: 20,
          borderRadius: 24,
          backgroundColor: 'background.paper',
          ...sx,
        }}
      >
        <TokenCard
          token={token}
          amt={amt}
          onInputChange={setAmt}
          fiatPriceTxt={
            fetchFiatPrice.isError ? (
              '-'
            ) : (
              <LoadingSkeleton
                loading={fetchFiatPrice.isLoading}
                loadingProps={{
                  width: 40,
                }}
              >
                {`$${formatReadableNumber({
                  input: fiatPrice,
                  showDecimals: 1,
                })}`}
              </LoadingSkeleton>
            )
          }
        />
        <Box
          sx={{
            p: {
              mobile: 16,
              tablet: 20,
            },
            borderRadius: 12,
            border: `solid 1px ${theme.palette.border.main}`,
            typography: 'h6',
            fontWeight: 600,
          }}
        >
          <Box
            sx={{
              mb: 8,
            }}
          >
            <Trans>Locking for</Trans>
            <Tooltip title={getUnlockTimeText(unlockTime)}>
              <Box
                component="span"
                sx={{
                  mx: 4,
                  color: 'success.main',
                }}
              >
                {getUnlockTimeTextShort(unlockTime)}
              </Box>
            </Tooltip>
            <Trans>for</Trans>
            <Tooltip
              title={formatReadableNumber({
                input: tokenUsdBg?.times(nftPowerBg) ?? '',
              })}
            >
              <Box
                component="span"
                sx={{
                  mx: 4,
                  color: 'success.main',
                }}
              >
                {formatTokenAmountNumber({
                  input: nftPowerBg,
                  decimals: token?.decimals,
                })}
              </Box>
            </Tooltip>
             {`ve${token?.symbol} `}
            <Trans>voting power</Trans>
          </Box>
          <LockSlider
            value={lockDurationWeek}
            onChange={(_, v) => setLockDurationWeek(v as number)}
          />
        </Box>
        <Box>
          <Box
            sx={{
              p: 12,
              mb: 8,
              borderRadius: 8,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              typography: 'h6',
            }}
          >
            <Trans>
              Locking will give you an NFT, referred to as a veNFT. You can
              increase the Lock amount or extend the Lock time at any point
              after.
            </Trans>
          </Box>
          <NeedConnectButton
            includeButton
            fullWidth
            size={Button.Size.big}
            chainId={onlyChainId}
          >
            <TokenStatusButton
              status={tokenStatus}
              buttonProps={{
                size: Button.Size.big,
              }}
            >
              <Button
                size={Button.Size.big}
                fullWidth
                disabled={!amt || !token}
                isLoading={createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                Lock
              </Button>
            </TokenStatusButton>
          </NeedConnectButton>
        </Box>
      </Box>
    </Box>
  );
}
