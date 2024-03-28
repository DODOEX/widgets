import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { RadioButtonIcon } from './RadioButtonIcon';

export default function RadioButton({
  title,
  subTitle,
  description,
  selected,
  onClick,
  children,
  sx,
  titleSx,
}: {
  title: string;
  subTitle?: React.ReactNode;
  description: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  sx?: BoxProps['sx'];
  titleSx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';
  return (
    <Box
      sx={{
        p: 20,
        backgroundColor: theme.palette.background.tag,
        borderWidth: 1,
        borderColor: selected ? theme.palette.primary.main : 'transparent',
        borderStyle: 'solid',
        borderRadius: 12,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
        ...sx,
      }}
      component={ButtonBase}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          typography: 'caption',
          color: selected
            ? isLight
              ? theme.palette.text.primary
              : theme.palette.primary.main
            : theme.palette.text.primary,
          ...titleSx,
        }}
      >
        {title}
        {subTitle}
        <RadioButtonIcon selected={selected} />
      </Box>

      <Box
        sx={{
          mt: 8,
          typography: 'body2',
          width: '100%',
          textAlign: 'left',
          color: selected
            ? isLight
              ? theme.palette.text.primary
              : theme.palette.primary.main
            : theme.palette.text.secondary,
        }}
      >
        {description}
      </Box>
      {children}
    </Box>
  );
}
