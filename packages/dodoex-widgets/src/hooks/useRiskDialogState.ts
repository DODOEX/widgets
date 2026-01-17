import { useState } from 'react';
import {
  getRiskOncePageStoreageIsOpen,
  RiskOncePageLocalStorageKey,
  setRiskOncePageStoreageIsClose,
} from '../constants/localstorage';

export function useRiskDialogState(
  type: RiskOncePageLocalStorageKey,
  suffix?: string,
) {
  const [showRiskDialog, setShowRiskDialog] = useState(
    getRiskOncePageStoreageIsOpen(type, suffix),
  );

  const onClose = () => {
    setShowRiskDialog(false);
  };

  const onConfirm = () => {
    setRiskOncePageStoreageIsClose(type, suffix);
    setShowRiskDialog(false);
  };

  return {
    open: showRiskDialog,
    onClose,
    onConfirm,
  };
}
