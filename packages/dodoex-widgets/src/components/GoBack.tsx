import { HoverOpacity, Box, BoxProps, useTheme } from '@dodoex/components';
import { merge } from 'lodash';
import { ArrowBack } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { useRouterStore } from '../router';

export default function GoBack({
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
          '& > svg': {
            mr: 10,
          },
        },
        sx,
      )}
    >
      <Box
        sx={{
          color: theme.palette.text.secondary,
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: theme.palette.border.main,
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.paper,
          mr: 6,
        }}
      >
        <ArrowBack />
      </Box>
      <Trans>Go back</Trans>
    </HoverOpacity>
  );
}
