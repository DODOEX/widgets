import {
  Box,
  BoxProps,
  Select as SelectBase,
  useTheme,
} from '@dodoex/components';
import { merge } from 'lodash';
import React from 'react';

const defaultValue = '_default';

export default function Select<V extends string | number = string>({
  value,
  onChange,
  placeholder,
  options,
  sx,
  readOnly,
  valueOnlyIcon,
}: {
  value: V | undefined;
  onChange: (value: V | undefined) => void;
  placeholder?: string;
  options: Array<{
    logo?: React.ReactNode;
    key: V;
    value: string | React.ReactNode;
  }>;
  sx?: BoxProps['sx'];
  readOnly?: boolean;
  valueOnlyIcon?: boolean;
}) {
  const theme = useTheme();
  return (
    <SelectBase<V | typeof defaultValue>
      value={value ?? defaultValue}
      onChange={(_, v) => {
        const newValue = (typeof value === 'number' && !!v ? Number(v) : v) as
          | V
          | typeof defaultValue;
        onChange(newValue === defaultValue ? undefined : newValue);
      }}
      disabled={readOnly}
      sx={merge(
        {
          padding: theme.spacing(8, 12),
          '& .MuiSelect-select.MuiSelect-select.MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: theme.spacing(8, 12, 8, 12),
            minHeight: 'auto',
            backgroundColor: 'transparent',
            color: 'text.primary',
            borderRadius: 8,
            typography: 'body2',
            fontWeight: 600,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: 'divider',
            '& svg, & img': {
              width: 24,
              height: 24,
            },
            '&:hover, &[aria-expanded="true"]': {
              backgroundColor: 'background.paper',
            },
            '&.Mui-readOnly': {
              color: 'text.disabled',
            },
          },
          '& .MuiSelect-icon': {
            color: readOnly ? 'text.disabled' : 'text.primary',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            display: 'none',
          },
        },
        sx,
      )}
      renderValue={(option) => {
        if (!option?.value || option.value === defaultValue) {
          return (
            <Box
              sx={{
                color: 'text.secondary',
              }}
            >
              {placeholder ?? ''}
            </Box>
          );
        }
        const item = options.find((item) => item.key === value);
        if (!item) return null;
        return (
          <>
            {item.logo}
            {valueOnlyIcon ? '' : item.value}
          </>
        );
      }}
      options={[...options]}
    ></SelectBase>
  );
}
