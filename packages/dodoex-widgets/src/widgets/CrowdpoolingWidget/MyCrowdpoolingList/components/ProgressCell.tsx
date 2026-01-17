import { Box, useTheme } from '@dodoex/components';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { TokenInfo } from '../../../../hooks/Token';

interface ProgressCellProps {
  progress: number;
  poolQuote: string;
  quoteToken: TokenInfo;
}

export function ProgressCell({
  progress,
  poolQuote,
  quoteToken,
}: ProgressCellProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minWidth: 110,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 7,
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 2,
            mr: 4,
            position: 'relative',
            backgroundColor: theme.palette.background.paperDarkContrast,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              backgroundColor: 'primary.main',
              width: `${Math.min(progress, 100)}%`,
              maxWidth: '100%',
            },
          }}
        />
        <Box sx={{ typography: 'body1' }}>{progress}%</Box>
      </Box>
      <Box
        sx={{
          typography: 'body2',
          color: 'text.secondary',
        }}
      >
        Raised{' '}
        {formatTokenAmountNumber({
          input: poolQuote,
          decimals: quoteToken.decimals,
          showPrecisionDecimals: 2,
        })}{' '}
        {quoteToken.symbol}
      </Box>
    </Box>
  );
}
