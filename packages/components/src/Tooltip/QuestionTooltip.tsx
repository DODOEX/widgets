import Tooltip from './Tooltip';
import { QuestionBorder } from '@dodoex-io/icons';
import { HoverOpacity } from '../Hover';
import { BoxProps } from '../Box';
import { PopperUnstyledProps } from '@mui/base';

export interface QuestionTooltipProps {
  title?: string | React.ReactNode;
  maxWidth?: string | number;
  ml?: number | string;
  mr?: number | string;
  size?: string | number;
  sx?: BoxProps['sx'];
  container?: PopperUnstyledProps['container'];
}

export default function QuestionTooltip({
  title,
  ml,
  mr,
  size = 15,
  sx,
  maxWidth,
  container,
}: QuestionTooltipProps) {
  if (!title) return null;

  return (
    <Tooltip
      title={title}
      placement="top"
      container={container}
      maxWidth={maxWidth}
    >
      <HoverOpacity
        component={QuestionBorder}
        sx={{
          ml,
          mr,
          width: size,
          height: size,
          ...sx,
        }}
      />
    </Tooltip>
  );
}
