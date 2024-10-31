import { alpha, Box, Tooltip, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export const GSPPairRiskWarning = () => {
  const theme = useTheme();

  return (
    <Tooltip
      placement="top-end"
      leaveDelay={100}
      title={
        <Box
          sx={{
            maxWidth: 240,
            color: theme.palette.warning.main,
            typography: 'h6',
            fontWeight: 500,
            '&>a': {
              textDecoration: 'underline',
              color: theme.palette.warning.main,
            },
            '&>a:hover': {
              color: alpha(theme.palette.warning.main, 0.5),
            },
          }}
        >
          <Trans>
            The creator of the liquidity pool can adjust the liquidity
            distribution by modifying the market-making price parameters.{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.dodoex.io/en/product/pmm-algorithm"
            >
              Learn more
            </a>
          </Trans>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 4,
          px: 8,
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          typography: 'h6',
          fontWeight: 500,
          lineHeight: '16px',
          cursor: 'help',
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
            d="M8.00008 10.6666C8.18897 10.6666 8.3473 10.6027 8.47508 10.4749C8.60286 10.3471 8.66675 10.1888 8.66675 9.99992C8.66675 9.81103 8.60286 9.6527 8.47508 9.52492C8.3473 9.39714 8.18897 9.33325 8.00008 9.33325C7.81119 9.33325 7.65286 9.39714 7.52508 9.52492C7.3973 9.6527 7.33341 9.81103 7.33341 9.99992C7.33341 10.1888 7.3973 10.3471 7.52508 10.4749C7.65286 10.6027 7.81119 10.6666 8.00008 10.6666ZM7.33341 7.99992H8.66675V4.66659H7.33341V7.99992ZM8.00008 14.6666C6.45564 14.2777 5.18064 13.3916 4.17508 12.0083C3.16953 10.6249 2.66675 9.08881 2.66675 7.39992V3.33325L8.00008 1.33325L13.3334 3.33325V7.39992C13.3334 9.08881 12.8306 10.6249 11.8251 12.0083C10.8195 13.3916 9.54453 14.2777 8.00008 14.6666ZM8.00008 13.2666C9.15564 12.8999 10.1112 12.1666 10.8667 11.0666C11.6223 9.96659 12.0001 8.74436 12.0001 7.39992V4.24992L8.00008 2.74992L4.00008 4.24992V7.39992C4.00008 8.74436 4.37786 9.96659 5.13341 11.0666C5.88897 12.1666 6.84453 12.8999 8.00008 13.2666Z"
            fill="currentColor"
          />
        </svg>
        <Trans>Disclaimer</Trans>
      </Box>
    </Tooltip>
  );
};
