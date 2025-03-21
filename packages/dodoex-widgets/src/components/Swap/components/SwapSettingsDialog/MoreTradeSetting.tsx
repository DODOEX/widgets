import { HoverOpacity, alpha, Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export default function MoreTradeSetting({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <HoverOpacity
      weak
      sx={{
        display: show ? 'flex' : 'none',
        alignItems: 'center',
        position: 'absolute',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        p: theme.spacing(8, 20),
        fontWeight: 600,
        borderRadius: 20,
        border: `solid 1px ${theme.palette.border.main}`,
        backgroundColor: '#743B2E',
        boxShadow: `0px 8px 16px 0px ${alpha(
          theme.palette.mode === 'light' ? '#FFF' : '#000',
          0.1,
        )}`,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        gap: 4,
      }}
      onClick={onClick}
    >
      <Trans>More trade settings</Trans>
      <Box
        component="svg"
        width={25}
        height={24}
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{
          color: 'text.secondary',
        }}
      >
        <path
          d="M12.5 19L6.5 13L7.9 11.6L12.5 16.175L17.1 11.6L18.5 13L12.5 19ZM12.5 13L6.5 6.99998L7.9 5.59998L12.5 10.175L17.1 5.59998L18.5 6.99998L12.5 13Z"
          fill="currentColor"
        />
      </Box>
    </HoverOpacity>
  );
}
