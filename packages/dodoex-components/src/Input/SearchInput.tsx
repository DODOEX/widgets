/* eslint-disable react/jsx-props-no-spreading */
import { merge } from 'lodash';
import { default as Input, InputProps } from './Input';
import { Search, Error } from '@dodoex/icons';
import { useTheme } from '@mui/system';
import { HoverOpacity } from '../Hover';
import { Box } from '../Box';

interface Props extends InputProps {
  hideSearchIcon?: boolean;
  clearValue?: () => void;
}

export default function SearchInput({
  clearValue,
  hideSearchIcon,
  height = 48,
  inputSx,
  ...attrs
}: Props) {
  const theme = useTheme();
  const { value } = attrs;

  return (
    <Input
      prefix={
        !hideSearchIcon ? (
          <Search
            style={{
              width: 24,
              minWidth: 24,
              height: 24,
              color: theme.palette.text.placeholder,
            }}
          />
        ) : null
      }
      suffix={
        value && clearValue ? (
          <HoverOpacity
            sx={{
              width: 24,
              minWidth: 24,
              height: 24,
              mr: 12,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              backgroundColor: 'background.tag',
              cursor: 'pointer',
            }}
            onClick={clearValue}
          >
            <Box
              component={Error}
              sx={{
                width: 14,
                height: 14,
              }}
            />
          </HoverOpacity>
        ) : null
      }
      {...attrs}
      inputSx={merge(
        {
          pl: 4,
        },
        inputSx,
      )}
      height={height}
    />
  );
}
