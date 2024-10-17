import { Box, BoxProps, Select, useTheme } from '@dodoex/components';
import { CopyTooltipToast } from '../../../../components/CopyTooltipToast';
import { ReactComponent as ShareIcon } from './share-dark.svg';

export interface ShareModeSelectProps {
  shareUrl: string | undefined;
  sx?: BoxProps['sx'];
}

export const ShareModeSelect = ({ shareUrl, sx }: ShareModeSelectProps) => {
  const theme = useTheme();

  return (
    <Select
      px={0}
      renderValue={() => {
        return (
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
        );
      }}
      options={[
        {
          key: '0',
          value: <CopyTooltipToast size={24} copyText={shareUrl} />,
        },
      ]}
    />
  );
};
