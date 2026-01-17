import { useLingui } from '@lingui/react';
import { CrowdpoolingTabType } from '../../types';

export default function NavTabs({
  value,
  onChange,
}: {
  value: CrowdpoolingTabType;
  onChange: (value: CrowdpoolingTabType) => void;
}) {
  const { i18n } = useLingui();

  const tabs = [
    {
      key: 'all' as const,
      value: i18n._('All'),
    },
    {
      key: 'my' as const,
      value: i18n._('My CPs'),
    },
  ];

  return tabs;
}
