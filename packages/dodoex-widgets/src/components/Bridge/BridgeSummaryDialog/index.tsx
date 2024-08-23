import { Box, Button, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useEffect } from 'react';
import { BridgeRouteI } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import useExecuteBridgeRoute from '../../../hooks/Bridge/useExecuteBridgeRoute';
import Dialog from '../../Swap/components/Dialog';
import { BridgeLogo } from '../SelectBridgeDialog/BridgeLogo';
import { DirectionLine } from '../SelectBridgeDialog/DirectionLine';
import { TokenWithChain } from '../SelectBridgeDialog/TokenWithChain';
import BridgeSummaryDetail from './BridgeSummaryDetail';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalProps } from '../../../store/actions/globals';
import { ContractStatus } from '../../../store/reducers/globals';
import { AppThunkDispatch } from '../../../store/actions';
import { getGlobalProps } from '../../../store/selectors/globals';

export interface BridgeTXRequest {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
  encodeId?: string;
}

export default function BridgeSummaryDialog({
  open,
  onClose,
  route,
  bridgeOrderTxRequest,
  clearToAmt,
  clearFromAmt,
}: {
  open: boolean;
  onClose: () => void;
  route?: BridgeRouteI;
  bridgeOrderTxRequest?: BridgeTXRequest;
  clearToAmt: () => void;
  clearFromAmt: () => void;
}) {
  const theme = useTheme();
  const { contractStatus } = useSelector(getGlobalProps);

  const dispatch = useDispatch<AppThunkDispatch>();
  const handleExecuteRoute = useExecuteBridgeRoute({
    route,
    bridgeOrderTxRequest,
  });

  useEffect(() => {
    if (contractStatus !== ContractStatus.Pending) {
      onClose();
    }
    if (contractStatus === ContractStatus.TxSuccess) {
      clearToAmt();
      clearFromAmt();
    }
  }, [contractStatus]);

  return (
    <Dialog
      title={<Trans>Cross Chain Summary</Trans>}
      open={open}
      onClose={() => {
        dispatch(
          setGlobalProps({
            contractStatus: ContractStatus.Initial,
          }),
        );
        onClose();
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
          ''
        )}
        <Box
          sx={{
            px: 16,
            py: 20,
          }}
        >
          <Button
            fullWidth
            isLoading={contractStatus == ContractStatus.Pending}
            disabled={!route}
            onClick={async () => {
              dispatch(
                setGlobalProps({
                  contractStatus: ContractStatus.Pending,
                }),
              );
              if (route?.sendData) {
                route?.sendData();
              } else {
                await handleExecuteRoute();
                setGlobalProps({
                  contractStatus: ContractStatus.TxSuccess,
                });
              }
            }}
          >
            {contractStatus == ContractStatus.Pending ? (
              <Trans>Confirming</Trans>
            ) : (
              <Trans>Confirm Cross Chain</Trans>
            )}
          </Button>
        </Box>
      </>
    </Dialog>
  );
}
