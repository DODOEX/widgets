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
        px: 20,
        ...sx,
      }}
      {...props}
    >
      <Box
        component="table"
        sx={{
          borderCollapse: 'separate',
          borderSpacing: '0px 8px',
          width: '100%',
          '& th': {
            px: 24,
            pt: 12,
            pb: 4,
            typography: 'body2',
            lineHeight: '16px',
            textAlign: 'left',
            color: 'text.secondary',
          },
          '& td': {
            px: 24,
            py: 12,
          },
          '& thead': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background: '#F4E8D0',
          },
          '& tbody tr td': {
            backgroundColor: '#FFF',
            '&:first-child': {
              borderRadius: theme.spacing(8, 0, 0, 8),
            },
            '&:last-child': {
              borderRadius: theme.spacing(0, 8, 8, 0),
            },
          },
          '& th:last-child, & td:last-child': {
            position: 'sticky',
            right: 0,
            zIndex: 1,
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
