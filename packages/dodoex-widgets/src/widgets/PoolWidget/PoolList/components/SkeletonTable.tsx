import { Box, Skeleton } from '@dodoex/components';
import { increaseArray } from '../../../../utils/utils';

export default function SkeletonTable({ count = 4 }: { count?: number }) {
  return (
    <Box
      sx={{
        px: 20,
        width: '100%',
      }}
    >
      {increaseArray(count).map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={36}
          sx={{
            my: 20,
            borderRadius: 4,
          }}
        />
      ))}
    </Box>
  );
}
