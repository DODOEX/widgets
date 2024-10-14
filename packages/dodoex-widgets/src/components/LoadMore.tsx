import {
  Box,
  BoxProps,
  ButtonBase,
  RotatingIcon,
  useTheme,
} from '@dodoex/components';
import { ArrowRight } from '@dodoex/icons';
import { Trans } from '@lingui/macro';

export default function LoadMore({
  height = 64,
  sx,
  onClick,
  hasMore,
  loading,
}: {
  height?: number | string;
  sx?: BoxProps['sx'];
  onClick: () => void;
  hasMore?: boolean;
  loading?: boolean;
}) {
  const theme = useTheme();
  if (!hasMore) return null;
  return (
    <ButtonBase
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width: '100%',
        borderStyle: 'solid',
        borderColor: 'border.main',
        borderWidth: theme.spacing(1, 0, 0, 0),
        typography: 'body2',
        color: 'text.secondary',
        '&:hover': {
          color: 'text.primary',
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {loading ? (
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
  );
}
