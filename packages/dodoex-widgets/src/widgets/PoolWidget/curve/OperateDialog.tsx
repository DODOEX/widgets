import { useMemo } from 'react';
import Dialog from '../../../components/Dialog';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { AddOrRemove } from './AddOrRemove';
import { OperateCurvePoolT } from './types';
import { Box } from '@dodoex/components';

export interface OperateDialogProps {
  poolDetailBtnVisible?: boolean;
  operateCurvePool: OperateCurvePoolT;
  setOperateCurvePool?: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
}

export const OperateDialog = ({
  poolDetailBtnVisible,
  operateCurvePool,
  setOperateCurvePool,
}: OperateDialogProps) => {
  const { isMobile } = useWidgetDevice();

  const onClose = useMemo(() => {
    if (!setOperateCurvePool) {
      return;
    }
    return () => {
      setOperateCurvePool(null);
    };
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
          poolDetailBtnVisible={poolDetailBtnVisible}
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
        poolDetailBtnVisible={poolDetailBtnVisible}
      />
    </Dialog>
  );
};
