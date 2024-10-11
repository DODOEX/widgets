import { NoFound, NoToken } from '@dodoex/icons';
import { Box, BoxProps } from '../Box';
export default function EmptyDataIcon({
  hasSearch,
  sx,
}: {
  hasSearch?: boolean;
  sx?: BoxProps['sx'];
}) {
  return (
    <Box
      component={hasSearch ? NoFound : NoToken}
      viewBox="0 0 60 60"
      sx={{
        display: 'inline-block',
        width: 105,
        height: 105,
        ...sx,
      }}
    />
  );
}
