import { Box, BoxProps } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { CurvePoolT } from '../types';

export default function FilterAddressTags({
  lqList,
  onDeleteTag,
  sx,
}: {
  lqList: CurvePoolT[];
  onDeleteTag: () => void;
  sx?: BoxProps['sx'];
}) {
  if (!lqList?.length) {
    return null;
  }
  const { name } = lqList[0];

  return (
    <Box
      sx={{
        typography: 'body2',
        display: 'inline-flex',
        alignItems: 'center',
        px: 8,
        mr: 8,
        borderRadius: 8,
        fontWeight: 600,
        height: 32,
        backgroundColor: 'hover.default',
        ...sx,
      }}
    >
      {name}
      <Box
        component={Error}
        sx={{
          ml: 4,
          width: 16,
          height: 16,
          cursor: 'pointer',
          color: 'text.secondary',
          position: 'relative',
          top: 1.5,
        }}
        onClick={() => onDeleteTag()}
      />
    </Box>
  );
}
