import {
  Box,
  BoxProps,
  useTheme,
  alpha,
  ButtonBase,
  RotatingIcon,
} from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { Trans } from '@lingui/macro';

export default function LiquidityTable({
  sx,
  children,
  empty,
  loading,
  hasMore,
  loadMore,
  loadMoreLoading,
  ...props
}: BoxProps & {
  empty?: boolean;
  loading?: boolean;
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
            p: 24,
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
            !loading && {
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
        }}
      >
        {children}
      </Box>
      {hasMore && (
        <ButtonBase
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 64,
            width: '100%',
            borderStyle: 'solid',
            borderColor: 'border.main',
            borderWidth: theme.spacing(1, 0, 0, 0),
            typography: 'body2',
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
          onClick={loadMore}
        >
          {loadMoreLoading ? (
            <RotatingIcon />
          ) : (
            <>
              <Trans>Load more</Trans>
              <Box
                component={ArrowRight}
                sx={{
                  transform: 'rotate(90deg)',
                }}
              />
            </>
          )}
        </ButtonBase>
      )}
    </Box>
  );
}
