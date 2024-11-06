import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';
import { MobileDateTimePicker } from './components/MobileDateTimePicker';
import { PCDateTimePicker } from './components/PCDateTimePicker';

type Props = {
  placeholder?: string;
  value: number | null;
  onChange: (date: number | null) => void;
  minDate?: number;
  maxDate?: number;
  valueFormat?: string;
};

export const DateTimePickerInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  valueFormat,
}: Props) => {
  const { isMobile } = useWidgetDevice();

  if (isMobile) {
    return (
      <MobileDateTimePicker
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={onChange}
        valueFormat={valueFormat}
        placeholder={placeholder}
      />
    );
  }

  return (
    <PCDateTimePicker
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      minDate={minDate}
      maxDate={maxDate}
      valueFormat={valueFormat}
    />
  );
};
