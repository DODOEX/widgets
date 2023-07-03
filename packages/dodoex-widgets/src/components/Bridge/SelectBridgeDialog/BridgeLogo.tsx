/* eslint-disable no-nested-ternary */
import { Box, BoxProps, useTheme } from '@dodoex/components';
import { BridgeStep } from '../../../hooks/Bridge/useFetchRoutePriceBridge';

export function BridgeLogo({
  size = 'medium',
  toolDetails,
  nameMarginLeft = 4,
  logoMarginLeft = 0,
  nameSx,
}: {
  size: 'small' | 'medium' | 'large';
  toolDetails: BridgeStep['toolDetails'] | null | undefined;
  nameMarginLeft?: number;
  logoMarginLeft?: number;
  nameSx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  if (!toolDetails || !toolDetails.logoURI || !toolDetails.name) {
    return null;
  }

  const { logoURI, name } = toolDetails;
  return (
    <>
      <Box
        component="img"
        src={logoURI}
        alt={name}
        sx={{
          marginLeft: logoMarginLeft,
          width: size === 'large' ? 24 : 16,
          height: size === 'large' ? 24 : 16,
        }}
      />
      <Box
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
          marginLeft: nameMarginLeft,
          typography: {
            mobile:
              size === 'small' ? 'h6' : size === 'medium' ? 'body2' : 'caption',
            tablet:
              size === 'small'
                ? 'body2'
                : size === 'medium'
                ? 'body2'
                : 'caption',
          },
          ...nameSx,
        }}
      >
        {name}
      </Box>
    </>
  );
}
