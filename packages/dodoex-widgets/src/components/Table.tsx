import { Box, BoxProps } from '@dodoex/components';
import LoadMore from './LoadMore';

export default function Table({
  sx,
  children,
  hasMore,
  loadMore,
  loadMoreLoading,
  ...props
}: BoxProps & {
  hasMore?: boolean;
  loadMore?: () => void;
  loadMoreLoading?: boolean;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
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
            pt: 12,
            pb: 6,
            px: 24,
            typography: 'body1',
            textAlign: 'left',
            color: 'text.secondary',
          },
          '& td': {
            px: 0,
            py: 0,
          },
          '& thead': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: 'transparent',
          },
        }}
      >
        {children}
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
