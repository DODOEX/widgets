import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import {
  Popper as PopperUnstyled,
  PopperProps as PopperUnstyledProps,
} from '@mui/base/Popper';
import { styled } from '@mui/system';
import { Box, BoxProps } from '../Box';
import { merge } from 'lodash';
import {
  cloneElement,
  JSXElementConstructor,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDevices } from '../hooks';
import { ZIndex } from '../theme/config';
import { useTheme } from '../theme';

const arrowHeight = 8;

export interface TooltipProps {
  title: React.ReactNode | string;
  maxWidth?: string | number;
  sx?: BoxProps['sx'];
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  container?: PopperUnstyledProps['container'];
  direction?: PopperUnstyledProps['direction'];
  disablePortal?: PopperUnstyledProps['disablePortal'];
  placement?: PopperUnstyledProps['placement'];
  popperOptions?: PopperUnstyledProps['popperOptions'];
  transition?: PopperUnstyledProps['transition'];
  // @ts-ignore: Unreachable code error
  componentsProps?: PopperUnstyledProps['componentsProps'];
  PopperProps?: Partial<PopperUnstyledProps>;
  onlyHover?: boolean;
  onlyClick?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  enterDelay?: number;
  leaveDelay?: number;
  arrow?: boolean;
  disabled?: boolean;
}

export const tooltipClasses = {
  arrow: 'DODOTooltip-arrow',
};

const StyledTooltipRoot = styled('div')(
  ({ theme }) => `
  z-index: ${(theme.zIndex as ZIndex)?.tooltip};
  &[data-popper-placement*="bottom"] .${tooltipClasses.arrow} {
    top: 0;
    margin-top: -${arrowHeight}px;
    &::before {
      transform-origin: 0 100%;
    }
  }
  &[data-popper-placement*="top"] .${tooltipClasses.arrow} {
    bottom: 0;
    margin-bottom: -${arrowHeight}px;
    &::before {
      transform-origin: 100% 0;
    }
  }
  &[data-popper-placement*="right"] .${tooltipClasses.arrow} {
    &::before {
      transform-origin: 100% 100%;
    }
  }
  &[data-popper-placement*="left"] .${tooltipClasses.arrow} {
    &::before {
      transform-origin: 0 0;
    }
  }
  `,
);

export default function Tooltip({
  title,
  sx,
  maxWidth = 'none',
  popperOptions,
  children,
  onlyHover,
  onlyClick,
  /** This prop won't impact the enter click delay  */
  enterDelay = 100,
  /** This prop won't impact the enter click delay  */
  leaveDelay = 0,
  arrow = true,
  PopperProps,
  open: openProps,
  onOpen,
  onClose,
  disabled,
  placement = 'top',
  ...attrs
}: TooltipProps) {
  const theme = useTheme();
  const { isMobile } = useDevices();
  const enterTooltip = useRef(false);
  const enterTrigger = useRef(false);
  const enterTimer = useRef<NodeJS.Timeout>();
  const leaveTimer = useRef<NodeJS.Timeout>();

  const [childrenRef, setChildrenRef] = useState<HTMLDivElement>();
  const [arrowRef, setArrowRef] = useState<HTMLDivElement>();

  const [open, setOpen] = useState(false);
  const clickEmit = onlyClick || (isMobile && !onlyHover);

  const handleChangeOpen = (value: boolean) => {
    if (value) {
      if (openProps === undefined) {
        setOpen(true);
      }
      if (onOpen) {
        onOpen();
      }
    } else {
      if (openProps === undefined) {
        setOpen(false);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  const handleOverTooltip: MouseEventHandler<HTMLDivElement> = () => {
    if (disabled || clickEmit) return;
    enterTooltip.current = true;
    clearTimeout(leaveTimer.current);
    clearTimeout(enterTimer.current);
  };

  const handleOutTooltip: MouseEventHandler<HTMLDivElement> = () => {
    if (disabled || clickEmit) return;
    enterTooltip.current = false;
    clearTimeout(leaveTimer.current);
    clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => {
      if (!enterTrigger.current && !enterTooltip.current) {
        handleChangeOpen(false);
      }
    }, leaveDelay);
  };

  const childrenProps: any = {
    ref: setChildrenRef,
  };

  if (!disabled) {
    if (!clickEmit) {
      const onMouseEnter = () => {
        enterTrigger.current = true;
        clearTimeout(leaveTimer.current);
        clearTimeout(enterTimer.current);
        enterTimer.current = setTimeout(() => {
          handleChangeOpen(true);
        }, enterDelay);
      };
      const onMouseLeave = () => {
        enterTrigger.current = false;
        clearTimeout(leaveTimer.current);
        clearTimeout(enterTimer.current);
        leaveTimer.current = setTimeout(() => {
          if (!enterTrigger.current && !enterTooltip.current) {
            handleChangeOpen(false);
          }
        }, leaveDelay);
      };
      childrenProps.onMouseOut = onMouseEnter;
      childrenProps.onMouseEnter = onMouseEnter;
      childrenProps.onMouseLeave = onMouseLeave;
    } else {
      childrenProps.onClick = (evt: any) => {
        evt.stopPropagation();
        if (typeof children === 'object' && children.props.onClick) {
          children.props.onClick(evt);
        }
        handleChangeOpen(true);
      };
    }
  }

  useEffect(() => {
    return () => {
      handleChangeOpen(false);
      clearTimeout(leaveTimer.current);
      clearTimeout(enterTimer.current);
    };
  }, []);

  return (
    <>
      <PopperUnstyled
        open={openProps ?? open}
        anchorEl={childrenRef}
        slots={{
          root: StyledTooltipRoot,
        }}
        popperOptions={merge(
          {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  padding: 20,
                },
              },
              ...(arrow
                ? [
                    {
                      name: 'arrow',
                      options: {
                        element: arrowRef,
                        padding: 4,
                      },
                    },
                  ]
                : []),
            ],
          },
          popperOptions,
        )}
        placement={placement}
        {...attrs}
        {...PopperProps}
      >
        <Box
          sx={{
            typography: 'h6',
            padding: 12,
            maxWidth,
            fontWeight: 500,
            backgroundColor: 'background.paperContrast',
            borderRadius: 8,
            color: 'text.secondary',
            borderColor: 'border.main',
            borderWidth: 1,
            borderStyle: 'solid',
            whiteSpace: 'pre-wrap',
            ...sx,
          }}
          onMouseEnter={handleOverTooltip}
          onMouseLeave={handleOutTooltip}
          onClick={(e) => e.stopPropagation()}
        >
          {title}
        </Box>
        {arrow && (
          <Box
            ref={setArrowRef}
            className={tooltipClasses.arrow}
            sx={{
              overflow: 'hidden',
              position: 'absolute',
              width: 16,
              height: arrowHeight + 1,
              boxSizing: 'border-box',
              color: 'background.paperContrast',
              bottom: 0,
              marginBottom: -arrowHeight,
              '&::before': {
                transformOrigin: '100% 0',
                content: '""',
                margin: 'auto',
                display: 'block',
                width: '100%',
                height: '100%',
                backgroundColor: 'currentColor',
                transform: 'rotate(45deg)',
                border: 'solid 1px',
                borderColor: 'border.main',
              },
            }}
          />
        )}
      </PopperUnstyled>
      <ClickAwayListener
        onClickAway={() => {
          if (clickEmit) {
            handleChangeOpen(false);
          }
        }}
      >
        {cloneElement(children, childrenProps)}
      </ClickAwayListener>
    </>
  );
}
