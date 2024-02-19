import { useTheme, Box, BoxProps } from '@dodoex/components';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';

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
  const theme = useTheme();
  const globalProps = useSelector(getGlobalProps);
  let defaultSx: BoxProps['sx'] = {};
  const width = globalProps.width || 375;
  const breakpoints = theme.breakpoints.values;
  if (width < breakpoints.tablet) {
    defaultSx = {
      '& > div': {
        mb: gap ?? 16,
      },
    };
  } else {
    let gridTemplateColumnsCount = 1;
    if (width < 1418) {
      gridTemplateColumnsCount = 2;
    }
    const largeScreenList = [1418, 1761, 2104];
    largeScreenList.some((largeScreen, index) => {
      if (width < largeScreen) {
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
