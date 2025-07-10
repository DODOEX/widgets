import { Box, useTheme } from '@dodoex/components';
import { QuestionTooltip } from '../../../../components/Tooltip';

export interface SlippageBonusProps {}

export const SlippageBonus = (props: SlippageBonusProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        px: 12,
        height: 36,
        borderRadius: 8,
        border: `1px solid ${theme.palette.border.main}`,
      }}
    >
      <Box
        sx={{
          typography: 'body2',
          fontWeight: 500,
          lineHeight: '19px',
          color: theme.palette.text.secondary,
          textTransform: 'capitalize',
        }}
      >
        Slippage Bonus (incl. pricing)
        <QuestionTooltip title="Bonus comes as an advantage from current coin prices which usually appears for coins which are low in balance" />
      </Box>
      <Box
        sx={{
          typography: 'body2',
          fontWeight: 600,
          lineHeight: '19px',
          color: theme.palette.success.main,
        }}
      >
        -
      </Box>
    </Box>
  );
};
