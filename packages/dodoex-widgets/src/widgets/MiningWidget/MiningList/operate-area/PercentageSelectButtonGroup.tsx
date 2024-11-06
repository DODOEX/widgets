import { alpha, Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { usePrevious } from '../../hooks/usePrevious';

const percentageOptional = [0.25, 0.5, 0.75, 1];

export function PercentageSelectButtonGroup({
  currentValue,
  onClick,
  sx,
}: {
  currentValue: string | number | BigNumber | null;
  onClick: (v: number) => void;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { isMobile } = useWidgetDevice();

  const [selectedP, setSelectedP] = useState<number | null>(null);
  const updateTimesRef = useRef(0);
  useEffect(() => {
    if (!currentValue) {
      setSelectedP(null);
      return;
    }

    updateTimesRef.current += 1;
    if (updateTimesRef.current >= 2) {
      setSelectedP(null);
      updateTimesRef.current = 0;
    }
  }, [currentValue]);

  const prevValue = usePrevious(currentValue);
  useEffect(() => {
    if (prevValue === currentValue && selectedP === 1) {
      updateTimesRef.current = 1;
    }
  }, [currentValue, prevValue, selectedP]);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: isMobile ? 10 : 14,
        gridTemplateColumns: `repeat(${percentageOptional.length}, 1fr)`,
        ...sx,
      }}
    >
      {percentageOptional.map((p) => {
        const selected = p === selectedP;
        return (
          <ButtonBase
            key={p}
            sx={{
              typography: 'h6',
              borderRadius: 4,
              padding: theme.spacing(4, 0),
              width: '100%',
              color: 'text.secondary',
              backgroundColor: 'background.paperDarkContrast',
              '&:hover': {
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.text.primary, 0.2),
              },
              '&.selected, &:focus': {
                color: '#fff',
                backgroundColor: isLight
                  ? theme.palette.primary.main
                  : alpha(theme.palette.text.primary, 0.4),
              },
            }}
            onClick={() => {
              if (!selected) {
                updateTimesRef.current = 0;
                setSelectedP(p);
                onClick(p);
              }
            }}
            className={selected ? 'selected' : undefined}
          >
            {p * 100}%
          </ButtonBase>
        );
      })}
    </Box>
  );
}
