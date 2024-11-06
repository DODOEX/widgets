import { Tabs, TabsGroup, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import { MiningTabType } from '../../types';

export function MiningStatusTabSelect({
  value,
  onChange,
}: {
  value: MiningTabType;
  onChange: (value: MiningTabType) => void;
}) {
  const { i18n } = useLingui();
  const theme = useTheme();

  const tabs = useMemo(
    () => [
      { key: 'active', value: i18n._(`Active`) },
      {
        key: 'ended',
        value: i18n._(`Ended`),
      },
    ],
    [i18n],
  );

  return (
    <Tabs
      value={value}
      onChange={(_, value) => {
        onChange(value as MiningTabType);
      }}
      sx={{
        ml: 'auto',
      }}
    >
      <TabsGroup
        tabs={tabs}
        variant="rounded"
        tabsListSx={{
          borderBottom: 'none',
          minHeight: 32,
          '& .MuiTabs-indicator': {
            opacity: 0,
          },
          flexGrow: 1,
          [theme.breakpoints.up('tablet')]: {
            flexGrow: 0,
          },
          gap: 4,
        }}
        tabSx={{
          mb: 0,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: '50%',
          extTransform: 'none',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.palette.border.main,
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: theme.palette.border.main,
            color: theme.palette.text.primary,
          },
          color: theme.palette.text.primary,
          typography: 'body2',
          textTransform: 'capitalize',
          padding: theme.spacing(5.5, 18.5, 5.5, 17.5),
          minWidth: 79,
          minHeight: 32,
          fontWeight: 600,
        }}
      />
    </Tabs>
  );
}
