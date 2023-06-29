import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { BridgeRouteI } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import useGetBalance from '../../../hooks/Token/useGetBalance';
import Dialog from '../../Swap/components/Dialog';
import RouteCard from './RouteCard';

export default function SelectBridgeDialog({
  open,
  onClose,
  selectedRouteId,
  setSelectRouteId,
  bridgeRouteList,
}: {
  open: boolean;
  onClose: () => void;
  selectedRouteId: string;
  setSelectRouteId: Dispatch<SetStateAction<string>>;
  bridgeRouteList: Array<BridgeRouteI>;
}) {
  const theme = useTheme();

  const getBalance = useGetBalance();
  const fromTokenBalance = useMemo(() => {
    if (!bridgeRouteList?.length) return null;
    const { fromToken } = bridgeRouteList[0];
    return getBalance(fromToken);
  }, [bridgeRouteList, getBalance]);

  return (
    <Dialog open={open} onClose={onClose} title={<Trans>Select Bridge</Trans>}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          py: 20,
          px: 16,
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: 1,
            height: '1px',
            backgroundColor: theme.palette.border.main,
          },
        }}
      >
        {bridgeRouteList?.map((r, i) => {
          return (
            <RouteCard
              key={r.id}
              fromChainId={r.fromChainId}
              toChainId={r.toChainId}
              fromToken={r.fromToken}
              toToken={r.toToken}
              fromAmount={r.fromAmount}
              fromTokenBalance={fromTokenBalance}
              toTokenAmount={r.toTokenAmount}
              toolDetails={r.step.toolDetails}
              spenderContractAddress={r.spenderContractAddress}
              selected={selectedRouteId === r.id}
              setSelected={() => {
                setSelectRouteId(r.id);
                onClose();
              }}
              isBestPrice={i === 0}
              product={r.product}
              executionDuration={r.executionDuration}
              feeUSD={r.feeUSD}
            />
          );
        })}
      </Box>
    </Dialog>
  );
}
