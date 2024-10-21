import { alpha, Box, Tooltip, useTheme } from '@dodoex/components';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import 'react-datetime/css/react-datetime.css';
import { ReactComponent as CalendarIcon } from './calendar.svg';

interface Props {
  value: number | null;
  onChange: (val: number | null) => void;
  minDate?: number;
  maxDate?: number;
  valueFormat?: string;
  placeholder?: string;
}

enum Position {
  bottom = 'bottom',
  top = 'top',
}

function PCDateTimePickerComponent({
  value,
  onChange,
  minDate,
  maxDate,
  valueFormat,
  placeholder,
}: Props) {
  const [timepickerHeight, setTimepickerHeight] = useState(379);
  const [timepickerPosition, setTimepickerPosition] = useState<Position>(
    Position.bottom,
  );
  // const [timeConstraints, setTimeConstraints] = useState<
  //   Datetime.TimeConstraints | undefined
  // >();
  const datetimeRef = useRef<any>();
  const pcTimepickerInputRef = useRef<HTMLElement | undefined>();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const defaultFormat = 'YYYY/MM/DD HH:mm';

  const onNavigate = (mode: string) => {
    if (mode === 'days') {
      setTimepickerHeight(379);
    }
    if (mode === 'months' || mode === 'years') {
      setTimepickerHeight(280);
    }
    if (mode === 'time') {
      setTimepickerHeight(212);
    }
  };

  const handleInputClick = () => {
    setTimepickerHeight(379);
    const pos = pcTimepickerInputRef?.current?.getBoundingClientRect();
    if (!pos) return;
    if (window.innerHeight - pos.bottom > 379) {
      setTimepickerPosition(Position.bottom);
    } else {
      setTimepickerPosition(Position.top);
    }
  };

  const [dateTimeEle, setDateTimeEle] = useState<React.ReactNode>();
  useEffect(() => {
    const onDateTimeChange = (val: dayjs.Dayjs | string) => {
      if (typeof val === 'string') {
        throw new Error('Date in the input is not valid');
      }
      val?.set('second', 0);
      const changedValue = val?.valueOf();
      onChange?.(changedValue as number);
    };

    const valid = (current: dayjs.Dayjs) => {
      const validMinDate = minDate && dayjs(minDate).subtract(1, 'days');
      const validMaxDate = maxDate && dayjs(maxDate);

      if (minDate && maxDate) {
        return (
          dayjs(current).isAfter(validMinDate) &&
          dayjs(current).isBefore(validMaxDate)
        );
      }
      if (minDate) {
        return dayjs(current).isAfter(validMinDate);
      }
      if (maxDate) {
        return dayjs(current).isBefore(validMaxDate);
      }
      return true;
    };

    const renderView = (mode: string, renderDefault: any) => {
      if (mode === 'time') {
        return (
          <Box>
            <Box
              onClick={() => {
                datetimeRef?.current?.navigate('days');
              }}
              sx={{
                width: 20,
                height: 20,
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 20,
                top: 20,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 21,
                '&:hover': {
                  background: alpha(theme.palette.text.primary, 0.04),
                },
              }}
            >
              &lt;
            </Box>
            {renderDefault()}
          </Box>
        );
      }

      return renderDefault();
    };

    async function dynamicImportReactDatetime() {
      const { default: Datetime } = await import('react-datetime');
      setDateTimeEle(
        <Datetime
          initialValue={dayjs(value).toDate()}
          // value={dayjs(value).toDate()}
          input={false}
          onNavigate={onNavigate}
          renderView={renderView}
          ref={datetimeRef}
          onChange={onDateTimeChange}
          isValidDate={valid}
          timeFormat="HH:mm A"
        />,
      );
    }
    dynamicImportReactDatetime();
  }, [maxDate, minDate, onChange, theme.palette.text.primary, value]);

  return (
    <>
      <Tooltip
        title={
          <Box
            sx={{
              '.rdtPicker': {
                width: 345,
                height: timepickerHeight,
                background: isLight
                  ? '#F6F6F6'
                  : theme.palette.background.paperContrast,
                borderRadius: 20,
                // mt: 6,
                p: 0,
                px: 20,
                border: 'none',
                '.rdtDays': {
                  table: {
                    borderCollapse: 'collapse',
                    tr: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                    'thead tr:first-of-type': {
                      height: 57,
                      borderBottom: `1px solid ${theme.palette.border.main}`,
                      '.rdtPrev, .rdtNext': {
                        border: 'none',
                        '&:hover': {
                          background: 'none',
                        },
                        '& > span': {
                          display: 'inline-block',
                          width: 20,
                          height: 20,
                          lineHeight: '18px',
                          borderRadius: 4,
                          '&:hover': {
                            background: alpha(theme.palette.text.primary, 0.04),
                          },
                        },
                      },
                      '.rdtSwitch': {
                        width: 'auto',
                        height: 'auto',
                        fontSize: 18,
                        border: 'none',
                        borderRadius: 8,
                        px: 16,
                        py: 8,
                        '&:hover': {
                          background: alpha(theme.palette.text.primary, 0.04),
                        },
                      },
                    },
                    'thead tr:last-of-type': {
                      fontWeight: 600,
                      th: {
                        mt: 20,
                        width: 'auto',
                      },
                    },
                    tbody: {
                      tr: {
                        mt: 8,
                        '&:last-of-type': {
                          mb: 18,
                        },
                      },
                      td: {
                        borderRadius: 4,
                        width: 26,
                        height: 26,
                        lineHeight: '26px',
                        '&.rdtActive': {
                          color: isLight
                            ? theme.palette.text.primary
                            : theme.palette.primary.contrastText,
                          backgroundColor: isLight
                            ? theme.palette.secondary.main
                            : theme.palette.primary.dark,
                          textShadow: 'none',
                        },
                        '&:hover:not(.rdtActive)': {
                          background: alpha(theme.palette.text.primary, 0.04),
                        },
                        '&.rdtToday::before': {
                          display: 'none',
                        },
                      },
                      'td.rdtOld, td.rdtNew': {
                        color: alpha(theme.palette.text.primary, 0.5),
                      },
                    },
                    tfoot: {
                      borderTop: `1px solid ${theme.palette.border.main}`,
                      fontWeight: 600,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      pt: 5,
                      '.rdtTimeToggle': {
                        borderRadius: 8,
                        width: 305,
                        height: 38,
                        textAlign: 'center',
                        lineHeight: '38px',
                        '&:hover': {
                          background: alpha(theme.palette.text.primary, 0.04),
                        },
                      },
                    },
                  },
                },
                '.rdtMonths, .rdtYears': {
                  'table:first-of-type': {
                    borderCollapse: 'collapse',
                    'thead tr': {
                      height: 57,
                      borderBottom: `1px solid ${theme.palette.border.main}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '.rdtPrev, .rdtNext': {
                        border: 'none',
                        '&:hover': {
                          background: 'none',
                        },
                        '& > span': {
                          display: 'inline-block',
                          width: 20,
                          height: 20,
                          lineHeight: '18px',
                          borderRadius: 4,
                          '&:hover': {
                            background: alpha(theme.palette.text.primary, 0.04),
                          },
                        },
                      },
                      '.rdtSwitch': {
                        fontSize: 18,
                        border: 'none',
                        borderRadius: 8,
                        width: 'auto',
                        height: 'auto',
                        px: 16,
                        py: 8,
                        '&:hover': {
                          background: alpha(theme.palette.text.primary, 0.04),
                        },
                      },
                    },
                  },
                  'table:last-of-type': {
                    'tbody tr': {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 40,
                      '&:first-of-type': {
                        mt: 12,
                      },
                      td: {
                        width: 64,
                        height: 38,
                        textAlign: 'center',
                        lineHeight: '38px',
                      },
                    },
                    '.rdtMonth, .rdtYear': {
                      fontWeight: 600,
                      borderRadius: 8,
                      '&.rdtActive': {
                        color: theme.palette.primary.contrastText,
                        backgroundColor: isLight
                          ? theme.palette.secondary.main
                          : theme.palette.primary.dark,
                      },
                      '&:hover:not(.rdtActive)': {
                        background: alpha(theme.palette.text.primary, 0.04),
                      },
                    },
                  },
                },
                '.rdtTime': {
                  table: {
                    thead: {
                      tr: {
                        height: 57,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: `1px solid ${theme.palette.border.main}`,
                        '.rdtSwitch': {
                          fontSize: 18,
                          fontWeight: 600,
                          width: 133,
                          height: 41,
                          lineHeight: '41px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          '&:hover': {
                            background: alpha(theme.palette.text.primary, 0.04),
                          },
                        },
                      },
                    },
                    tbody: {
                      display: 'flex',
                      justifyContent: 'center',
                      height: 155,
                      alignItems: 'center',
                      '.rdtCounters': {
                        display: 'flex',
                        '.rdtCounter': {
                          float: 'none',
                          height: 115,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'column',
                          fontSize: 12,
                          '&:last-of-type': {
                            ml: 10,
                          },
                        },
                        '.rdtCount': {
                          fontWeight: 600,
                          fontSize: 16,
                        },
                        '.rdtCounterSeparator': {
                          width: 50,
                          fontWeight: 600,
                          float: 'none',
                          height: 115,
                          lineHeight: '115px',
                        },
                        '.rdtBtn': {
                          width: 18,
                          height: 18,
                          lineHeight: '18px',
                          borderRadius: 4,
                          '&:hover': {
                            background: alpha(theme.palette.text.primary, 0.04),
                          },
                        },
                      },
                    },
                  },
                },
              },
            }}
          >
            {dateTimeEle}
          </Box>
        }
      >
        <Box
          ref={pcTimepickerInputRef}
          sx={{
            fontSize: 16,
            color: theme.palette.text.primary,
            borderRadius: 8,
            backgroundColor: theme.palette.background.input,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': {
              '.calendar-icon': {
                opacity: 0.5,
              },
            },
          }}
          onClick={handleInputClick}
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
            sx={{
              height: '100%',
              width: 38,
              borderRadius: 8,
              position: 'absolute',
              top: 0,
              right: 0,
              pr: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isLight
                ? 'rgb(240, 240, 240)'
                : 'rgb(37, 40, 49)',
            }}
          >
            <Box className="calendar-icon" component={CalendarIcon} sx={{}} />
          </Box>
        </Box>
      </Tooltip>
    </>
  );
}

export const PCDateTimePicker: React.FC<Props> = React.memo(
  PCDateTimePickerComponent,
);
