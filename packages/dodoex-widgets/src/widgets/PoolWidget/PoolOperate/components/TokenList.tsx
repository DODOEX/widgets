import { PoolApi } from '@dodoex/api';
import { Box, BoxProps, Radio, RotatingIcon } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { TokenInfo } from '../../../../hooks/Token';
import { formatReadableNumber } from '../../../../utils/formatter';
import { usePoolBalanceInfo } from '../../hooks/usePoolBalanceInfo';
import { CheckTokenType } from '../hooks/useCheckToken';
import { OperatePool } from '../types';

function TokenItem({
  token,
  pool,
  sx,
  value,
  onChange,
  selectedValue,
  lpBalance,
  balanceMax,
  balanceInfo,
  loading,
}: {
  token?: TokenInfo;
  pool?: OperatePool;
  sx?: BoxProps['sx'];
  value: CheckTokenType;
  onChange: (check: CheckTokenType) => void;
  selectedValue?: CheckTokenType;
  lpBalance?: BigNumber | null;
  balanceMax?: BigNumber | null;
  balanceInfo?: ReturnType<typeof usePoolBalanceInfo>;
  loading: boolean;
}) {
  const chainId = pool?.chainId;
  return (
    <Box sx={sx}>
      <Box
        sx={{
          typography: 'h5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {token ? (
            <Radio
              checked={value === selectedValue}
              onChange={() => onChange(value as CheckTokenType)}
              sx={{
                mr: 16,
              }}
            />
          ) : (
            ''
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {token ? (
              <>
                <TokenLogo
                  address={token.address}
                  width={24}
                  height={24}
                  chainId={token.chainId || chainId}
                  url={token.logoURI}
                  noShowChain
                />
              </>
            ) : (
              pool && (
                <TokenLogoPair
                  tokens={[pool.baseToken, pool.quoteToken]}
                  chainId={pool.baseToken?.chainId || chainId}
                  width={24}
                  height={24}
                />
              )
            )}
          </Box>
        </Box>
        <Box
          sx={{
            textAlign: 'right',
          }}
        >
          {token
            ? `${token.symbol} LP `
            : pool &&
              `${pool.baseToken.symbol}
             ${pool.quoteToken.symbol}
             LP `}
          {loading ? (
            <Box
              component={RotatingIcon}
              sx={{
                ml: 4,
                position: 'relative',
                top: 3,
              }}
            />
          ) : (
            (lpBalance &&
              formatReadableNumber({
                input: lpBalance,
              })) ||
            ''
          )}
        </Box>
      </Box>
      <Box
        sx={{
          typography: 'body2',
          mt: 5,
          color: 'text.secondary',
          textAlign: 'right',
        }}
      >
        {token ? (
          <>
            {loading ? (
              <Box
                component={RotatingIcon}
                sx={{
                  ml: 4,
                  position: 'relative',
                  top: 3,
                }}
              />
            ) : (
              `≈ ${
                (balanceMax &&
                  formatReadableNumber({
                    input: balanceMax,
                  })) ||
                ''
              }`
            )}
            {` ${token.symbol}`}
          </>
        ) : pool &&
          balanceInfo &&
          balanceInfo.userBaseLpToTokenBalance &&
          balanceInfo.userQuoteLpToTokenBalance ? (
          <>
            {loading ? (
              <Box
                component={RotatingIcon}
                sx={{
                  position: 'relative',
                  top: 4,
                }}
              />
            ) : (
              formatReadableNumber({
                input: balanceInfo.userBaseLpToTokenBalance,
              })
            )}
            {` ${pool?.baseToken.symbol} + `}
            {loading ? (
              <Box
                component={RotatingIcon}
                sx={{
                  position: 'relative',
                  top: 4,
                }}
              />
            ) : (
              formatReadableNumber({
                input: balanceInfo.userQuoteLpToTokenBalance,
              })
            )}
            {` ${pool?.quoteToken.symbol}`}
          </>
        ) : (
          ''
        )}
      </Box>
    </Box>
  );
}

export default function TokenList({
  pool,
  checkTokenType,
  setCheckToken,
  balanceInfo,
  baseTokenBalanceUpdateLoading,
  quoteBalanceUpdateLoading,
}: {
  pool?: OperatePool;
  checkTokenType: CheckTokenType;
  setCheckToken: (checkTokenType: CheckTokenType) => void;
  balanceInfo?: ReturnType<typeof usePoolBalanceInfo>;
  baseTokenBalanceUpdateLoading: boolean;
  quoteBalanceUpdateLoading: boolean;
}) {
  if (!pool) return null;
  const singleSideLp = PoolApi.utils.singleSideLp(pool.type);
  return (
    <>
      {singleSideLp ? (
        <>
          <TokenItem
            token={pool.baseToken}
            selectedValue={checkTokenType}
            onChange={setCheckToken}
            value={CheckTokenType.base}
            lpBalance={balanceInfo && balanceInfo.userBaseLpBalance}
            balanceMax={balanceInfo && balanceInfo.userBaseLpToTokenBalance}
            loading={baseTokenBalanceUpdateLoading}
          />
          <TokenItem
            selectedValue={checkTokenType}
            onChange={setCheckToken}
            sx={{
              mt: 13,
            }}
            token={pool.quoteToken}
            value={CheckTokenType.quote}
            lpBalance={balanceInfo && balanceInfo.userQuoteLpBalance}
            balanceMax={balanceInfo && balanceInfo.userQuoteLpToTokenBalance}
            loading={quoteBalanceUpdateLoading}
          />
        </>
      ) : (
        <TokenItem
          pool={pool}
          value={checkTokenType}
          onChange={setCheckToken}
          lpBalance={balanceInfo && balanceInfo.userBaseLpBalance}
          balanceInfo={balanceInfo}
          loading={baseTokenBalanceUpdateLoading || quoteBalanceUpdateLoading}
        />
      )}
    </>
  );
}
