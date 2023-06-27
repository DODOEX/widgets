import { styled } from '@mui/system';
import Button from '@mui/base/Button';

// const BaseButtonStyle = styled(ButtonUnstyled)``;
const BaseButton = styled(Button)`
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
