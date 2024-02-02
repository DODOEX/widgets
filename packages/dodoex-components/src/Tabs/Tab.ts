import { alpha, styled } from '@mui/system';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { buttonClasses } from '@mui/base';

export const Tab = styled(BaseTab)`
  min-height: 38px;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.text.primary};
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;

  &:not(.${tabClasses.selected}):hover {
    opacity: 0.5;
  }

  &.${tabClasses.selected} {
    background-color: ${({ theme }) =>
      alpha(theme.palette.secondary.main, 0.2)};
    color: ${({ theme }) => theme.palette.secondary.contrastText};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
