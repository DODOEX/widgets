import { Box, useTheme } from '@dodoex/components';
import { ReactComponent as ChainFlip } from './ChainFlip.svg';
import { ReactComponent as ThorSwap } from './ThorSwap.svg';
import { ReactComponent as ZUUO } from './ZUUO.svg';

export interface CompareRouteProps {
  feeUSD: string | null;
}

const compareRouteList = [
  {
    id: 'thorswap',
    name: 'ThorSwap',
    ICON: <ThorSwap />,
    width: 41,
    height: 49,
  },
  {
    id: 'ZUNO',
    name: 'ZUNO',
    selected: true,
    ICON: <ZUUO />,
    width: 48,
    height: 51,
  },
  {
    id: 'ChainFlip',
    name: 'ChainFlip',
    ICON: <ChainFlip />,
    width: 41,
    height: 48,
  },
];

export const CompareRoute = ({ feeUSD }: CompareRouteProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        px: 8,
        py: 12,
        backgroundColor: 'background.tag',
        borderRadius: 8,
      }}
    >
      {compareRouteList.map((item) => {
        return (
          <Box
            key={item.id}
            sx={{
              flexGrow: 1,
              flexBasis: '100%',
              flexShrink: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              px: 2,
              pb: 2,
              borderRadius: 8,
              background: item.selected
                ? theme.palette.primary.main
                : 'transparent',
            }}
          >
            <Box
              sx={{
                color: item.selected
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.main,
                typography: 'h6',
                lineHeight: '16px',
                px: 8,
                py: 4,
                textAlign: 'center',
              }}
            >
              {item.selected ? <>Cheapest</> : <>&nbsp;</>}
            </Box>
            <Box
              sx={{
                p: 11,
                border: `solid 1px ${theme.palette.border.main}`,
                borderRadius: 8,
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                {item.name}
              </Box>
              <Box
                sx={{
                  pt: 20,
                  typography: 'h6',
                  color: theme.palette.text.secondary,
                }}
              >
                Fee Cost
              </Box>
              <Box
                sx={{
                  pt: 4,
                  typography: 'body2',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {item.selected ? (feeUSD !== null ? `$${feeUSD}` : '-') : '$-'}
                {item.selected ? null : (
                  <Box
                    component="span"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    (no route)
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: item.width,
                  height: item.height,
                }}
              >
                {item.ICON}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
