import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { StateProps } from '../reducer';

export interface RateToggleProps {
  mint1: StateProps['mint1'];
  mint2: StateProps['mint2'];
  handleRateToggle: () => void;
  sx?: BoxProps['sx'];
}

export const RateToggle = ({
  mint1,
  mint2,
  handleRateToggle,
  sx,
}: RateToggleProps) => {
  const theme = useTheme();

  const isSorted = true;

  return (
    <Box
      component={ButtonBase}
      onClick={handleRateToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        borderRadius: 8,
        backgroundColor: theme.palette.border.main,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          [theme.breakpoints.up('tablet')]: {
            width: 'auto',
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: '50%',
            px: 12,
            py: 4,
            borderRadius: 7,
            textAlign: 'center',
            typography: 'h6',
            whiteSpace: 'nowrap',
            ...(isSorted
              ? {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                }
              : {
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                }),
          }}
        >
          {isSorted ? mint1?.symbol : mint2?.symbol}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: '50%',
            px: 12,
            py: 4,
            borderRadius: 7,
            textAlign: 'center',
            typography: 'h6',
            whiteSpace: 'nowrap',
            ...(!isSorted
              ? {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                }
              : {
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                }),
          }}
        >
          {isSorted ? mint2?.symbol : mint1?.symbol}
        </Box>
      </Box>
    </Box>
  );
};
