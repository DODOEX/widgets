import {
  Box,
  LoadingSkeleton,
  useMediaDevices,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import { ReactComponent as StarIcon } from './star.svg';
import { ReactComponent as VotesIcon } from './votes.svg';
import { ReactComponent as DistributedIcon } from './distributed.svg';
import { ReactComponent as IncentivesIcon } from './incentives.svg';
import React from 'react';
import { formatReadableNumber, formatShortNumber } from '../../../utils';
import TokenLogo from '../../../components/TokenLogo';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { useQuery } from '@tanstack/react-query';
import { getFetchVE33VoterWeightsQueryOptions } from '@dodoex/dodo-contract-request';
import { Ve33PoolInfoI } from '../types';
import { formatUnits } from '@dodoex/contract-request';

export default function Dashboard({
  poolInfo,
}: {
  poolInfo: Ve33PoolInfoI | undefined;
}) {
  const theme = useTheme();
  const { isMobile } = useMediaDevices();
  const fetchVote = useQuery(
    getFetchVE33VoterWeightsQueryOptions(poolInfo?.chainId, poolInfo?.id),
  );
  const veToken = {
    chainId: poolInfo?.chainId!,
    symbol: 'MOMO',
    name: 'MOMO',
    decimals: 18,
    address: '0x42EDf453F8483c7168c158d28D610A58308517D1',
  };

  return (
    <Box
      sx={{
        p: 20,
        borderRadius: 24,
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 8,
          typography: isMobile ? 'body2' : 'body1',
          fontWeight: 600,
          background: `linear-gradient(180deg, ${theme.palette.text.primary} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        <Box component={StarIcon} sx={{ flexShrink: 0 }} />
        {t`By providing an incentive, you draw more liquidity providers to this pool.`}
      </Box>
      <Box
        sx={{
          mt: isMobile ? 20 : 32,
          display: 'grid',
          gap: isMobile ? 20 : 0,
          gridTemplateColumns: isMobile ? undefined : 'repeat(3, 1fr)',
        }}
      >
        <Item icon={<VotesIcon />} label={t`Current votes`}>
          <LoadingSkeleton
            loading={fetchVote.isLoading}
            loadingProps={{
              width: 100,
            }}
          >
            {formatReadableNumber({
              input: fetchVote.data
                ? formatUnits(fetchVote.data, veToken.decimals)
                : '',
            })}
          </LoadingSkeleton>
        </Item>
        <Item icon={<DistributedIcon />} label={t`Will be distributed`}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TokenLogo width={18} height={18} marginRight={4} />$
            {formatShortNumber(12.88)}
          </Box>
        </Item>
        <Item icon={<IncentivesIcon />} label={t`Current Incentives`}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TokenLogoPair width={18} height={18} mr={4} />$
            {formatShortNumber(12.88)}
          </Box>
        </Item>
      </Box>
    </Box>
  );
}

function Item({
  icon,
  label,
  children,
}: React.PropsWithChildren<{
  icon: React.ReactNode;
  label: string;
}>) {
  const theme = useTheme();
  const { isMobile } = useMediaDevices();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        alignItems: 'center',
        gap: isMobile ? 20 : 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 48,
          height: 48,
          borderRadius: 16,
          backgroundColor: theme.palette.background.paperDarkContrast,
        }}
      >
        {icon}
      </Box>
      <Box
        sx={
          isMobile
            ? undefined
            : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }
        }
      >
        <Box
          sx={{
            typography: isMobile ? 'h6' : 'body2',
            color: 'text.secondary',
          }}
        >
          {label}
        </Box>
        <Box
          sx={{
            mt: 4,
            typography: 'caption',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
