import { Box, Skeleton, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { formatApr } from '../utils';
import { TextAndDesc } from './widgets';
import { useLingui } from '@lingui/react';
import { Tooltip } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export function APRWrapper({ children }: { children: React.ReactNode }) {
  const { i18n } = useLingui();
  const theme = useTheme();

  return (
    <Tooltip
      title={i18n._('APR = Reward Token Value per Year / TVL')}
      sx={{
        ml: 4,
        mt: -2,
      }}
    >
      <TextAndDesc
        text={children}
        sx={{
          pr: 28,
          minWidth: 37,
          position: 'relative',
          '&:after': {
            position: 'absolute',
            content: '""',
            top: 8,
            right: 0,
            height: 24,
            width: '1px',
            backgroundColor: theme.palette.border.main,
          },
        }}
      >
        {i18n._('APR')}
      </TextAndDesc>
    </Tooltip>
  );
}

export function APRSection({
  apr,
  size,
}: {
  apr?: BigNumber;
  size: 'small' | 'medium' | 'large';
}) {
  const { i18n } = useLingui();
  const theme = useTheme();

  const aprText = useMemo(() => {
    if (apr !== undefined) {
      return (
        <>
          {formatApr(apr)}
          {!apr.isFinite() && (
            <Tooltip
              title={i18n._(
                'The newly created mining pool can start counting APR after depositing any liquidity.',
              )}
              sx={{
                typography:
                  size === 'large' ? 'h4' : size === 'small' ? 'body2' : 'h5',
                color: theme.palette.text.secondary,
              }}
            >
              <Box>
                <Trans>Fresh Mining</Trans>
              </Box>
            </Tooltip>
          )}
        </>
      );
    }
    return (
      <Skeleton
        variant="rounded"
        width={120}
        height={size === 'large' ? 33 : size === 'small' ? 19 : 24}
      />
    );
  }, [apr, i18n, size, theme.palette.text.secondary]);

  return <>{aprText}</>;
}
