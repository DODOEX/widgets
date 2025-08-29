import { SliderProps } from '@dodoex/components';
import { Slider } from '@dodoex/components';
import { WEEK } from '../Ve33LockOperate/utils';

export default function LockSlider({
  currentValue,
  ...props
}: SliderProps & {
  currentValue?: boolean;
}) {
  return <Slider marks={marks} min={0} max={31536000} step={WEEK} {...props} />;
}

export const MAX_LOCK_DURATION = 31536000;
const marks = [
  {
    value: 0,
    label: 'Min',
  },
  {
    value: 7776000,
    label: '3 months',
  },
  {
    value: 15552000,
    label: '6 months',
  },
  {
    value: 23328000,
    label: '9 months',
  },
  {
    value: MAX_LOCK_DURATION,
    label: '1 year',
  },
];
