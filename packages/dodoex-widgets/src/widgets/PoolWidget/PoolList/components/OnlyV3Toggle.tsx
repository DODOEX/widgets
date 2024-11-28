import { Box, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';

export interface OnlyV3ToggleProps {
  onlyV3: boolean;
  setOnlyV3: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OnlyV3Toggle = ({ onlyV3, setOnlyV3 }: OnlyV3ToggleProps) => {
  const theme = useTheme();

  return (
    <Box
      component={ButtonBase}
      onClick={() => setOnlyV3(!onlyV3)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 8,
        backgroundColor: theme.palette.border.main,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            px: 16,
            py: 4,
            borderRadius: 6,
            textAlign: 'center',
            typography: 'body2',
            ...(onlyV3
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
          {t`V3`}
        </Box>
        <Box
          sx={{
            px: 12,
            py: 4,
            borderRadius: 6,
            textAlign: 'center',
            typography: 'body2',
            ...(!onlyV3
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
          {t`V2 & PMM`}
        </Box>
      </Box>
    </Box>
  );
};
