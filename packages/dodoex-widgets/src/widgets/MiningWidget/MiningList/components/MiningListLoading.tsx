import { Box, Skeleton, useTheme } from '@dodoex/components';
import { MiningCardLayout } from './MiningCardLayout';

export function MiningListLoading() {
  const theme = useTheme();

  return (
    <MiningCardLayout
      headerLeft={
        <Skeleton
          width={180}
          height={36}
          variant="rounded"
          sx={{
            borderRadius: 4,
          }}
        />
      }
      headerRight={null}
      center={
        <Box>
          <Skeleton
            width={60}
            height={22}
            variant="rounded"
            sx={{
              borderRadius: 4,
            }}
          />
          <Skeleton
            width={24}
            height={16}
            variant="rounded"
            sx={{
              mt: 2,
              borderRadius: 4,
            }}
          />
        </Box>
      }
      footer={
        <>
          <Skeleton
            width={180}
            height={32}
            variant="rounded"
            sx={{
              width: '100%',
              flex: '1 1 auto',
              borderRadius: 4,
            }}
          />
          <Box
            sx={{
              width: 4,
              flexShrink: 0,
            }}
          />
          <Skeleton
            width={180}
            height={32}
            variant="rounded"
            sx={{
              width: '100%',
              flex: '1 1 auto',
              borderRadius: 4,
            }}
          />
          <Box
            sx={{
              width: 4,
              flexShrink: 0,
            }}
          />
          <Skeleton
            width={180}
            height={32}
            variant="rounded"
            sx={{
              width: '100%',
              flex: '1 1 auto',
              borderRadius: 4,
            }}
          />
        </>
      }
    >
      <Box
        sx={{
          pr: 28,
          position: 'relative',
          '&:after': {
            position: 'absolute',
            content: '""',
            top: 8,
            right: 0,
            height: 24,
            width: '1px',
            backgroundColor: theme.palette.border.main,
          },
        }}
      >
        <Skeleton
          width={60}
          height={22}
          variant="rounded"
          sx={{
            borderRadius: 4,
          }}
        />
        <Skeleton
          width={24}
          height={16}
          variant="rounded"
          sx={{
            mt: 2,
            borderRadius: 4,
          }}
        />
      </Box>

      <Box
        sx={{
          ml: 28,
        }}
      >
        <Skeleton
          width={60}
          height={22}
          variant="rounded"
          sx={{
            borderRadius: 4,
          }}
        />
        <Skeleton
          width={24}
          height={16}
          variant="rounded"
          sx={{
            mt: 2,
            borderRadius: 4,
          }}
        />
      </Box>
    </MiningCardLayout>
  );
}
