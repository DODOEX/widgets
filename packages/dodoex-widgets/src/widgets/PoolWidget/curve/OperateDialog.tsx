import { useCallback } from 'react';
import Dialog from '../../../components/Dialog';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { AddOrRemove } from './AddOrRemove';
import { OperateCurvePoolT } from './types';
import { Box } from '@dodoex/components';

export interface OperateDialogProps {
  poolInfoVisible?: boolean;
  operateCurvePool: OperateCurvePoolT;
  setOperateCurvePool: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
}

export const OperateDialog = ({
  poolInfoVisible = true,
  operateCurvePool,
  setOperateCurvePool,
}: OperateDialogProps) => {
  const { isMobile } = useWidgetDevice();

  const onClose = useCallback(() => {
    setOperateCurvePool(null);
  }, [setOperateCurvePool]);

  if (!isMobile) {
    return (
      <Box
        sx={{
          borderRadius: 16,
          backgroundColor: 'background.paper',
        }}
      >
        <AddOrRemove
          onClose={onClose}
          operateCurvePool={operateCurvePool}
          poolInfoVisible={poolInfoVisible}
        />
      </Box>
    );
  }

  return (
    <Dialog
      open
      onClose={onClose}
      scope={!isMobile}
      modal={isMobile}
      id="curve-pool-operate"
    >
      <AddOrRemove
        onClose={onClose}
        operateCurvePool={operateCurvePool}
        poolInfoVisible={poolInfoVisible}
      />
    </Dialog>
  );
};
