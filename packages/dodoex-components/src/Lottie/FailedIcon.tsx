import { FailedList } from '@dodoex/icons';
import { Box, BoxProps } from '../Box';

export default function FailedIcon({ sx }: { sx?: BoxProps['sx'] }) {
  return (
    <Box
      component={FailedList}
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
