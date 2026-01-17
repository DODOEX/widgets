import { Box, BoxProps, useTheme, alpha } from '@dodoex/components';
import LoadMore from './LoadMore';
import SkeletonTable from '../widgets/PoolWidget/PoolList/components/SkeletonTable';
import { FailedList } from './List/FailedList';
import { EmptyList } from './List/EmptyList';

export default function Table({
  sx,
  children,
  empty,
  hasSearch,
  errorRefetch,
  loading,
  hasMore,
  loadMore,
  loadMoreLoading,
  ...props
}: BoxProps & {
  empty?: boolean;
  hasSearch?: boolean;
  errorRefetch?: () => void;
  loading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
}) {
  const theme = useTheme();
  const statusHeight = 320;
  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'background.paper',
        borderRadius: 12,
        ...sx,
      }}
      {...props}
    >
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          '& th': {
            py: 14,
            px: 24,
            typography: 'body1',
            textAlign: 'left',
            color: 'text.secondary',
          },
          '& td': {
            px: 24,
            py: 20,
          },
          '& thead': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: 'background.paper',
          },
          ...(!empty &&
            !loading &&
            !errorRefetch && {
              '& th:last-child, & td:last-child': {
                position: 'sticky',
                right: 0,
                zIndex: 1,
                backgroundColor: 'background.paper',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 1,
                  width: '1px',
                  boxShadow: `${theme.palette.mode === 'dark' ? '#1A1A1B' : alpha('#1A1A1B', 0.1)} -2px 0px 4px 0px`,
                },
              },
            }),
          '& tbody tr:hover td': {
            backgroundColor: 'hover.default',
          },
        }}
      >
        {loading ? (
          <SkeletonTable />
        ) : errorRefetch ? (
          <FailedList
            refresh={errorRefetch}
            sx={{
              height: statusHeight,
            }}
          />
        ) : empty ? (
          <EmptyList
            hasSearch={hasSearch}
            sx={{
              height: statusHeight,
            }}
          />
        ) : (
          children
        )}
      </Box>
      {!!loadMore && (
        <LoadMore
          loading={loadMoreLoading}
          hasMore={hasMore}
          onClick={loadMore}
        />
      )}
    </Box>
  );
}
