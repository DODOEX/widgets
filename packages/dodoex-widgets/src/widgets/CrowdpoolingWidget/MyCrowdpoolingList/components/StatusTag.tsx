import { Box, alpha, useTheme } from '@dodoex/components';
import { CPStatusType } from '../../types';

interface StatusTagProps {
  status: CPStatusType;
}

export function Tag({
  status,
  children,
}: {
  status: CPStatusType;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const getPurple = () => theme.palette.purple.main;
  const getGreen = () => theme.palette.success.main;

  const colors: Record<CPStatusType, { bg: string; color: string }> = {
    waiting: {
      bg: alpha(getPurple(), 0.1),
      color: getPurple(),
    },
    processing: {
      bg: alpha(getGreen(), 0.1),
      color: getGreen(),
    },
    ended: {
      bg: theme.palette.background.paperDarkContrast,
      color: theme.palette.text.secondary,
    },
    settling: {
      bg: alpha(getPurple(), 0.1),
      color: getPurple(),
    },
    calming: {
      bg: alpha(getPurple(), 0.1),
      color: getPurple(),
    },
  };

  const style = colors[status] || colors.waiting;

  return (
    <Box
      sx={{
        padding: '4px 8px',
        borderRadius: 4,
        textAlign: 'center',
        backgroundColor: style.bg,
        color: style.color,
        typography: 'h6',
        display: 'inline-block',
      }}
    >
      {children}
    </Box>
  );
}

interface StatusTagProps {
  status: CPStatusType;
}

export function StatusTag({ status }: StatusTagProps) {
  const statusLabels: Record<CPStatusType, string> = {
    waiting: 'Waiting',
    processing: 'Processing',
    ended: 'Ended',
    settling: 'Settling',
    calming: 'Calming',
  };

  return <Tag status={status}>{statusLabels[status] || status}</Tag>;
}
