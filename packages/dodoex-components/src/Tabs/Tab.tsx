import { alpha, styled } from '@mui/system';
import { Tab as BaseTab, tabClasses, TabProps } from '@mui/base/Tab';
import { buttonClasses } from '@mui/base';
import React from 'react';
import { Box, BoxProps } from '../Box';

const TabStyle = styled(BaseTab)`
  min-height: 38px;
  padding: 8px 16px;
  margin-bottom: 16px;
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
const TabSecondaryStyle = styled(TabStyle)`
  padding: 20px 16px;
  margin: 0;
  color: ${({ theme }) => theme.palette.text.secondary};
  &.${tabClasses.selected} {
    position: relative;
    background-color: transparent;
    color: ${({ theme }) => theme.palette.text.primary};
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      width: 28px;
      height: 2px;
      background-color: ${({ theme }) => theme.palette.text.primary};
    }
  }
`;

export const Tab = React.forwardRef(function TabsList(
  {
    sx,
    variant: variantProps,
    ...props
  }: TabProps & {
    sx?: BoxProps['sx'];
    variant?: 'default' | 'secondary';
  },
  ref,
) {
  const variant = variantProps ?? 'default';
  const variantComponentObject = {
    default: TabStyle,
    secondary: TabSecondaryStyle,
  };
  return (
    <Box
      component={variantComponentObject[variant]}
      {...props}
      ref={ref}
      sx={sx}
    />
  );
});
