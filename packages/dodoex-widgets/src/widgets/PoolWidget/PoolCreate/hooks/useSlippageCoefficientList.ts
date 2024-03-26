import { useMemo } from 'react';
import { RadioButtonT, Version } from '../types';
import { StateProps } from '../reducer';
import { alpha, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';

export const getDefaultSlippageCoefficientList = ({
  selectedVersion,
}: {
  selectedVersion: StateProps['selectedVersion'];
}) => {
  if (selectedVersion === Version.pegged) {
    return ['0.0001', '0.0005', '0.002'];
  }
  return ['0.5', '0.01', '1'];
};

export function useSlippageCoefficientList({
  selectedVersion,
}: {
  selectedVersion: StateProps['selectedVersion'];
}) {
  const theme = useTheme();

  return useMemo<Array<RadioButtonT>>(() => {
    const tagBackgroundColor = theme.palette.background.paperDarkContrast;
    const tagColor = theme.palette.text.disabled;
    const recommendColor = theme.palette.purple.main;
    const recommendBackgroundColor = alpha(recommendColor, 0.1);
    if (selectedVersion === Version.pegged) {
      return [
        {
          tag: t`Low`,
          description: t`Suitable for stablecoins with price fluctuations within 0.5%`,
          value: '0.0001',
          title: 'K=0.0001',
          tagBackgroundColor: recommendBackgroundColor,
          tagColor: recommendColor,
        },
        {
          tag: t`Medium`,
          description: t`Suitable for stablecoins with price fluctuations within 2%`,
          value: '0.0005',
          title: 'K=0.0005',
          tagBackgroundColor,
          tagColor,
        },
        {
          tag: t`High`,
          description: t`Suitable for stablecoins with price fluctuations within 10%`,
          value: '0.002',
          title: 'K=0.002',
          tagBackgroundColor,
          tagColor,
        },
      ];
    }
    return [
      {
        tag: t`Medium`,
        description: t`Suitable for most situations.`,
        value: '0.5',
        title: 'K=0.5',
        tagBackgroundColor,
        tagColor,
      },
      {
        tag: t`Low`,
        description: t`Results in a relatively fixed price.`,
        value: '0.01',
        title: 'K=0.01',
        tagBackgroundColor,
        tagColor,
      },
      {
        tag: t`High`,
        description: t`Results in a more volatile price.`,
        value: '1',
        title: 'K=1',
        tagBackgroundColor: recommendBackgroundColor,
        tagColor: recommendColor,
      },
    ];
  }, [selectedVersion, theme.palette]);
}
