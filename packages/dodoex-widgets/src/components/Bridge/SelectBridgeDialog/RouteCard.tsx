import { alpha, Box, Tooltip, useTheme } from '@dodoex/components';
import { Trans, t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { BridgeRouteI } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import { ApprovalState, TokenInfo } from '../../../hooks/Token/type';
import { useGetTokenStatus } from '../../../hooks/Token/useGetTokenStatus';
import { productList } from './productList';
import { RouteTag, RouteTagList } from './RouteTagList';
import { GasFee as FeeIcon, Time as TimeIcon } from '@dodoex/icons';
import { formatReadableTimeDuration } from '../../../utils/time';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import { TokenWithChain } from './TokenWithChain';
import { DirectionLine } from './DirectionLine';
import { BridgeLogo } from './BridgeLogo';
import { useWalletState } from '../../../hooks/ConnectWallet/useWalletState';

export default function RouteCard({
  fromToken,
  toToken,
  fromChainId,
  toChainId,
  fromAmount,
  fromTokenBalance,
  toTokenAmount,
  toolDetails,
  product,
  executionDuration,
  feeUSD,
  selected,
  setSelected,
  spenderContractAddress,
  isBestPrice,
}: {
  fromToken?: TokenInfo;
  toToken?: TokenInfo;
  fromChainId: number;
  toChainId: number;
  fromAmount?: BridgeRouteI['fromAmount'];
  fromTokenBalance: BigNumber | null;
  toTokenAmount?: BigNumber | null;
  toolDetails:
    | undefined
    | Exclude<BridgeRouteI['step'], undefined>['toolDetails'];
  product: BridgeRouteI['product'];
  executionDuration: BridgeRouteI['executionDuration'];
  feeUSD: BridgeRouteI['feeUSD'];

  selected: boolean;
  setSelected: () => void;
  spenderContractAddress: string | undefined;
  isBestPrice?: boolean;
}) {
  const theme = useTheme();
  const { account } = useWalletState();
  const productDetail = productList.find((i) => i.id === product);
  const { getApprovalState } = useGetTokenStatus({
    account,
    chainId: fromChainId,
    contractAddress: spenderContractAddress,
  });

  const approvalState = useMemo(() => {
    if (!fromToken || !fromAmount || !fromTokenBalance) {
      return ApprovalState.Loading;
    }
    return getApprovalState(fromToken, fromAmount, fromTokenBalance);
  }, [fromToken, fromAmount, fromTokenBalance, getApprovalState]);

  const routeTagList = useMemo<RouteTag[]>(() => {
    const restTagList: RouteTag[] = [];
    if (isBestPrice) {
      restTagList.push({
        type: 'best-price',
      });
    }
    if (
      approvalState === ApprovalState.Approving ||
      approvalState === ApprovalState.Insufficient
    ) {
      return [
        ...restTagList,
        {
          type: 'no-approve',
        },
      ];
    }
    return restTagList;
  }, [approvalState, isBestPrice]);

  return (
    <Box
      sx={{
        borderRadius: 16,
        py: 16,
        px: 12,
        backgroundColor: theme.palette.background.tag,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'hover.default',
        },
        outline: 0,
        ...(selected
          ? {
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: theme.palette.primary.main,
            }
          : {}),
      }}
      onClick={setSelected}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box
          component={productDetail?.logoURI}
          sx={{
            width: 16,
            height: 16,
          }}
        />
        <Box
          sx={{
            marginLeft: 4,
          }}
        >
          {productDetail?.name}
        </Box>
        <RouteTagList routeTagList={routeTagList} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 8,
          pb: 8,
          borderStyle: 'dashed',
          borderWidth: theme.spacing(0, 0, 1, 0),
          borderColor: theme.palette.border.main,
        }}
      >
        <Tooltip
          onlyHover
          placement="top"
          title={<Trans>Estimated transaction time</Trans>}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 8,
              py: 4,
              border: `solid 1px ${theme.palette.border.main}`,
              borderRadius: 4,
              typography: 'h6',
            }}
          >
            <TimeIcon
              style={{
                color: theme.palette.text.secondary,
                width: 14,
                height: 14,
              }}
            />
            <Box
              sx={{
                ml: 4,
                lineHeight: 1,
              }}
            >
              {executionDuration !== null
                ? formatReadableTimeDuration({
                    start: Date.now(),
                    end: Date.now() + executionDuration * 1000,
                  })
                : '-'}
            </Box>
          </Box>
        </Tooltip>
        <Tooltip
          onlyHover
          placement="top"
          title={
            <Trans>
              Fee includes: Cross Chain fees + Swap fees. Gas fee not included.
            </Trans>
          }
        >
          <Box
            sx={{
              ml: 8,
              display: 'flex',
              alignItems: 'center',
              px: 8,
              py: 4,
              border: `solid 1px ${theme.palette.border.main}`,
              borderRadius: 4,
              typography: 'h6',
            }}
          >
            <FeeIcon
              style={{
                color: theme.palette.text.secondary,
                width: 14,
                height: 14,
              }}
            />
            <Box
              sx={{
                ml: 4,
                lineHeight: 1,
              }}
            >
              {feeUSD !== null
                ? `$${formatTokenAmountNumber({
                    input: feeUSD,
                    decimals: 6,
                  })}`
                : '-'}
            </Box>
          </Box>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '36% 28% 36%',
          mt: 8,
        }}
      >
        <TokenWithChain
          token={fromToken}
          chainId={fromChainId}
          amount={fromAmount}
        />

        <DirectionLine>
          <Box
            sx={{
              display: 'flex',
              px: 3,
              py: 3,
              backgroundColor: theme.palette.background.paperContrast,
              border: `1px solid ${theme.palette.border.main}`,
              borderRadius: '50%',
              alignItems: 'center',
              width: 24,
              height: 24,
              overflow: 'hidden',
            }}
          >
            <BridgeLogo
              size="medium"
              toolDetails={toolDetails}
              nameMarginLeft={8}
            />
          </Box>
        </DirectionLine>

        <TokenWithChain
          token={toToken}
          chainId={toChainId}
          amount={toTokenAmount}
        />
      </Box>
    </Box>
  );
}
