import { Box, BoxProps, Slider } from '@dodoex/components';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

export function SliderPercentageCard({
  disabled,
  value,
  onChange,
  sx,
  hideNumberInput,
}: {
  disabled?: boolean;
  value: number;
  onChange: (val: number) => void;
  sx?: BoxProps['sx'];
  hideNumberInput?: boolean;
}) {
  return (
    <Box
      sx={{
        ...(!hideNumberInput && {
          p: 20,
          backgroundColor: 'background.input',
          borderRadius: 12,
        }),
        ...sx,
      }}
    >
      {!hideNumberInput && (
        <NumberInput
          value={String(value)}
          onChange={(str) => onChange(+str)}
          readOnly
          readonlyShowSuffix
          suffix={
            <Box
              sx={{
                typography: 'h2',
              }}
            >
              %
            </Box>
          }
          sx={{
            mt: 12,
            '& input': {
              pl: 0,
              typography: 'h1',
            },
          }}
        />
      )}
      <Box
        sx={{
          mt: hideNumberInput ? 0 : 20,
        }}
      >
        <Slider
          marks={marks}
          step={1}
          disabled={disabled}
          value={value}
          onChange={(evt, newVal) => onChange(newVal as number)}
          tooltip={hideNumberInput ? '%' : undefined}
        />
      </Box>
    </Box>
  );
}
