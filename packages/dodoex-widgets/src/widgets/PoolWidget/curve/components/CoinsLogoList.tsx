import { Box, Tooltip, useTheme } from '@dodoex/components';
import TokenLogo from '../../../../components/TokenLogo';
import { CurvePoolT } from '../types';

export interface CoinsLogoListProps {
  pool?: CurvePoolT;
  // 是否分隔
  separate: boolean;
  // 是否换行
  wrap: boolean;
}

export const CoinsLogoList = ({ pool, separate, wrap }: CoinsLogoListProps) => {
  const theme = useTheme();

  if (!pool) {
    return null;
  }

  const coinsLength = pool.coins.length;

  // 限制最多8
  const displayCoins = pool.coins.slice(0, 8);
  const actualLength = displayCoins.length;

  const width = separate
    ? actualLength >= 6 && wrap
      ? 18
      : 24
    : actualLength > 3
      ? 24
      : 36;

  // 重叠排列的逻辑
  const getLayoutConfig = (count: number) => {
    if (!wrap) {
      return { rows: 1, cols: count, itemsPerRow: [count] };
    }

    if (count <= 3) {
      return { rows: 1, cols: count, itemsPerRow: [count] };
    } else if (count === 4) {
      return { rows: 2, cols: 2, itemsPerRow: [2, 2] };
    } else if (count === 5) {
      return { rows: 2, cols: 3, itemsPerRow: [3, 2] };
    } else if (count === 6) {
      return { rows: 2, cols: 3, itemsPerRow: [3, 3] };
    } else if (count === 7) {
      return { rows: 2, cols: 4, itemsPerRow: [4, 3] };
    } else if (count === 8) {
      return { rows: 2, cols: 4, itemsPerRow: [4, 4] };
    }
    return { rows: 1, cols: count, itemsPerRow: [count] };
  };

  const layout = getLayoutConfig(actualLength);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {Array.from({ length: layout.rows }, (_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              rowIndex === 1 && actualLength === 5 ? 'flex-start' : 'center',
            gap: separate ? 2 : 0,
            [theme.breakpoints.up('tablet')]: {
              gap: separate ? 4 : 0,
            },
          }}
        >
          {displayCoins
            .slice(
              layout.itemsPerRow
                .slice(0, rowIndex)
                .reduce((sum, count) => sum + count, 0),
              layout.itemsPerRow
                .slice(0, rowIndex + 1)
                .reduce((sum, count) => sum + count, 0),
            )
            .map((coin, coinIndex) => (
              <Tooltip
                key={coin.address}
                title={coin.symbol}
                placement="top"
                onlyHover
                leaveDelay={100}
                sx={{
                  maxWidth: 240,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: coinIndex,
                    position: 'relative',
                    marginLeft: separate ? 0 : coinIndex > 0 ? '-8px' : 0,
                  }}
                >
                  <TokenLogo
                    address={coin.address}
                    width={width}
                    height={width}
                    chainId={pool.chainId}
                    url={undefined}
                    cross={false}
                    noShowChain
                    noBorder
                    marginRight={0}
                  />
                </Box>
              </Tooltip>
            ))}
        </Box>
      ))}
    </Box>
  );
};
