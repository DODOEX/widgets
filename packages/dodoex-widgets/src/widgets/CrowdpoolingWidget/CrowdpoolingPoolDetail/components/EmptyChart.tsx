import { Box, EmptyDataIcon } from '@dodoex/components';
import { t } from '@lingui/macro';

export default function EmptyChart({
  height,
  text,
}: {
  height?: number | string;
  text?: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height || 261,
      }}
    >
      <EmptyDataIcon
        sx={{
          mb: 20,
        }}
      />
      <Box
        sx={{
          typography: 'body2',
          color: 'text.secondary',
        }}
      >
        {text || t`No data available`}
      </Box>
    </Box>
  );
}
