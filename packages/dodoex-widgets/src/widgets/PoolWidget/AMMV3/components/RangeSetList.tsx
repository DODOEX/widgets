import { alpha, Box, ButtonBase, useTheme } from '@dodoex/components';
import { useState } from 'react';

const rangeSetList = [
  {
    value: 0.03,
    title: 'Narrow',
  },
  {
    value: 0.08,
    title: 'Standard',
  },
  {
    value: 0.15,
    title: 'Wide',
  },
  {
    value: 1,
    title: 'Full',
  },
];

export interface RangeSetListProps {
  onSelect: (value: number) => void;
}

export const RangeSetList = (props: RangeSetListProps) => {
  const theme = useTheme();

  const [selectedRange, setSelectedRange] = useState<number | null>(null);

  return (
    <Box
      sx={{
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.border.main,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        alignSelf: 'stretch',
      }}
    >
      {rangeSetList.map((range, index) => {
        return (
          <Box
            component={ButtonBase}
            onClick={() => {
              setSelectedRange(range.value);
              props.onSelect(range.value);
            }}
            key={range.value}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              px: 20,
              py: 12,
              gap: 8,
              flexBasis: '50%',
              flexGrow: 1,
              borderRight:
                index % 2 === 0
                  ? `1px solid ${theme.palette.border.main}`
                  : 'none',
              borderBottom:
                index <= 1 ? `1px solid ${theme.palette.border.main}` : 'none',
              [theme.breakpoints.up('tablet')]: {
                flexBasis: '25%',
                borderRight:
                  index === rangeSetList.length - 1
                    ? 'none'
                    : `1px solid ${theme.palette.border.main}`,
                borderBottom: 'none',
              },
              backgroundColor:
                selectedRange === range.value
                  ? alpha('#7BF179', 0.1)
                  : 'transparent',
              '&:hover': {
                backgroundColor: alpha('#7BF179', 0.1),
              },
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {range.title}
            </Box>
            <Box
              sx={{
                typography: 'h6',
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {range.value === 1 ? '∞' : `+-${range.value * 100}%`}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
