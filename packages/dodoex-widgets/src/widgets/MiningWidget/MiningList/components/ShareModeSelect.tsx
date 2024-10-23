import { Box, BoxProps, Tooltip, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { CopyTooltipToast } from '../../../../components/CopyTooltipToast';
import { ReactComponent as ShareIcon } from './share-dark.svg';

export interface ShareModeSelectProps {
  shareUrl: string | undefined;
  sx?: BoxProps['sx'];
}

export const ShareModeSelect = ({ shareUrl, sx }: ShareModeSelectProps) => {
  const theme = useTheme();

  return (
    <Tooltip
      arrow={false}
      leaveDelay={300}
      title={
        <CopyTooltipToast
          size={24}
          copyText={shareUrl}
          componentProps={{
            sx: {
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            },
          }}
        >
          {t`Copy link`}
        </CopyTooltipToast>
      }
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Box
          component={ShareIcon}
          sx={{
            cursor: 'pointer',
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
            },
            ...sx,
          }}
        />
      </Box>
    </Tooltip>
  );
};
