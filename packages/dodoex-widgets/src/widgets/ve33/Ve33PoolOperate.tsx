import { Box } from '@dodoex/components';
import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';
import Ve33V2PoolOperateDialog, {
  PoolOperateProps,
  Ve33V2PoolOperate,
} from './Ve33V2PoolOperate';
import Ve33V3PoolOperateDialog, {
  Ve33V3PoolOperate,
} from './Ve33V3PoolOperate';
import { PoolTypeE } from './types';

export default function Ve33PoolOperateDialog(props: PoolOperateProps) {
  const { isMobile } = useWidgetDevice();
  const isV3 = props.pool?.type === PoolTypeE.CLPool;
  const PoolOperateDialog = isV3
    ? Ve33V3PoolOperateDialog
    : Ve33V2PoolOperateDialog;
  const PoolOperate = isV3 ? Ve33V3PoolOperate : Ve33V2PoolOperate;

  return (
    <Box
      sx={{
        position: 'relative',
        width: 375,
        overflow: 'hidden',
      }}
    >
      {isMobile ? (
        <PoolOperateDialog modal={isMobile} {...props} />
      ) : (
        <PoolOperate
          {...props}
          sx={{
            width: 375,
            height: 'max-content',
            backgroundColor: 'background.paper',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        />
      )}
    </Box>
  );
}
