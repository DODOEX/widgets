import {
  QuestionTooltip as QuestionTooltipOrigin,
  QuestionTooltipProps,
} from '@dodoex/components';
import { useMemo } from 'react';
import { useUserOptions } from '../UserOptionsProvider';
import { WIDGET_CLASS_NAME } from '../Widget';

export default function QuestionTooltip({
  sx,
  ...props
}: QuestionTooltipProps) {
  const { width } = useUserOptions();
  const maxWidth = useMemo(() => {
    let res = '';
    if (typeof width === 'number') {
      res = `${width}px`;
    } else if (width) {
      res = width;
    }
    if (!res) return 'auto';
    return `calc(${res} - 40px)`;
  }, [width]);
  return (
    <QuestionTooltipOrigin
      container={document.querySelector(`.${WIDGET_CLASS_NAME}`)}
      maxWidth={maxWidth}
      sx={{
        cursor: 'help',
        ...sx,
      }}
      {...props}
    />
  );
}
