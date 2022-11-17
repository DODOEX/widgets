import { Box as MUIBox, BoxProps as MUIBoxProps } from '@mui/system';

export interface BoxProps extends MUIBoxProps {
  children?: React.ReactNode | React.ReactNode[];
}
export default MUIBox;
