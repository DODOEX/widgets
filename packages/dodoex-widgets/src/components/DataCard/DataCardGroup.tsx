import { Box, BoxProps } from '@dodoex/components';
import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';

export function DataCardGroup({
  children,
  sx,
  gap = 20,
  repeatBaseForLargeScreen = 3,
}: {
  children?: React.ReactNode;
  sx?: BoxProps['sx'];
  gap?: number;
  /** Large screen quantity per row */
  repeatBaseForLargeScreen?: number;
}) {
  const { isMobile, minDevice, maxDevice } = useWidgetDevice();
  let defaultSx: BoxProps['sx'] = {};
  if (isMobile) {
    defaultSx = {
      display: 'grid',
      gap,
      gridTemplateColumns: `repeat(${1}, 1fr)`,
    };
  } else {
    let gridTemplateColumnsCount = 2;
    const largeScreenList = [1418, 1761, 2104];
    largeScreenList.some((largeScreen, index) => {
      if (minDevice(largeScreen)) {
        gridTemplateColumnsCount = repeatBaseForLargeScreen + index;
        return true;
      }
    });
    defaultSx = {
      display: 'grid',
      gap,
      gridTemplateColumns: `repeat(${gridTemplateColumnsCount}, 1fr)`,
    };
  }
  return (
    <Box
      sx={{
        ...defaultSx,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
