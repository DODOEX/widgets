import { Box, BoxProps, Tooltip, HoverOpacity } from '@dodoex/components';
import { QuestionBorder } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { TokenInfo } from '../../../../hooks/Token';
import { formatApy } from '../../../../utils';

export default function PoolApyTooltip({
  chainId,
  baseToken,
  quoteToken,
  apy,
  hasQuote,
  hasMining,
  sx,
  children,
}: {
  chainId: number;
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  apy:
    | {
        transactionBaseApy?: string | null;
        transactionQuoteApy?: string | null;
        miningBaseApy?: string | null;
        miningQuoteApy?: string | null;
        metromMiningApy?: string | null;
      }
    | undefined
    | null;
  hasQuote: boolean;
  hasMining: boolean;
  sx?: BoxProps['sx'];
  children?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) {
  if (!baseToken) return null;
  const hoverData: Array<{
    token?: TokenInfo;
    transactionApy?: string | null;
    miningApy?: string | null;
    metromMiningApy?: string | null;
  }> = hasQuote
    ? [
        {
          token: baseToken,
          transactionApy: apy?.transactionBaseApy,
          miningApy: apy?.miningBaseApy,
        },
        {
          token: quoteToken,
          transactionApy: apy?.transactionQuoteApy,
          miningApy: apy?.miningQuoteApy,
        },
      ]
    : [
        {
          transactionApy: apy?.transactionBaseApy,
          miningApy: apy?.miningBaseApy,
          metromMiningApy: apy?.metromMiningApy,
        },
      ];
  return (
    <Tooltip
      children={
        children ?? (
          <HoverOpacity
            component={QuestionBorder}
            sx={{
              width: 15,
              height: 15,
              ...sx,
            }}
          />
        )
      }
      title={
        <Box
          sx={{
            minWidth: 236,
          }}
        >
          {hoverData.map((item, index) => (
            <Box
              key={item.token?.address ?? 1}
              sx={{
                mt: index === 0 ? 0 : 20,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  typography: 'body2',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.token ? (
                    <>
                      <TokenLogo
                        width={14}
                        height={14}
                        marginRight={4}
                        address={item.token.address}
                        url={item.token.logoURI}
                        chainId={chainId}
                        noShowChain
                      />
                      {item.token.symbol}
                    </>
                  ) : (
                    <>
                      <TokenLogoPair
                        tokens={[baseToken, quoteToken as TokenInfo]}
                        width={14}
                        mr={4}
                        chainId={chainId}
                      />
                      {baseToken.symbol}/{quoteToken?.symbol}
                    </>
                  )}
                </Box>
                <Box>
                  {formatApy(
                    new BigNumber(item.transactionApy ?? 0)
                      .plus(item.miningApy ?? 0)
                      .plus(item.metromMiningApy ?? 0),
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                <span>
                  <Trans>LP Fee</Trans>
                </span>
                <span>
                  {item.transactionApy
                    ? formatApy(new BigNumber(item.transactionApy))
                    : '-'}
                </span>
              </Box>
              {hasMining ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  <span>
                    <Trans>MT Fee</Trans>
                  </span>
                  <span>
                    {item.miningApy
                      ? formatApy(new BigNumber(item.miningApy))
                      : '-'}
                  </span>
                </Box>
              ) : (
                ''
              )}
              {item.metromMiningApy && Number(item.metromMiningApy) > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                >
                  <span>
                    <Trans>Mining</Trans>
                  </span>
                  <span>
                    {item.metromMiningApy
                      ? formatApy(new BigNumber(item.metromMiningApy))
                      : '-'}
                  </span>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      }
    />
  );
}
