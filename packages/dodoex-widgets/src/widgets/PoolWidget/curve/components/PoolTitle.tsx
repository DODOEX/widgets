import { Box, Skeleton, useTheme } from '@dodoex/components';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { CurvePoolT } from '../types';
import { ApyTooltip } from './ApyTooltip';
import { CoinsLogoList } from './CoinsLogoList';

export interface PoolTitleProps {
  poolDetail: CurvePoolT | undefined;
}

export const PoolTitle = ({ poolDetail }: PoolTitleProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24,
        [theme.breakpoints.up('tablet')]: {
          py: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.border.main}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {poolDetail ? (
          <CoinsLogoList pool={poolDetail} separate={false} wrap={true} />
        ) : (
          <Skeleton width={72} height={52} sx={{ borderRadius: 8 }} />
        )}
        <Box>
          <Box
            sx={{
              typography: 'h4',
              fontWeight: 600,
            }}
          >
            {poolDetail?.name ?? '-'}
          </Box>

          {poolDetail?.address && (
            <AddressWithLinkAndCopy
              address={poolDetail?.address}
              customChainId={poolDetail?.chainId}
              truncate
              showCopy
              iconDarkHover
              iconSize={14}
              iconSpace={4}
              sx={{
                typography: 'body2',
                color: 'text.secondary',
              }}
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 4,
          [theme.breakpoints.up('tablet')]: {
            flexDirection: 'column',
            gap: 0,
          },
        }}
      >
        <ApyTooltip
          apy={poolDetail?.apy}
          dailyApy={poolDetail?.dailyApy}
          weeklyApy={poolDetail?.weeklyApy}
          sx={{
            typography: 'h4',
            [theme.breakpoints.up('tablet')]: {
              typography: 'h4',
            },
          }}
        />
        <Box
          sx={{
            typography: 'body2',
            color: 'text.secondary',
          }}
        >
          APY
        </Box>
      </Box>
    </Box>
  );
};
