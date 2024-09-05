import { Box, Button, Skeleton, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultTokens from '../../../constants/tokenList';
import useExecuteBridgeRoute from '../../../hooks/Bridge/useExecuteBridgeRoute';
import { useFetchRoutePriceBridge } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import { useSendRoute } from '../../../hooks/Bridge/useSendRoute';
import { useWalletState } from '../../../hooks/ConnectWallet/useWalletState';
import { useFetchTokens } from '../../../hooks/contract';
import { useFetchFiatPrice } from '../../../hooks/Swap';
import { TokenInfo } from '../../../hooks/Token';
import { AppThunkDispatch } from '../../../store/actions';
import { setGlobalProps } from '../../../store/actions/globals';
import { setSlippage } from '../../../store/actions/settings';
import { ContractStatus } from '../../../store/reducers/globals';
import { getGlobalProps } from '../../../store/selectors/globals';
import {
  getBalanceLoadings,
  getTokenList,
} from '../../../store/selectors/token';
import BridgeSummaryDetail from '../../Bridge/BridgeSummaryDialog/BridgeSummaryDetail';
import { BridgeLogo } from '../../Bridge/SelectBridgeDialog/BridgeLogo';
import { DirectionLine } from '../../Bridge/SelectBridgeDialog/DirectionLine';
import { TokenWithChain } from '../../Bridge/SelectBridgeDialog/TokenWithChain';
import ConnectWallet from '../../Swap/components/ConnectWallet';
import Dialog from '../../Swap/components/Dialog';

export default function BridgeTonSummaryDialog({
  tonAccount,
  fromTokenAddress,
  fromChainId,
  toTokenAddress,
  toChainId,
  fromAmt,
  slippage,
  redirectLink,
}: {
  tonAccount: string;
  fromTokenAddress: string;
  fromChainId: number;
  toTokenAddress: string;
  toChainId: number;
  fromAmt: string;
  slippage?: number;
  redirectLink: string;
}) {
  const theme = useTheme();
  const dispatch = useDispatch<AppThunkDispatch>();
  const tokenList = useSelector(getTokenList);
  const fromToken = React.useMemo(() => {
    const token = [...defaultTokens, ...tokenList].find(
      (token) =>
        token.chainId === fromChainId && token.address === fromTokenAddress,
    );
    if (!token) throw new Error('Could not find from token');
    return token;
  }, [tokenList, fromTokenAddress, fromChainId]);
  const toToken = React.useMemo(() => {
    const token = [...defaultTokens, ...tokenList].find(
      (token) =>
        token.chainId === toChainId && token.address === toTokenAddress,
    );
    if (!token) throw new Error('Could not find from token');
    return token;
  }, [tokenList, toTokenAddress, toChainId]);

  const { fromFiatPrice } = useFetchFiatPrice({
    toToken,
    fromToken,
  });
  const { account, chainId } = useWalletState();
  const balanceLoadings = useSelector(getBalanceLoadings);
  const balanceLoading =
    !account || balanceLoadings[fromToken.address.toLocaleLowerCase()];

  const fetchFromTokenQuery = useFetchTokens({
    tokenList: [fromToken],
    skip: chainId !== fromToken.chainId,
  });
  const fromTokenBalance = fetchFromTokenQuery.data?.[0]?.balance;
  let insufficientBalance = false;
  if (fromTokenBalance) {
    insufficientBalance = fromTokenBalance.lt(fromAmt);
  }

  React.useEffect(() => {
    if (!slippage) return;
    dispatch(setSlippage(String(slippage)));
  }, [slippage]);

  const { bridgeRouteList } = useFetchRoutePriceBridge({
    toToken,
    fromToken,
    fromAmount: fromAmt,
    fromFiatPrice,
    fromAddress: account,
    toAddress: tonAccount,
  });
  const route = React.useMemo(() => {
    if (!bridgeRouteList?.length) return undefined;
    return {
      ...bridgeRouteList[0],
      fromAddress: account ?? '',
    };
  }, [bridgeRouteList, account]);
  const { contractStatus } = useSelector(getGlobalProps);
  const { bridgeOrderTxRequest } = useSendRoute();
  const handleExecuteRoute = useExecuteBridgeRoute({
    route,
    bridgeOrderTxRequest,
    sendData: route?.sendData,
  });

  return (
    <Dialog
      title={<Trans>Cross Chain Summary</Trans>}
      open
      onClose={() => {
        window.open(redirectLink);
      }}
    >
      <>
        {route ? (
          <Box
            sx={{
              px: 16,
              pb: 20,
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '36% 28% 36%',
                py: 20,
                borderStyle: 'solid',
                borderWidth: theme.spacing(1, 0, 0),
                borderColor: theme.palette.border.main,
              }}
            >
              <TokenWithChain
                token={route.fromToken}
                chainId={route.fromChainId}
                amount={route.fromAmount}
              />

              {!!route.step && (
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
                      toolDetails={route.step.toolDetails}
                      nameMarginLeft={8}
                    />
                  </Box>
                </DirectionLine>
              )}

              <TokenWithChain
                token={route.toToken}
                chainId={route.toChainId}
                amount={route.toTokenAmount}
              />
            </Box>

            <BridgeSummaryDetail route={route} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              px: 16,
              pb: 20,
              flex: 1,
            }}
          >
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={28} />
          </Box>
        )}
        <Box
          sx={{
            px: 16,
            py: 20,
          }}
        >
          {insufficientBalance ? (
            <Button fullWidth disabled>
              <Trans>Insufficient balance</Trans>
            </Button>
          ) : account && chainId === fromToken.chainId ? (
            <Button
              fullWidth
              isLoading={contractStatus == ContractStatus.Pending}
              disabled={!route || balanceLoading}
              onClick={async () => {
                handleExecuteRoute();
                dispatch(
                  setGlobalProps({
                    contractStatus: ContractStatus.Pending,
                  }),
                );
              }}
            >
              {contractStatus == ContractStatus.Pending ? (
                <Trans>Confirming</Trans>
              ) : (
                <Trans>Confirm Cross Chain</Trans>
              )}
            </Button>
          ) : (
            <ConnectWallet needSwitchChain={fromToken.chainId} />
          )}
        </Box>
      </>
    </Dialog>
  );
}
