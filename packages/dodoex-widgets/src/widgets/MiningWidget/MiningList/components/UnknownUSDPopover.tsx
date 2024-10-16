import { Box, Tooltip, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { ReactComponent as WarningIcon } from './warn.svg';
import { uniq } from 'lodash';

type Props = {
  tokenSymbolList: (string | undefined)[];
  disableMobileClick?: boolean;
  iconWidth?: number;
};

export function UnknownUSDPopover({
  disableMobileClick,
  tokenSymbolList,
  iconWidth = 16,
}: Props) {
  const theme = useTheme();
  const { i18n } = useLingui();

  return (
    <Tooltip
      title={i18n._(
        'Insufficient market depth to capture the dollar value of [ {{symbols}} ]',
        {
          symbols: uniq(tokenSymbolList)
            .filter((symbol) => symbol !== undefined)
            .join(', '),
        },
      )}
      placement="top"
      sx={{
        typography: 'h6',
        fontWeight: 600,
      }}
    >
      <Box
        sx={{
          width: iconWidth,
          height: iconWidth,
          color: theme.palette.custom.status.yellow.secondary,
          ml: 4,
        }}
        component={WarningIcon}
      />
    </Tooltip>
  );
}
