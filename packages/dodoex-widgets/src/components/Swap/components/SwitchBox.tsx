import { ArrowBack } from '@dodoex/icons';
import { HoverOpacity, Box, useTheme, BaseButton } from '@dodoex/components';

export function SwitchBox({ onClick }: { onClick: () => void }) {
  const theme = useTheme();
  return (
    <HoverOpacity
      sx={{
        width: '100%',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <Box
        component={BaseButton}
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
        }}
      >
        <Box
          component={ArrowBack}
          sx={{
            width: 18,
            color: 'text.secondary',
          }}
        />
      </Box>
    </HoverOpacity>
  );
}
