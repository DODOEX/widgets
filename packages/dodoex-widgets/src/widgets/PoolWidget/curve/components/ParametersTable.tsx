import { Box, BoxProps } from '@dodoex/components';
import { CurvePoolT } from '../types';
import { QuestionTooltip } from '../../../../components/Tooltip';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../../components/TokenLogo';

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
      <Item title="Daily USD volume">200.33M</Item>
      <Item title="Liquidity utilization" tip="24h Volume/Liquidity ratio">
        138.93%
      </Item>

      <Box
        sx={{
          my: 10,
          width: '100%',
          height: '1px',
          backgroundColor: 'border.main',
        }}
      />

      <Item title="Fee">0.02%</Item>
      <Item title="DAO fee">0.02%</Item>

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
        1.00440296
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

      <Item title="Pool Type">Stableswap-NG</Item>
      <Item title="Basepool">
        <AddressWithLinkAndCopy
          address="0xDddfBCc76166d741c2dfa6b6a90769df398b9969"
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
      </Item>
      <Item title="Registry">
        <AddressWithLinkAndCopy
          address="0xDddfBCc76166d741c2dfa6b6a90769df398b9969"
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
          {poolDetail?.coins.map((coin) => (
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
          ))}
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
              A:200
            </Box>

            <QuestionTooltip title="Amplification coefficient chosen from fluctuation of prices around 1." />
          </Box>
          <Box
            sx={{
              typography: 'body1',
              color: 'text.primary',
            }}
          >
            Off Peg Multiplier:5
          </Box>
        </Box>
      </Item>
    </Box>
  );
};
