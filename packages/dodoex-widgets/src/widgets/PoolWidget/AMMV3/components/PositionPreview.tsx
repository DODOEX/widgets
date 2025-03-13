import { CLMM } from '@dodoex/api';
import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { ReactNode } from 'react';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { formatTokenAmountNumber } from '../../../../utils';
import { getPoolFeeRate } from '../../utils';
import { PositionI } from '../types';
import { AMMV3 } from './Badge/AMMV3';
import RangeBadge from './Badge/RangeBadge';
import { PositionSelectedRangePreview } from './PositionSelectedRangePreview';
import { AutoColumn, LightCard, RowBetween, RowFixed } from './widgets';

export const PositionPreview = ({
  position,
  title,
  inRange,
  ticksAtLimit,
}: {
  position: PositionI;
  title?: ReactNode;
  inRange: boolean;
  ticksAtLimit: { [bound: string]: boolean | undefined };
}) => {
  const { chainId } = useWalletInfo();

  const {
    poolInfo: { mintA, mintB, feeRate },
    liquidity,
    amountA,
    amountB,
  } = position;

  const removed = liquidity.isZero();

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ gap: 4 }}>
        <RowFixed>
          <TokenLogoPair
            tokens={[{ address: mintA.address }, { address: mintB.address }]}
            mr={8}
          />
          <Box
            sx={{
              typography: 'h5',
            }}
          >
            {mintA.symbol} / {mintB.symbol}
          </Box>
        </RowFixed>
        <AMMV3
          sx={{
            ml: 'auto',
          }}
        />
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <LightCard>
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <TokenLogo
                address={mintA.address}
                chainId={mintA.chainId}
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
                {mintA.symbol}
              </Box>
            </RowFixed>
            <RowFixed>
              <Box
                sx={{
                  mr: 8,
                }}
              >
                {formatTokenAmountNumber({
                  input: amountA,
                  decimals: mintA.decimals,
                })}
              </Box>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TokenLogo
                address={mintB.address}
                chainId={mintB.chainId}
                noShowChain
                width={32}
                height={32}
                marginRight={0}
              />
              <Box ml="8px">{mintB.symbol}</Box>
            </RowFixed>
            <RowFixed>
              <Box mr="8px">
                {formatTokenAmountNumber({
                  input: amountB,
                  decimals: mintB.decimals,
                })}
              </Box>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
        <RowBetween>
          <Box>
            <Trans>Fee tier</Trans>
          </Box>
          <Box>
            {getPoolFeeRate({
              type: CLMM,
              lpFeeRate: feeRate,
              mtFeeRate: 0,
            })}
          </Box>
        </RowBetween>
      </LightCard>

      <PositionSelectedRangePreview
        position={position}
        title={title}
        ticksAtLimit={ticksAtLimit}
      />
    </AutoColumn>
  );
};
