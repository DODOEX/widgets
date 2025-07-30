import { Box, BoxProps } from '@dodoex/components';
import { CurvePoolT } from '../types';
import { QuestionTooltip } from '../../../../components/Tooltip';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../../components/TokenLogo';
import BigNumber from 'bignumber.js';
import {
  formatExponentialNotation,
  formatPercentageNumber,
  formatTokenAmountNumber,
} from '../../../../utils/formatter';

export interface ParametersTableProps {
  poolDetail: CurvePoolT | undefined;
}

const Item = ({
  title,
  children,
  tip,
  sx,
}: {
  title: string;
  children: React.ReactNode;
  tip?: string;
  sx?: BoxProps['sx'];
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        py: 8,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box
          sx={{
            typography: 'body2',
            color: 'text.secondary',
          }}
        >
          {title}
        </Box>
        {tip && <QuestionTooltip title={tip} />}
      </Box>

      <Box
        sx={{
          typography: 'body1',
          color: 'text.primary',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export const ParametersTable = ({ poolDetail }: ParametersTableProps) => {
  return (
    <Box
      sx={{
        mt: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Item title="Daily USD volume">
        {poolDetail?.dailyVolumeUsd
          ? `$${formatExponentialNotation(new BigNumber(poolDetail?.dailyVolumeUsd || '0'))}`
          : '-'}
      </Item>
      <Item title="Liquidity utilization" tip="24h Volume/Liquidity ratio">
        {poolDetail?.liquidityUtilization
          ? `${formatPercentageNumber({
              input: new BigNumber(poolDetail?.liquidityUtilization || '0'),
              showDecimals: 2,
            })}`
          : '-'}
      </Item>

      <Box
        sx={{
          my: 10,
          width: '100%',
          height: '1px',
          backgroundColor: 'border.main',
        }}
      />

      <Item title="Fee">
        {poolDetail?.fee
          ? `${formatPercentageNumber({
              input: new BigNumber(poolDetail?.fee || '0').div(1e10),
              showDecimals: 2,
            })}`
          : '-'}
      </Item>

      <Item title="DAO fee">
        {poolDetail?.daoFee
          ? `${formatPercentageNumber({
              input: new BigNumber(poolDetail?.daoFee || '0'),
              showDecimals: 2,
            })}`
          : '-'}
      </Item>

      <Box
        sx={{
          my: 10,
          width: '100%',
          height: '1px',
          backgroundColor: 'border.main',
        }}
      />

      <Item
        title="Virtual price"
        tip="Measures pool growth; this is not a dollar value"
      >
        {poolDetail?.virtualPrice
          ? `${formatTokenAmountNumber({
              input: new BigNumber(poolDetail?.virtualPrice || '0').div(1e18),
              decimals: 18,
            })}`
          : '-'}
      </Item>

      <Box
        sx={{
          my: 10,
          width: '100%',
          height: '1px',
          backgroundColor: 'border.main',
        }}
      />

      <Item title="Pool/Token">
        {poolDetail?.address ? (
          <AddressWithLinkAndCopy
            address={poolDetail?.address}
            customChainId={poolDetail?.chainId}
            truncate
            showCopy
            iconDarkHover
            iconSize={14}
            iconSpace={4}
            sx={{
              typography: 'body1',
              color: 'text.primary',
            }}
          />
        ) : (
          '-'
        )}
      </Item>

      <Box
        sx={{
          my: 10,
          width: '100%',
          height: '1px',
          backgroundColor: 'border.main',
        }}
      />

      <Item title="Pool Type">
        {poolDetail?.poolType === 'plain'
          ? 'Stableswap-NG'
          : poolDetail?.poolType === 'meta'
            ? 'Plain pool'
            : '-'}
      </Item>

      <Box
        sx={{
          my: 10,
          width: '100%',
          height: '1px',
          backgroundColor: 'border.main',
        }}
      />

      <Item
        title="Coins"
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 12,
          }}
        >
          {poolDetail
            ? poolDetail.coins.map((coin) => (
                <Box
                  key={coin.address}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <TokenLogo
                    address={coin.address}
                    width={16}
                    height={16}
                    chainId={poolDetail?.chainId}
                    url={undefined}
                    cross={false}
                    noShowChain
                    noBorder
                    marginRight={0}
                  />
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  >
                    {coin.symbol}(Standard)
                  </Box>
                </Box>
              ))
            : '-'}
        </Box>
      </Item>
      <Item
        title="Pool Parameters:"
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 12,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                color: 'text.primary',
              }}
            >
              A:{poolDetail?.a ?? '-'}
            </Box>

            <QuestionTooltip title="Amplification coefficient chosen from fluctuation of prices around 1." />
          </Box>
          <Box
            sx={{
              typography: 'body1',
              color: 'text.primary',
            }}
          >
            Off Peg Multiplier:
            {poolDetail?.offpegFeeMultiplier
              ? new BigNumber(poolDetail?.offpegFeeMultiplier)
                  .div(1e10)
                  .toString()
              : '-'}
          </Box>
        </Box>
      </Item>
    </Box>
  );
};
