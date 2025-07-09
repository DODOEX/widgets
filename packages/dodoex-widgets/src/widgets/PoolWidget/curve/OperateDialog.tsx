import { useCallback } from 'react';
import Dialog from '../../../components/Dialog';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { AndOrRemove } from './AndOrRemove';
import { OperateCurvePoolT } from './types';
import { Box } from '@dodoex/components';

export interface OperateDialogProps {
  operateCurvePool: OperateCurvePoolT;
  setOperateCurvePool: React.Dispatch<
    React.SetStateAction<OperateCurvePoolT | null>
  >;
}

export const OperateDialog = ({
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
        <AndOrRemove onClose={onClose} operateCurvePool={operateCurvePool} />
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
      <AndOrRemove onClose={onClose} operateCurvePool={operateCurvePool} />
    </Dialog>
  );
};
