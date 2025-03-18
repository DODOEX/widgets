import { CLMM } from '@dodoex/api';
import { alpha, Box, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { PositionInfoLayout } from '@raydium-io/raydium-sdk-v2';
import BigNumber from 'bignumber.js';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenInfo } from '../../../../hooks/Token/type';
import { formatTokenAmountNumber, getEtherscanPage } from '../../../../utils';
import { getPoolFeeRate } from '../../utils';
import { FeeAmount } from '../sdks/v3-sdk/constants';
import RangeBadge from './Badge/RangeBadge';

const BalanceItem = ({
  mint,
  pooledAmount,
}: {
  mint: TokenInfo | undefined;
  pooledAmount: BigNumber | undefined;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <TokenLogo
        address={mint?.address ?? ''}
        chainId={mint?.chainId}
        noShowChain
        width={18}
        height={18}
        marginRight={0}
      />
      <Box
        sx={{
          typography: 'body1',
          color: theme.palette.text.primary,
        }}
      >
        {formatTokenAmountNumber({
          input: pooledAmount,
          decimals: mint?.decimals,
        })}
        &nbsp;{mint?.symbol}
      </Box>
      <ButtonBase
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
        }}
        onClick={() => {
          if (!mint) {
            return;
          }
          window.open(getEtherscanPage(mint.chainId, mint.address, 'address'));
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            opacity="0.5"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.33333 3.33333V12.6667H12.6667V8H14V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.59333 14 2 13.4 2 12.6667V3.33333C2 2.6 2.59333 2 3.33333 2H8V3.33333H3.33333ZM9.33333 3.33333V2H14V6.66667H12.6667V4.27333L6.11333 10.8267L5.17333 9.88667L11.7267 3.33333H9.33333Z"
            fill="currentColor"
          />
        </svg>
      </ButtonBase>
    </Box>
  );
};

export interface PositionAmountPreviewProps {
  mintA: TokenInfo | undefined;
  mintB: TokenInfo | undefined;
  feeAmount: FeeAmount;
  existingPosition: ReturnType<typeof PositionInfoLayout.decode> | undefined;
  positionInfo: {
    pooledAmountA: BigNumber;
    pooledAmountB: BigNumber;
    priceLower: BigNumber;
    priceUpper: BigNumber;
  } | null;
  inRange: boolean;
  removed: boolean | undefined;
}

export const PositionAmountPreview = ({
  mintA,
  mintB,
  feeAmount,
  existingPosition,
  positionInfo,
  inRange,
  removed,
}: PositionAmountPreviewProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: 'solid 1px',
        borderColor: 'border.main',
        borderRadius: 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: theme.spacing(12, 20),
          borderBottomStyle: 'solid',
          borderBottomColor: 'border.main',
          borderBottomWidth: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              color: theme.palette.text.primary,
            }}
          >
            {t`Position on`}&nbsp;{mintA?.symbol}/{mintB?.symbol}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <RangeBadge removed={removed} inRange={inRange} />
            <Box
              sx={{
                py: 4,
                px: 8,
                color: theme.palette.primary.main,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                typography: 'h6',
              }}
            >
              {getPoolFeeRate({
                type: CLMM,
                lpFeeRate: feeAmount,
                mtFeeRate: 0,
              })}
            </Box>
          </Box>
        </Box>
        <ButtonBase
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            typography: 'body2',
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
            },
          }}
          onClick={() => {
            if (!mintA?.chainId) {
              return;
            }
            window.open(
              getEtherscanPage(
                mintA.chainId,
                existingPosition?.poolId.toBase58(),
                'address',
              ),
            );
          }}
        >
          {t`Details`}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
          >
            <path
              d="M7.5 5L6.4425 6.0575L9.8775 9.5L6.4425 12.9425L7.5 14L12 9.5L7.5 5Z"
              fill="currentColor"
            />
          </svg>
        </ButtonBase>
      </Box>

      <Box
        sx={{
          p: theme.spacing(12, 20),
        }}
      >
        <Box
          sx={{
            typography: 'h6',
            color: 'text.secondary',
          }}
        >
          <Trans>My Liquidity</Trans>
        </Box>
        <Box
          sx={{
            mt: 12,
          }}
        >
          <BalanceItem
            mint={mintA}
            pooledAmount={positionInfo?.pooledAmountA}
          />
          <BalanceItem
            mint={mintB}
            pooledAmount={positionInfo?.pooledAmountB}
          />
        </Box>
      </Box>
    </Box>
  );
};
