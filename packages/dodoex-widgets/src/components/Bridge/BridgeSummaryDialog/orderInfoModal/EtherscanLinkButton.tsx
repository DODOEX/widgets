import { Box, useTheme } from '@dodoex/components';
import { getEtherscanPage } from '../../../../utils';

export function EtherscanLinkButton({
  chainId,
  address,
  children,
}: {
  chainId: number;
  address: string | null;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      component="a"
      href={getEtherscanPage(`tx/${address}`, chainId)}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.text.primary,
        },
        display: 'flex',
        alignItems: 'center',
        typography: 'body2',
      }}
    >
      {children}

      <Box
        component="svg"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{
          marginLeft: 6,
          width: 16,
          height: 17,
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.33333 3.83333V13.1667H12.6667V8.5H14V13.1667C14 13.9 13.4 14.5 12.6667 14.5H3.33333C2.59333 14.5 2 13.9 2 13.1667V3.83333C2 3.1 2.59333 2.5 3.33333 2.5H8V3.83333H3.33333ZM9.33333 3.83333V2.5H14V7.16667H12.6667V4.77333L6.11333 11.3267L5.17333 10.3867L11.7267 3.83333H9.33333Z"
          fill="currentColor"
        />
      </Box>
    </Box>
  );
}
