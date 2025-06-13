import Tooltip from './Tooltip';
import { QuestionBorder } from '@dodoex/icons';
import { HoverOpacity } from '../Hover';
import { BoxProps } from '../Box';
import { PopperProps } from '@mui/base/Popper';

export interface QuestionTooltipProps {
  title?: string | React.ReactNode;
  maxWidth?: string | number;
  ml?: number | string;
  mr?: number | string;
  size?: string | number;
  sx?: BoxProps['sx'];
  container?: PopperProps['container'];
  onlyHover?: boolean;
}

export default function QuestionTooltip({
  title,
  ml,
  mr,
  size = 15,
  sx,
  maxWidth,
  container,
  onlyHover,
}: QuestionTooltipProps) {
  if (!title) return null;

  return (
    <Tooltip
      title={title}
      placement="top"
      container={container}
      maxWidth={maxWidth}
      onlyHover
      leaveDelay={100}
      sx={{
        maxWidth: 240,
      }}
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
