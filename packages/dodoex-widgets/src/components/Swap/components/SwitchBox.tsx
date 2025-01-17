import { ArrowBack, Plus } from '@dodoex/icons';
import { Box, useTheme, ButtonBase } from '@dodoex/components';

export function SwitchBox({
  onClick,
  disabled: disabledProps,
  plus,
}: {
  onClick?: () => void;
  disabled?: boolean;
  plus?: boolean;
}) {
  const theme = useTheme();
  const size = 36;
  const disabled = disabledProps || plus || !onClick;
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
      }}
    >
      <Box
        component={ButtonBase}
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.paper,
          border: `4px solid ${theme.palette.background.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          color: 'text.secondary',
          ...(disabled
            ? {
                cursor: 'inherit',
              }
            : {
                '&:hover': {
                  color: 'text.primary',
                },
                '&:focus-visible': {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    display: 'block',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    width: size - 8,
                    height: size - 8,
                    border: 'solid 1px',
                    borderColor: 'text.primary',
                  },
                },
              }),
        }}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          if (onClick) {
            onClick();
          }
        }}
      >
        {plus ? (
          <Box
            component={Plus}
            sx={{
              width: 18,
              height: 18,
            }}
          />
        ) : (
          <Box
            component={ArrowBack}
            sx={{
              width: 18,
              height: 18,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
