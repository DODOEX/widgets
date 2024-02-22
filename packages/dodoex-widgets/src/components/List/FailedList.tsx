import { Box, BoxProps, HoverOpacity, FailedIcon } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { merge } from 'lodash';

export function FailedList({
  sx,
  refresh,
}: {
  sx?: BoxProps['sx'];
  refresh: () => void;
}) {
  return (
    <Box
      sx={merge(
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        sx,
      )}
    >
      <FailedIcon
        sx={{
          mb: 12,
        }}
      />
      <Box
        sx={{
          typography: 'body2',
          width: 252,
          textAlign: 'center',
        }}
      >
        <Box
          component="span"
          sx={{
            color: 'text.secondary',
          }}
        >
          <Trans>
            Something went wrong…
            <HoverOpacity
              component="span"
              color="primary.main"
              weak
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => {
                refresh();
              }}
            >
              <Trans>Refresh again</Trans>
            </HoverOpacity>
          </Trans>
        </Box>
      </Box>
    </Box>
  );
}
