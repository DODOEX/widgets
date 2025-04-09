import { alpha, Box, BoxProps, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export interface MigrationTagProps {
  sx?: BoxProps['sx'];
  isRightTop?: boolean;
  isReverseColor?: boolean;
}

export const MigrationTag = ({
  sx,
  isRightTop,
  isReverseColor,
}: MigrationTagProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        padding: '2px 4px',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 4,
        background: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.main,
        fontSize: '10px',
        fontWeight: 600,
        lineHeight: '14px',

        ...(isRightTop
          ? {
              position: 'absolute',
              top: -14,
              right: 0,
              background: `linear-gradient(0deg, ${theme.palette.warning.main}1A 0%, ${theme.palette.warning.main}1A 100%), ${theme.palette.background.paper}`,
            }
          : undefined),

        ...(isReverseColor
          ? {
              background:
                theme.palette.mode === 'light'
                  ? 'linear-gradient(0deg, var(--label-warning, rgba(177, 86, 0, 0.10)) 0%, var(--label-warning, rgba(177, 86, 0, 0.10)) 100%), #FFF'
                  : 'linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(235, 141, 39, 0.1), rgba(235, 141, 39, 0.1))',
              zIndex: 1,
            }
          : undefined),

        ...sx,
      }}
    >
      <Trans>Migrate</Trans>
    </Box>
  );
};
