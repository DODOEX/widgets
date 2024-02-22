import { Box, BoxProps } from '../Box';
import { useNoFoundBodyMovin } from './hooks/useNoFoundBodyMovin';
import { useNoResultBodyMovin } from './hooks/useNoResultBodyMovin';

export default function EmptyDataIcon({
  hasSearch,
  sx,
}: {
  hasSearch?: boolean;
  sx?: BoxProps['sx'];
}) {
  const noFoundBodyMovinRef = useNoFoundBodyMovin();
  const noResultBodyMovinRef = useNoResultBodyMovin();

  return (
    <Box
      ref={hasSearch ? noFoundBodyMovinRef : noResultBodyMovinRef}
      sx={{
        display: 'inline-block',
        width: 105,
        height: 105,
        ...sx,
      }}
    />
  );
}
