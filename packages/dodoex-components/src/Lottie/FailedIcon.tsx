import { Box, BoxProps } from '../Box';
import { useFailedListBodyMovin } from './hooks/useFailedListBodyMovin';

export default function FailedIcon({ sx }: { sx?: BoxProps['sx'] }) {
  const ref = useFailedListBodyMovin();

  return (
    <Box
      ref={ref}
      sx={{
        display: 'inline-block',
        width: 105,
        height: 105,
        ...sx,
      }}
    />
  );
}
