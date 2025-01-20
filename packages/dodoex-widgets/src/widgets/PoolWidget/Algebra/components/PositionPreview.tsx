import { Box } from '@dodoex/components';
import { ReactNode } from 'react';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { formatTokenAmountNumber } from '../../../../utils';
import RangeBadge from './Badge/RangeBadge';
import { PositionSelectedRangePreview } from './PositionSelectedRangePreview';
import { AutoColumn, LightCard, RowBetween, RowFixed } from './widgets';
import { TokenInfo } from '../../../../hooks/Token';

export const PositionPreview = ({
  token0,
  token1,
  liquidity,
  amount0,
  amount1,
  price,
  tickLower,
  tickUpper,
  title,
  inRange,
}: {
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  liquidity: number | undefined;
  amount0: string | undefined;
  amount1: string | undefined;
  title?: ReactNode;
  price: string | undefined;
  tickLower: number | undefined;
  tickUpper: number | undefined;
  inRange: boolean;
}) => {
  const removed = !!liquidity && liquidity === 0;

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ gap: 4 }}>
        <RowFixed>
          <TokenLogoPair
            tokens={
              token0 && token1
                ? [{ address: token0.address }, { address: token1.address }]
                : []
            }
            mr={8}
          />
          <Box
            sx={{
              typography: 'h5',
            }}
          >
            {token0?.symbol} / {token1?.symbol}
          </Box>
        </RowFixed>
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <LightCard>
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <TokenLogo
                address={token0?.address ?? ''}
                chainId={token0?.chainId}
                noShowChain
                width={32}
                height={32}
                marginRight={0}
              />
              <Box
                sx={{
                  ml: 8,
                }}
              >
                {token0?.symbol}
              </Box>
            </RowFixed>
            <RowFixed>
              <Box
                sx={{
                  mr: 8,
                }}
              >
                {formatTokenAmountNumber({
                  input: amount0,
                  decimals: token0?.decimals,
                })}
              </Box>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TokenLogo
                address={token1?.address ?? ''}
                chainId={token1?.chainId}
                noShowChain
                width={32}
                height={32}
                marginRight={0}
              />
              <Box ml="8px">{token1?.symbol}</Box>
            </RowFixed>
            <RowFixed>
              <Box mr="8px">
                {formatTokenAmountNumber({
                  input: amount1,
                  decimals: token1?.decimals,
                })}
              </Box>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
        {/* <RowBetween>
          <Box>
            <Trans>Fee tier</Trans>
          </Box>
          <Box>
            {formatPercentageNumber({
              input: position?.pool?.fee / (BIPS_BASE * 100),
            })}
          </Box>
        </RowBetween> */}
      </LightCard>

      {!!token0 && !!token1 && !!price && !!tickLower && !!tickUpper && (
        <PositionSelectedRangePreview
          title={title}
          token0={token0}
          token1={token1}
          token0Price={price}
          tickLower={tickLower}
          tickUpper={tickUpper}
        />
      )}
    </AutoColumn>
  );
};
