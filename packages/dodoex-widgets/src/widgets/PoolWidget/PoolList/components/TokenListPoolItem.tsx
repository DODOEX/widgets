import { PoolType, PoolApi } from '@dodoex/api';
import { Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { formatApy } from '../../../../utils';
import {
  convertLiquidityTokenToTokenInfo,
  FetchLiquidityListLqList,
} from '../../utils';

export default function TokenListPoolItem({
  list,
  onClick,
}: {
  list: FetchLiquidityListLqList;
  onClick: () => void;
}) {
  return (
    <>
      {list?.map((lq) => {
        if (!lq?.pair) return null;
        const item = lq.pair;
        const baseToken = convertLiquidityTokenToTokenInfo(
          item.baseToken,
          item.chainId,
        );
        const quoteToken = convertLiquidityTokenToTokenInfo(
          item.quoteToken,
          item.chainId,
        );
        const baseApy = item.apy
          ? formatApy(
              new BigNumber(item.apy?.transactionBaseApy).plus(
                item.apy?.miningBaseApy ?? 0,
              ),
            )
          : undefined;
        const quoteApy =
          PoolApi.utils.singleSideLp(item.type as PoolType) && item.apy
            ? formatApy(
                new BigNumber(item.apy.transactionQuoteApy).plus(
                  item.apy.miningQuoteApy ?? 0,
                ),
              )
            : undefined;
        if (!baseToken || !quoteToken) return null;
        return (
          <Box
            key={item.id}
            onClick={onClick}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 10,
              py: 20,
              borderRadius: 8,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'custom.background.listHover',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TokenLogoPair
                tokens={[baseToken, quoteToken]}
                chainId={item.chainId}
                width={24}
                mr={10}
              />
              <Box
                sx={{
                  typography: 'h5',
                }}
              >
                {baseToken.symbol}/{quoteToken.symbol}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  color: 'custom.status.green.default',
                  fontWeight: 600,
                }}
              >
                {baseApy}
                {quoteApy ? `/${quoteApy}` : ''}
              </Box>
              <Box
                sx={{
                  mt: 2,
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                <Trans>APY</Trans>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
