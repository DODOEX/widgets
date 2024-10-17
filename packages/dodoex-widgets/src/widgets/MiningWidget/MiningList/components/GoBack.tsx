import { Box, BoxProps, HoverOpacity, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { merge } from 'lodash';
import { ReactComponent as BackIcon } from './arrow_back.svg';

export default function GoBack({
  sx,
  onClick,
}: {
  sx?: BoxProps['sx'];
  onClick?: () => void;
}) {
  const { i18n } = useLingui();
  const theme = useTheme();

  return (
    <HoverOpacity
      onClick={onClick}
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
        <BackIcon />
      </Box>
      {i18n._('Go back')}
    </HoverOpacity>
  );
}
