import { Box, BoxProps, HoverOpacity } from '@dodoex/components';
import { ReactComponent as FailedListIcon } from '../../assets/failed-list.svg';
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
      <Box
        component={FailedListIcon}
        sx={{
          display: 'inline-block',
          width: 60,
          height: 60,
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
