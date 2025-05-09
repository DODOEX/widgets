import { Box, BoxProps, HoverOpacity, useTheme } from '@dodoex/components';
import { ArrowBack } from '@dodoex/icons';
import { merge } from 'lodash';
import { useRouterStore } from '../router';

export default function SquaredGoBack({
  sx,
  onClick,
}: {
  sx?: BoxProps['sx'];
  onClick?: () => void;
}) {
  const theme = useTheme();
  return (
    <HoverOpacity
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        useRouterStore.getState().back();
      }}
      sx={merge(
        {
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
        },
        sx,
      )}
    >
      <Box
        sx={{
          color: theme.palette.text.secondary,
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: theme.palette.border.main,
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <ArrowBack />
      </Box>
    </HoverOpacity>
  );
}
