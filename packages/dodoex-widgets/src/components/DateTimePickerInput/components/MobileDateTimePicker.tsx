import { alpha, Box, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'rmc-date-picker';
import Dialog from '../../Dialog';
import { getShowDateTime } from '../utils';
import { ReactComponent as CalendarIcon } from './calendar.svg';

import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/index.css';

interface Props {
  value: number | null;
  onConfirm: (val: number) => void;
  minDate?: number;
  maxDate?: number;
  valueFormat?: string;
  placeholder?: string;
}

const defaultMinDate = new Date(2020, 12, 1, 0, 0, 0);
const defaultMaxDate = new Date(2099, 12, 1, 23, 59, 59);

const MobileDateTimePickerComp = ({
  value,
  onConfirm,
  minDate,
  maxDate,
  valueFormat,
  placeholder,
}: Props) => {
  const [rmcShow, setRmcShow] = useState(false);
  const [dateValue, setDateValue] = useState(() => {
    const time = getShowDateTime(value, minDate, maxDate);
    return dayjs(time)
      .format('YYYY, MM, DD')
      .split(',')
      .map((i) => Number(i));
  });
  const [timeValue, setTimeValue] = useState(() => {
    const time = getShowDateTime(value, minDate, maxDate);
    return dayjs(time)
      .format('HH, mm')
      .split(',')
      .map((i) => Number(i));
  });
  const [minDateTime, setMinDateTime] = useState<Date>(defaultMinDate);
  const [maxDateTime, setMaxDateTime] = useState<Date>(defaultMaxDate);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [step, setStep] = useState(1);

  const defaultFormat = 'YYYY/MM/DD HH:mm';

  const defaultDate = useMemo(() => {
    const time = getShowDateTime(value, minDate, maxDate);
    return dayjs(time).toDate();
  }, [maxDate, minDate, value]);

  useEffect(() => {
    const time = getShowDateTime(value, minDate, maxDate);
    const newDateValue = dayjs(time)
      .format('YYYY, MM, DD')
      .split(',')
      .map((i) => Number(i));
    const newTimevalue = dayjs(time)
      .format('HH, mm')
      .split(',')
      .map((i) => Number(i));

    setDateValue(newDateValue);
    setTimeValue(newTimevalue);
  }, [maxDate, minDate, value]);

  useEffect(() => {
    if (step === 1) {
      const min = minDate ? dayjs(minDate).toDate() : defaultMinDate;
      const max = maxDate ? dayjs(maxDate).toDate() : defaultMaxDate;

      setMinDateTime(min);
      setMaxDateTime(max);
    } else {
      const isSameWithMinDate = minDate
        ? dayjs(minDate).isSame(dayjs(dateValue.join('/')), 'day')
        : false;

      const isSameWithMaxDate = maxDate
        ? dayjs(maxDate).isSame(dayjs(dateValue.join('/')), 'day')
        : false;

      if (!isSameWithMinDate && !isSameWithMaxDate) {
        setMinDateTime(dayjs().hour(0).minute(0).second(0).toDate());
        setMaxDateTime(dayjs().hour(23).minute(59).second(59).toDate());
      }
      if (isSameWithMinDate && !isSameWithMaxDate) {
        setMaxDateTime(dayjs().hour(23).minute(59).second(59).toDate());
      }
      if (!isSameWithMinDate && isSameWithMaxDate) {
        setMinDateTime(dayjs().hour(0).minute(0).second(0).toDate());
      }
    }
  }, [dateValue, maxDate, minDate, step]);

  const onDateChange = (val: Date) => {
    if (step === 1) {
      setDateValue(
        dayjs(val)
          .format('YYYY, MM, DD')
          .split(',')
          .map((i) => Number(i)),
      );
    } else {
      setTimeValue(
        dayjs(val)
          .format('HH, mm')
          .split(',')
          .map((i) => Number(i)),
      );
    }
  };

  const nexStep = () => {
    setStep(2);
  };

  const closeTimePicker = () => {
    setRmcShow(false);
    setStep(1);
  };

  const confirmTimePicker = () => {
    setRmcShow(false);
    setStep(1);
    onConfirm(
      new Date(`${dateValue.join('/')} ${timeValue.join(':')}`).valueOf(),
    );
  };

  return (
    <Box>
      <Box
        sx={{
          fontSize: 16,
          color: theme.palette.text.primary,
          borderRadius: 8,
          backgroundColor: theme.palette.background.input,
          height: 48,
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => setRmcShow(true)}
      >
        <Box
          sx={{
            flex: 1,
            pl: 12,
            pr: 5,
          }}
        >
          {value || Number.isNaN(value) ? (
            dayjs(value).format(valueFormat || defaultFormat)
          ) : (
            <span style={{ color: '#929397' }}>
              {placeholder || defaultFormat.toUpperCase()}
            </span>
          )}
        </Box>
        <Box
          component={CalendarIcon}
          sx={{
            mr: 20,
          }}
        />
      </Box>

      <Dialog open={rmcShow} onClose={closeTimePicker}>
        <Box
          sx={{
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 20,
            fontWeight: 400,
            fontSize: 14,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.border.main}`,
          }}
        >
          {step === 1 ? (
            <>
              <Box
                onClick={closeTimePicker}
                sx={{
                  width: 70,
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                {t`Cancel`}
              </Box>
              <Box
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {t`Date`}
              </Box>
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 14,
                  fontWeight: 500,
                  width: 70,
                  textAlign: 'right',
                }}
                onClick={nexStep}
              >
                {t`Next`}
              </Box>
            </>
          ) : (
            <>
              <Box
                onClick={() => setStep(1)}
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  width: 70,
                  textAlign: 'left',
                }}
              >
                {t`Last`}
              </Box>
              <Box
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {t`Time`}
              </Box>
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 14,
                  fontWeight: 500,
                  width: 70,
                  textAlign: 'right',
                }}
                onClick={confirmTimePicker}
              >
                {t`Confirm`}
              </Box>
            </>
          )}
        </Box>
        <Box
          sx={{
            '.rmc-date-picker-class': {
              height: 190,
              overflow: 'hidden',
              '.rmc-picker': {
                top: 24,
              },
              '.rmc-picker-mask': {
                display: 'none',
              },
              '.rmc-picker-indicator': {
                height: 48,
                border: 'none',
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
              },
              '.rmc-picker-content': {
                '.rmc-picker-item': {
                  height: 48,
                  lineHeight: '48px',
                  '&.rmc-picker-item-selected': {
                    color: theme.palette.text.primary,
                  },
                },
              },
            },
          }}
        >
          <DatePicker
            className="rmc-date-picker-class"
            defaultDate={defaultDate}
            mode={step === 1 ? 'date' : 'time'}
            minDate={minDateTime}
            maxDate={maxDateTime}
            onDateChange={onDateChange}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export const MobileDateTimePicker: React.FC<Props> = React.memo(
  MobileDateTimePickerComp,
);
