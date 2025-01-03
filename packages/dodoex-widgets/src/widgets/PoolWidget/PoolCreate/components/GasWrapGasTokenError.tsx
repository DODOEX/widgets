import { alpha, Box, useTheme } from '@dodoex/components';
import { isGasWrapGasTokenPair } from '../utils';
import { TokenInfo } from '../../../../hooks/Token';
import { Trans } from '@lingui/macro';

export interface ErrorAlertProps {
  chainId: number;
  baseToken: TokenInfo | null;
  quoteToken: TokenInfo | null;
}

/**
 * Creating a fund pool does not support gasToken
 * @param props
 * @returns
 */
export const GasWrapGasTokenError = ({
  chainId,
  baseToken,
  quoteToken,
}: ErrorAlertProps) => {
  const theme = useTheme();

  const isGasWrapGasError = isGasWrapGasTokenPair({
    chainId,
    baseToken,
    quoteToken,
  });

  if (!isGasWrapGasError) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 12,
        py: 8,
        px: 12,
        borderRadius: 8,
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
        textAlign: 'center',
        typography: 'h6',
        fontWeight: 500,
      }}
    >
      <Trans>
        {baseToken?.symbol}-{quoteToken?.symbol} is not supported. Please select
        another pair.
      </Trans>
    </Box>
  );
};
