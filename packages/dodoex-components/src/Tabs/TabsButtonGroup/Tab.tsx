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
  padding: 12px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.text.secondary};
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;

  &:not(.${tabClasses.selected}):hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    position: relative;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    color: ${({ theme }) => theme.palette.secondary.contrastText};
  }
`;

const TabInPaperStyle = styled(BaseTab)`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.text.secondary};
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;

  &:not(.${tabClasses.selected}):hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    position: relative;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    color: ${({ theme }) => theme.palette.secondary.contrastText};
  }
`;

const TabTagStyle = styled(BaseTab)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  height: 30px;
  background-color: transparent;
  color: ${({ theme }) => theme.palette.text.primary};
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;

  &:not(.${tabClasses.selected}):hover {
    background-color: ${({ theme }) => theme.palette.background.tag};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    position: relative;
    background-color: ${({ theme }) => theme.palette.background.tag};
  }
`;

export interface TabProps extends BaseTabProps {
  sx?: BoxProps['sx'];
  variant?: 'default' | 'inPaper' | 'tag';
}
export const Tab = React.forwardRef(function TabsList(
  { sx, variant: variantProps, ...props }: TabProps,
  ref,
) {
  const variant = variantProps ?? 'default';
  const variantComponentObject = {
    default: TabStyle,
    inPaper: TabInPaperStyle,
    tag: TabTagStyle,
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
