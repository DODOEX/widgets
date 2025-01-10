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
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: 'border.main',
        mx: 24,
        mb: 24,
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
