import { Box, BoxProps } from '@mui/system';
import { merge } from 'lodash';

const ButtonGroup = ({
  children,
  sx,
}: {
  children: BoxProps['children'];
  sx?: BoxProps['sx'];
}) => {
  return (
    <Box
      sx={merge(
        {
          '& > button': {
            '&:first-of-type': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            '&:last-child': {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
            '&:not(:first-of-type):not(:last-child)': {
              borderRadius: 0,
            },
          },
        },
        sx,
      )}
    >
      {children}
    </Box>
  );
};

export default ButtonGroup;
