import { Box, useTheme } from '@dodoex/components';

export interface CardContainerProps {
  title: string;
  children: React.ReactNode;
}

export const CardContainer = ({ title, children }: CardContainerProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 24,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          p: 20,
          borderRadius: theme.spacing(12, 12, 0, 0),
          backgroundColor: theme.palette.background.paper,
          typography: 'h5',
          fontWeight: 600,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.border.main}`,
        }}
      >
        {title}
      </Box>
      {children}
    </Box>
  );
};
