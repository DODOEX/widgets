import { alpha, Box, ButtonBase, useTheme } from '@dodoex/components';
import subtractSmSvg from '../assets/subtract-sm.svg';
import subtractSvg from '../assets/subtract.svg';

function SwapInfoCard({
  path,
  title,
  value,
  description,
  descriptionVisibleInMobile = false,
  onClick,
}: {
  path: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description: React.ReactNode;
  descriptionVisibleInMobile?: boolean;
  onClick?: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexBasis: '50%',
        flexShrink: 1,
        backgroundImage: `url(${subtractSmSvg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto 107px',
        backgroundPosition: 'top left',
        height: 107,
        pt: 16,
        pl: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        gap: 8,
        [theme.breakpoints.up('desktop')]: {
          flexBasis: 191,
          flexShrink: 0,
          pt: 0,
          pl: 24,
          backgroundImage: `url(${subtractSvg})`,
          backgroundSize: 'auto 191px',
          height: 191,
          justifyContent: 'center',
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          typography: 'h6',
          color: theme.palette.text.primary,
          fontWeight: 600,
          [theme.breakpoints.up('desktop')]: {
            typography: 'body2',
            fontWeight: 600,
          },
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          typography: 'caption',
          color: theme.palette.text.primary,
          fontWeight: 600,
          [theme.breakpoints.up('desktop')]: {
            typography: 'h3',
            fontWeight: 600,
          },
        }}
      >
        {value}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          color: theme.palette.text.secondary,
          fontWeight: 500,
          display: descriptionVisibleInMobile ? 'block' : 'none',
          [theme.breakpoints.up('desktop')]: {
            mt: 8,
            display: 'block',
          },
        }}
      >
        {description}
      </Box>
      <Box
        component={ButtonBase}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          backgroundColor: '#000',
          color: theme.palette.background.paper,
          [theme.breakpoints.up('desktop')]: {
            width: 48,
            height: 48,
            borderRadius: 24,
          },
          '&:hover': {
            color: alpha(theme.palette.background.paper, 0.8),
          },
        }}
      >
        <Box
          component="svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          sx={{
            width: 16,
            height: 16,
            [theme.breakpoints.up('desktop')]: {
              width: 24,
              height: 24,
            },
          }}
        >
          {path}
        </Box>
      </Box>
    </Box>
  );
}

export default SwapInfoCard;
