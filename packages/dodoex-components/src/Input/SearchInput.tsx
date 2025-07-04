/* eslint-disable react/jsx-props-no-spreading */
import { Error } from '@dodoex/icons';
import { useTheme } from '@mui/system';
import { merge } from 'lodash';
import { Box } from '../Box';
import { HoverOpacity } from '../Hover';
import { default as Input, InputProps } from './Input';

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
          <Box
            sx={{
              color: theme.palette.text.placeholder,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clipPath="url(#clip0_11046_4062)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.87573 3.00239C6.5828 3.00239 5.34283 3.516 4.42859 4.43024C3.51435 5.34448 3.00073 6.58446 3.00073 7.87739C3.00073 9.17032 3.51435 10.4103 4.42859 11.3245C5.34283 12.2388 6.5828 12.7524 7.87573 12.7524C9.16866 12.7524 10.4086 12.2388 11.3229 11.3245C12.2371 10.4103 12.7507 9.17032 12.7507 7.87739C12.7507 6.58446 12.2371 5.34448 11.3229 4.43024C10.4086 3.516 9.16866 3.00239 7.87573 3.00239ZM1.50073 7.87739C1.50082 6.86083 1.74401 5.85904 2.21 4.95558C2.676 4.05212 3.3513 3.27321 4.17955 2.68381C5.0078 2.09442 5.96499 1.71164 6.97126 1.56742C7.97754 1.42319 9.00371 1.5217 9.96417 1.85472C10.9246 2.18774 11.7915 2.74562 12.4925 3.48182C13.1935 4.21801 13.7083 5.11117 13.9939 6.08677C14.2796 7.06238 14.3277 8.09214 14.1344 9.09015C13.9411 10.0882 13.512 11.0255 12.8827 11.8239L15.6217 14.5629C15.7584 14.7043 15.8339 14.8938 15.8322 15.0904C15.8305 15.2871 15.7517 15.4752 15.6126 15.6143C15.4735 15.7533 15.2854 15.8322 15.0888 15.8339C14.8921 15.8356 14.7027 15.76 14.5612 15.6234L11.8222 12.8844C10.8822 13.6254 9.75253 14.0868 8.56253 14.2157C7.37252 14.3447 6.17025 14.136 5.0933 13.6136C4.01636 13.0911 3.10825 12.2761 2.47291 11.2616C1.83756 10.2472 1.50065 9.07436 1.50073 7.87739ZM7.12573 5.25239C7.12573 5.05348 7.20475 4.86271 7.3454 4.72206C7.48605 4.58141 7.67682 4.50239 7.87573 4.50239C8.77084 4.50239 9.62928 4.85797 10.2622 5.4909C10.8952 6.12384 11.2507 6.98228 11.2507 7.87739C11.2507 8.0763 11.1717 8.26707 11.0311 8.40772C10.8904 8.54837 10.6996 8.62739 10.5007 8.62739C10.3018 8.62739 10.1111 8.54837 9.9704 8.40772C9.82975 8.26707 9.75073 8.0763 9.75073 7.87739C9.75073 7.38011 9.55319 6.90319 9.20156 6.55156C8.84993 6.19993 8.37301 6.00239 7.87573 6.00239C7.67682 6.00239 7.48605 5.92337 7.3454 5.78272C7.20475 5.64207 7.12573 5.4513 7.12573 5.25239Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_11046_4062">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Box>
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
