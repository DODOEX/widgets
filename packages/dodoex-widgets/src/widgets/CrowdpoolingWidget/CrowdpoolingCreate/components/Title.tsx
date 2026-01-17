import { Box, BoxProps } from '@dodoex/components';
import React from 'react';
import { QuestionTooltip } from '../../../../components/Tooltip';

export default function Title({
  sx,
  question,
  children,
  ...props
}: BoxProps & {
  question?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        fontWeight: 600,
        ...(!!question && {
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
      {!!question && <QuestionTooltip title={question} />}
    </Box>
  );
}
