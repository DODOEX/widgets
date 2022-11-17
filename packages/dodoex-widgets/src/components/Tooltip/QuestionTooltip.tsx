import {
  QuestionTooltip as QuestionTooltipOrigin,
  QuestionTooltipProps,
} from '@dodoex/components';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';
import { WIDGET_CLASS_NAME } from '../Widget';

export default function QuestionTooltip(props: QuestionTooltipProps) {
  const { width } = useSelector(getGlobalProps);
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
      {...props}
    />
  );
}
