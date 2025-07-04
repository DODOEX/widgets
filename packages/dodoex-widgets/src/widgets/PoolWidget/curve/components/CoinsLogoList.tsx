import { Box, Tooltip } from '@dodoex/components';
import TokenLogo from '../../../../components/TokenLogo';
import { CurvePoolT } from '../types';

export interface CoinsLogoListProps {
  pool: CurvePoolT;
  // 是否分隔
  separate: boolean;
  // 是否换行
  wrap: boolean;
}

export const CoinsLogoList = ({ pool, separate, wrap }: CoinsLogoListProps) => {
  const coinsLength = pool.coins.length;
  const width = separate
    ? coinsLength >= 6 && wrap
      ? 18
      : 24
    : coinsLength >= 3
      ? 24
      : 36;

  if (separate) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'gap',
          gap: 4,
        }}
      >
        {pool.coins.map((coin) => (
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
          </Tooltip>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'gap',
        gap: -8,
      }}
    >
      {pool.coins.map((coin) => (
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
        </Tooltip>
      ))}
    </Box>
  );
};
