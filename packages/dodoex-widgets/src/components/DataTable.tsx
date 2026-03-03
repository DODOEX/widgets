import { Box, BoxProps, useTheme, alpha } from '@dodoex/components';
import LoadMore from './LoadMore';
import { EmptyList } from './List/EmptyList';

export interface Column {
  key: string;
  label: string;
  sx?: BoxProps['sx'];
}

interface DataTableProps {
  columns: Column[];
  datas: Array<Record<string, any>>;
  loading?: boolean;
  loadMore?: () => void;
  sx?: BoxProps['sx'];
  sxHeader?: BoxProps['sx'];
}

export function DataTable({
  columns,
  datas,
  loading,
  loadMore,
  sx,
  sxHeader,
}: DataTableProps) {
  const theme = useTheme();

  if (loading && datas.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          ...sx,
        }}
      >
        Loading...
      </Box>
    );
  }

  if (!loading && datas.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          ...sx,
        }}
        className="data-table_empty-wrapper"
      >
        <EmptyList />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        ...sx,
      }}
    >
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <Box component="thead">
          <Box component="tr">
            {columns.map((column) => (
              <Box
                key={column.key}
                component="th"
                sx={{
                  textAlign: 'left',
                  fontWeight: 500,
                  color: 'text.secondary',
                  py: 12,
                  px: 20,
                  borderBottom: `1px solid ${theme.palette.border.main}`,
                  ...sxHeader,
                  ...column.sx,
                }}
              >
                {column.label}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {datas.map((row) => (
            <Box
              key={row.key}
              component="tr"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              {columns.map((column) => (
                <Box
                  key={column.key}
                  component="td"
                  sx={{
                    py: 16,
                    px: 20,
                    borderBottom: `1px solid ${theme.palette.border.main}`,
                    color: 'text.primary',
                  }}
                >
                  {row[column.key]}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
      {loadMore && (
        <Box sx={{ mt: 20, display: 'flex', justifyContent: 'center' }}>
          <LoadMore onClick={loadMore} hasMore={true} loading={loading} />
        </Box>
      )}
    </Box>
  );
}
