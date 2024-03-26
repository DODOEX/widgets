import { Box, BoxProps, QuestionTooltip } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
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
      }
    | undefined
    | null;
  hasQuote: boolean;
  hasMining: boolean;
  sx?: BoxProps['sx'];
}) {
  if (!baseToken) return null;
  const hoverData: Array<{
    token?: TokenInfo;
    transactionApy?: string | null;
    miningApy?: string | null;
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
        },
      ];
  return (
    <QuestionTooltip
      sx={sx}
      title={
        <Box
          sx={{
            width: 236,
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
                    new BigNumber(item.transactionApy ?? 0).plus(
                      item.miningApy ?? 0,
                    ),
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
            </Box>
          ))}
        </Box>
      }
    />
  );
}
