import { alpha, styled } from '@mui/system';
import {
  Tab as BaseTab,
  tabClasses,
  TabProps as BaseTabProps,
} from '@mui/base/Tab';
import { buttonClasses } from '@mui/base';
import React from 'react';
import { Box, BoxProps } from '../../Box';

const TabStyle = styled(BaseTab)`
  min-height: 38px;
  padding: 20px 16px;
  margin: 0;
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

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    position: relative;
    background-color: transparent;
    color: ${({ theme }) => theme.palette.text.link};
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: ${({ theme }) => theme.palette.text.link};
    }
  }
`;

const TabRoundedStyle = styled(BaseTab)`
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

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    background-color: ${({ theme }) => theme.palette.tabActive.main};
    color: ${({ theme }) => theme.palette.tabActive.contrastText};
  }
`;

export interface TabProps extends BaseTabProps {
  sx?: BoxProps['sx'];
  variant?: 'default' | 'rounded';
}
export const Tab = React.forwardRef<HTMLDivElement, TabProps>(function TabsList(
  { sx, variant: variantProps, ...props },
  ref,
) {
  const variant = variantProps ?? 'default';
  const variantComponentObject = {
    default: TabStyle,
    rounded: TabRoundedStyle,
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
