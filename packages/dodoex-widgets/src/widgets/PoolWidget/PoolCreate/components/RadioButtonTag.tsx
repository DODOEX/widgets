import { Box } from '@dodoex/components';
import { CSSProperties } from 'react';

export function RadioButtonTag({
  color,
  backgroundColor,
  tagKey,
}: {
  color: CSSProperties['color'];
  backgroundColor: CSSProperties['backgroundColor'];
  tagKey: string;
}) {
  return (
    <Box
      sx={{
        ml: 8,
        px: 8,
        py: 2,
        borderRadius: 4,
        backgroundColor,
        color,
        typography: 'h6',
        fontWeight: 500,
      }}
    >
      {tagKey}
    </Box>
  );
}
