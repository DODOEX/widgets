import { MiningStatusE } from '@dodoex/api';
import { useCallback, useContext, useState } from 'react';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { OperateType } from '../../types';
import { MiningContext } from '../contexts';
import { SlideDurationTime } from '../dom';

export function useOperateHooks({
  id,
  status,
  handleGotoDetail,
}: {
  id: string;
  status: MiningStatusE;
  handleGotoDetail?: () => void;
}) {
  const { isMobile } = useWidgetDevice();

  const { operateId, setOperateId, viewType, setViewType } =
    useContext(MiningContext);

  const [operateType, setOperateType] = useState<OperateType>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const setOperateTypeAsNull = useCallback(() => {
    setTimeout(() => {
      setOperateType(null);
    }, SlideDurationTime + 20);
  }, []);

  const onClickOperateButton = useCallback(
    (type: OperateType) => {
      if (id === operateId && operateType === type && viewType === null) {
        setOperateId(null);
        setViewType(null);
        setOperateTypeAsNull();
        return;
      }

      setOperateId(id);
      setViewType(null);
      setOperateType(type);
    },
    [
      id,
      operateId,
      operateType,
      setOperateId,
      setOperateTypeAsNull,
      setViewType,
      viewType,
    ],
  );

  const onClickCard = useCallback(() => {
    handleGotoDetail?.();
  }, [handleGotoDetail]);

  const onClickOnDetail = useCallback((type: OperateType) => {
    setOperateType(type);
  }, []);

  const onCloseOnOperate = useCallback(() => {
    if (viewType === 'view' && isMobile) {
      setOperateType(null);
      return;
    }
    setOperateId(null);
    setViewType(null);
    setOperateTypeAsNull();
  }, [isMobile, setOperateId, setOperateTypeAsNull, setViewType, viewType]);

  const onCloseOnDetail = useCallback(() => {
    if (isMobile) {
      setOperateId(null);
    }
    setViewType(null);
  }, [isMobile, setOperateId, setViewType]);

  return {
    shareModalVisible,
    setShareModalVisible,
    operateType,
    setOperateType,
    onClickOperateButton,
    onClickCard,
    onCloseOnOperate,
    onCloseOnDetail,
    onClickOnDetail,
  };
}
