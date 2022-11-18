import { styled } from '@mui/system';
import { Box } from '../Box';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';

// const BaseButtonStyle = styled(ButtonUnstyled)``;
const BaseButton = styled(ButtonUnstyled)`
  margin: 0;
  border: none;
  padding: 0;
  cursor: pointer;
  background: none;
  font-family: inherit;
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }
`;

export default BaseButton;
