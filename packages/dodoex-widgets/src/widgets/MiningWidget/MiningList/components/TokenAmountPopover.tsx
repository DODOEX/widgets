import { Box, BoxProps, Tooltip, useTheme } from '@dodoex/components';
import { JSXElementConstructor, ReactElement } from 'react';
import TokenLogoSimple from '../../../../components/TokenLogoSimple';

export function TokenAmountPopover({
  trigger,
  tokenList,
  minWidth = '190px',
  sx,
}: {
  trigger: ReactElement<any, string | JSXElementConstructor<any>>;
  tokenList: {
    symbolEle: string | JSX.Element | undefined;
    address: string | undefined;
    rightContent: string;
  }[];
  minWidth?: string;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <Box>
          {tokenList.map((token, index) => {
            const { symbolEle, address, rightContent } = token;
            return (
              <Box
                key={index}
                sx={{
                  minWidth,
                  display: 'flex',
                  alignItems: 'center',
                  mt: index > 0 ? 4 : undefined,
                  color: theme.palette.text.primary,
                  typography: 'h6',
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                  }}
                >
                  <TokenLogoSimple
                    width={20}
                    height={20}
                    address={address}
                    url={''}
                  />
                </Box>
                <Box sx={{ mx: 6, fontWeight: 600 }}>{symbolEle}</Box>
                <Box
                  sx={{
                    ml: 'auto',
                    fontWeight: 400,
                    wordBreak: 'break-all',
                  }}
                >
                  {rightContent}
                </Box>
              </Box>
            );
          })}
        </Box>
      }
      sx={sx}
    >
      {trigger}
    </Tooltip>
  );
}
