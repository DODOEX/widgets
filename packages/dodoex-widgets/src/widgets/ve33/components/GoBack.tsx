import { Box, ButtonBase, useTheme } from '@dodoex/components';

export interface GoBackProps {
  onClick: () => void;
}

export const GoBack = ({ onClick }: GoBackProps) => {
  const theme = useTheme();

  return (
    <Box
      component={ButtonBase}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 6,
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.text.primary,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.paperDarkContrast,
          border: `1px solid ${theme.palette.border.main}`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M13.3333 7.33341H5.21996L8.94663 3.60675L7.99996 2.66675L2.66663 8.00008L7.99996 13.3334L8.93996 12.3934L5.21996 8.66675H13.3333V7.33341Z"
            fill="currentColor"
          />
        </svg>
      </Box>

      <Box
        sx={{
          typography: 'body1',
        }}
      >
        Go back
      </Box>
    </Box>
  );
};
