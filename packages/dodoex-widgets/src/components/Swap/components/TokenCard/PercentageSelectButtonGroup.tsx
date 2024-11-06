import { Box, BoxProps, useTheme, ButtonBase, alpha } from '@dodoex/components';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';

const percentageOptional = [0.25, 0.5, 0.75, 1];

export function PercentageSelectButtonGroup({
  value,
  onChange,
  sx,
}: {
  value: number;
  onChange?: (val: number) => void;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { isMobile } = useWidgetDevice();

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
        const selected = p === value;
        return (
          <ButtonBase
            key={p}
            disabled={!onChange}
            sx={{
              typography: 'h6',
              borderRadius: 4,
              padding: theme.spacing(4, 0),
              width: '100%',
              color: 'text.secondary',
              backgroundColor: 'background.paperDarkContrast',
              '&:disabled': {
                color: 'text.disabled',
              },
              '&:not(:disabled)&:hover': {
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
              if (!selected && onChange) {
                onChange(p);
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
