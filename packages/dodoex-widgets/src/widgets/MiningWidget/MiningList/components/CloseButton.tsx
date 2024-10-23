import { Box, ButtonBase, useTheme } from '@dodoex/components';

export function CloseButton({ onClick }: { onClick?: () => void }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 24,
        height: 24,
        borderRadius: '50%',
        borderColor: theme.palette.border.main,
        borderWidth: 1,
        borderStyle: 'solid',
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.text.primary,
        },
      }}
      component={ButtonBase}
      onClick={onClick}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M12.8897 4.36345L9.25313 8L12.8897 11.6366L11.6775 12.8487L8.04095 9.21218L4.4044 12.8487L3.19221 11.6366L6.82876 8L3.19221 4.36345L4.4044 3.15127L8.04095 6.78782L11.6775 3.15127L12.8897 4.36345Z"
          fill="currentColor"
        />
      </svg>
    </Box>
  );
}
