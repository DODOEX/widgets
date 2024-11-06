import { Box, Skeleton } from '@dodoex/components';

export function TokenSearchLoadingSkelton() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Skeleton
        variant="circular"
        width={32}
        sx={{
          mt: 8,
        }}
      />
      <Box
        sx={{
          ml: 8,
          flex: '1 0 auto',
        }}
      >
        <Skeleton
          sx={{
            borderRadius: 4,
          }}
          height={24}
        />
        <Skeleton
          sx={{
            mt: 4,
            borderRadius: 4,
          }}
          height={19}
          width={137}
        />
      </Box>
    </Box>
  );
}
