import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { getSubPeggedVersionMap } from '../hooks/useVersionList';
import { StateProps } from '../reducer';

export function PriceModeCard({
  chainId,
  isWaiting,
  selectedSubPeggedVersion,
  cardBg,
}: {
  chainId: number | undefined;
  isWaiting: boolean;
  selectedSubPeggedVersion: StateProps['selectedSubPeggedVersion'];
  cardBg: string;
}) {
  const theme = useTheme();
  const subPeggedVersionMap = getSubPeggedVersionMap(chainId);

  return (
    <Box
      sx={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: cardBg,
        width: '50%',
        opacity: isWaiting ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          typography: 'h5',
          fontWeight: 600,
        }}
      >
        {isWaiting
          ? '-'
          : selectedSubPeggedVersion
            ? (subPeggedVersionMap[selectedSubPeggedVersion]?.title ?? '-')
            : '-'}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mt: 8,
        }}
      >
        <Trans>Can the pool price be adjusted?</Trans>
      </Box>
    </Box>
  );
}
