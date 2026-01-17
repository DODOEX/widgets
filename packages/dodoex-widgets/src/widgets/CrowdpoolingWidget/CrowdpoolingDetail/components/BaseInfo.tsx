import { Box, LoadingSkeleton, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { CPDetail } from '../../types';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import { QuestionTooltip } from '../../../../components/Tooltip';

interface BaseInfoProps {
  detail: CPDetail | undefined;
}

export function BaseInfo({ detail }: BaseInfoProps) {
  const theme = useTheme();

  const { baseToken, quoteToken, price, poolQuote, poolQuoteCap, salesBase } =
    detail ?? {};
  const progress = detail?.progress || 0;

  return (
    <Box
      sx={{
        p: 20,
        borderRadius: 24,
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: {
            mobile: 'column',
            tablet: 'row',
          },
          gap: 8,
        }}
      >
        <LoadingSkeleton
          loading={!baseToken}
          loadingProps={{ width: 100 }}
          sx={{
            fontWeight: 600,
          }}
        >
          <Box
            sx={{ typography: 'h4', color: 'primary.main' }}
            component="span"
          >
            {formatTokenAmountNumber({
              input: salesBase,
              decimals: baseToken?.decimals,
            })}
          </Box>
          {` ${baseToken?.symbol}`}
        </LoadingSkeleton>
        <LoadingSkeleton
          loading={!detail}
          loadingProps={{ width: 100 }}
          sx={{
            typography: 'body2',
            fontWeight: 600,
            color: 'text.secondary',
            '& > b': {
              color: 'text.primary',
            },
          }}
        >
          <b>1</b> {baseToken?.symbol} ={' '}
          <b>
            {formatTokenAmountNumber({
              input: price,
              decimals: quoteToken?.decimals,
            })}
          </b>{' '}
          {quoteToken?.symbol}
          {detail?.isEscalation && (
            <QuestionTooltip
              title={`${formatReadableNumber({ input: detail!.price.minus(detail!.initPrice).div(detail!.initPrice).times(100), showDecimals: 2 })}%`}
            />
          )}
          {' / '}
          <b>
            {formatTokenAmountNumber({
              input: poolQuote,
              decimals: quoteToken?.decimals,
            })}
          </b>{' '}
          {quoteToken?.symbol} <Trans>Contributed</Trans>
        </LoadingSkeleton>
      </Box>

      <Box
        sx={{
          mt: 8,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paperDarkContrast,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              backgroundColor: 'primary.main',
            }}
          />
        </Box>

        {detail?.isEscalation ? (
          <Box
            sx={{
              typography: 'body2',
              fontWeight: 600,
              color: 'text.secondary',
              '& > b': {
                color: 'text.primary',
              },
            }}
          >
            <Trans>Price Hard Cap</Trans>:{' '}
            <b>
              {formatTokenAmountNumber({
                input: detail.hardcapPrice ?? 0,
                decimals: quoteToken?.decimals,
              })}
            </b>{' '}
            {quoteToken?.symbol}
          </Box>
        ) : (
          <Box
            sx={{
              mt: 8,
              display: 'flex',
              justifyContent: 'space-between',
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            <Box
              sx={{
                color: 'primary.main',
              }}
            >
              {progress}%
            </Box>
            <LoadingSkeleton
              loading={!detail}
              loadingProps={{ width: 100 }}
              sx={{
                color: 'text.secondary',
                '& > b': {
                  color: 'text.primary',
                },
              }}
            >
              <b>
                {formatTokenAmountNumber({
                  input: poolQuote,
                  decimals: quoteToken?.decimals,
                })}
              </b>{' '}
              /{' '}
              {formatTokenAmountNumber({
                input: poolQuoteCap,
                decimals: quoteToken?.decimals,
              })}{' '}
              {quoteToken?.symbol}
            </LoadingSkeleton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
