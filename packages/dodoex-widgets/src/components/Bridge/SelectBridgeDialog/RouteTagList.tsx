import { alpha, Box, BoxProps, useTheme } from '@dodoex/components';
import { Lock as LockIcon } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { BridgeStep } from '../../../hooks/Bridge/useFetchRoutePriceBridge';

export interface RouteTag {
  type: 'best-price' | 'no-approve';
  toolDetails?: BridgeStep['toolDetails'] | null;
}

/**
 * 路径 tag 列表
 */
export function RouteTagList({ routeTagList }: { routeTagList: RouteTag[] }) {
  const theme = useTheme();

  const commonStyles: BoxProps['sx'] = {
    typography: 'h6',
    borderRadius: 4,
    px: 8,
    py: 4,
    ml: 8,
  };

  return (
    <>
      {routeTagList.map((tag) => {
        if (tag.type === 'no-approve') {
          return (
            <Box
              key={tag.type}
              sx={{
                ...commonStyles,
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paperContrast,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LockIcon
                style={{
                  color: theme.palette.text.primary,
                  width: 14,
                  height: 14,
                }}
              />
              <span
                style={{
                  marginLeft: 4,
                }}
              >
                <Trans>Unapproved</Trans>
              </span>
            </Box>
          );
        }

        if (tag.type === 'best-price') {
          return (
            <Box
              key={tag.type}
              sx={{
                ...commonStyles,
                color: theme.palette.success.main,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
              }}
            >
              <Trans>Best offer</Trans>
            </Box>
          );
        }

        return null;
      })}
    </>
  );
}
