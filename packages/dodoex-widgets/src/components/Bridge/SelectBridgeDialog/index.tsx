import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { Dispatch, SetStateAction } from 'react';
import { BridgeRouteI } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      id="select-cross-chain"
      title={<Trans>Select Cross Chain</Trans>}
    >
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
              key={r.key}
              fromChainId={r.fromChainId}
              toChainId={r.toChainId}
              fromToken={r.fromToken}
              toToken={r.toToken}
              fromAmount={r.fromAmount}
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
