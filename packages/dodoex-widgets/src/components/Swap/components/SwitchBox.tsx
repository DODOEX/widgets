import { ArrowBack } from '@dodoex/icons';
import { Box, useTheme, ButtonBase } from '@dodoex/components';

export function SwitchBox({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
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
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.input,
          border: `4px solid ${theme.palette.background.paper}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          color: 'text.secondary',
          ...(disabled || !onClick
            ? {}
            : {
                '&:hover': {
                  color: 'text.primary',
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
        <Box
          component={ArrowBack}
          sx={{
            width: 18,
          }}
        />
      </Box>
    </Box>
  );
}
