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
        pt: 12,
        px: 20,
        pb: 20,
        ...sx,
      }}
      {...props}
    >
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 4px', // 第一个值0表示列间距，第二个值4px表示行间距
          '& th': {
            py: 12,
            px: 24,
            typography: 'body2',
            textAlign: 'left',
            color: 'text.secondary',
            backgroundColor: 'background.paper',
          },
          '& th:first-of-type': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          },
          '& th:last-of-type': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
          },
          '& td': {
            px: 24,
            py: 20,
            backgroundColor: 'background.paper',
          },
          // '& td:first-of-type': {
          //   borderTopLeftRadius: '8px',
          //   borderBottomLeftRadius: '8px',
          // },
          // '& td:last-of-type': {
          //   borderTopRightRadius: '8px',
          //   borderBottomRightRadius: '8px',
          // },
          '& thead': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            '&::after': {
              content: '""',
              display: 'table-row',
              height: '0',
            },
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
