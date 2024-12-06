import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useUserOptions } from '../../../../components/UserOptionsProvider';

export interface OnlyV3ToggleProps {
  onlyV3: boolean;
  setOnlyV3: React.Dispatch<React.SetStateAction<boolean>>;
  sx?: BoxProps['sx'];
}

export const OnlyV3Toggle = ({ onlyV3, setOnlyV3, sx }: OnlyV3ToggleProps) => {
  const theme = useTheme();
  const { notSupportPMM } = useUserOptions();

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
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          [theme.breakpoints.up('tablet')]: {
            width: 97 + 97,
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: 0,
            pt: 4,
            pb: 5,
            borderRadius: 6,
            textAlign: 'center',
            typography: 'body2',
            whiteSpace: 'nowrap',
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
            flex: 1,
            width: 0,
            pt: 4,
            pb: 5,
            borderRadius: 6,
            textAlign: 'center',
            typography: 'body2',
            whiteSpace: 'nowrap',
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
          {notSupportPMM ? 'V2' : t`V2 & PMM`}
        </Box>
      </Box>
    </Box>
  );
};
