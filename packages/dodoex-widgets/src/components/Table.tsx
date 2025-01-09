import { Box, BoxProps, useTheme, alpha } from '@dodoex/components';
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
  const theme = useTheme();
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
            backgroundColor: 'transparent',
          },
          '& th:last-child, & td:last-child': {
            position: 'sticky',
            zIndex: 1,
            backgroundColor: 'transparent',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 1,
              width: '1px',
              boxShadow: `${alpha(
                theme.palette.text.primary,
                0.1,
              )} -2px 0px 4px 0px`,
            },
          },
          '& tbody tr:hover td': {
            backgroundColor: 'hover.default',
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
