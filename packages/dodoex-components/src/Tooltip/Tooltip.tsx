import ClickAwayListener from '@mui/base/ClickAwayListener';
import PopperUnstyled, {
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
  onlyHover?: boolean;
}

const tooltipClasses = {
  arrow: 'DODOTooltip-arrow',
};

const StyledTooltipRoot = styled('div')(
  ({ theme }) => `
  z-index: ${(theme.zIndex as ZIndex)?.tooltip};
  &[data-popper-placement*="bottom"] .${tooltipClasses.arrow} {
    bottom: 0;
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
  maxWidth = 'auto',
  popperOptions,
  children,
  onlyHover,
  ...attrs
}: TooltipProps) {
  const theme = useTheme();
  const { isMobile } = useDevices();
  const enterTooltip = useRef(false);
  const enterTrigger = useRef(false);
  const leaveTimer = useRef<NodeJS.Timeout>();

  const [childrenRef, setChildrenRef] = useState<HTMLDivElement>();
  const [arrowRef, setArrowRef] = useState<HTMLDivElement>();

  const [open, setOpen] = useState(false);
  const clickEmit = isMobile && !onlyHover;

  const handleOverTooltip: MouseEventHandler<HTMLDivElement> = () => {
    if (clickEmit) return;
    enterTooltip.current = true;
    clearTimeout(leaveTimer.current);
  };

  const handleOutTooltip: MouseEventHandler<HTMLDivElement> = () => {
    if (clickEmit) return;
    enterTooltip.current = false;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      if (!enterTrigger.current && !enterTooltip.current) {
        setOpen(false);
      }
    }, 200);
  };

  const childrenProps: any = {
    ref: setChildrenRef,
  };

  if (!clickEmit) {
    const onMouseEnter = () => {
      enterTrigger.current = true;
      clearTimeout(leaveTimer.current);
      setOpen(true);
    };
    const onMouseLeave = () => {
      enterTrigger.current = false;
      clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => {
        if (!enterTrigger.current && !enterTooltip.current) {
          setOpen(false);
        }
      }, 200);
    };
    childrenProps.onMouseOut = onMouseEnter;
    childrenProps.onMouseEnter = onMouseEnter;
    childrenProps.onMouseLeave = onMouseLeave;
  } else {
    childrenProps.onClick = () => {
      setOpen(true);
    };
  }

  useEffect(() => {
    return () => {
      setOpen(false);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  return (
    <>
      <PopperUnstyled
        open={open}
        anchorEl={childrenRef}
        // @ts-ignore: Unreachable code error
        components={{
          Root: StyledTooltipRoot,
        }}
        style={{
          zIndex: `${(theme.zIndex as ZIndex)?.tooltip}`,
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
              {
                name: 'arrow',
                options: {
                  element: arrowRef,
                  padding: 4,
                },
              },
            ],
          },
          popperOptions,
        )}
        {...attrs}
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
      </PopperUnstyled>
      <ClickAwayListener
        onClickAway={() => {
          if (clickEmit) {
            setOpen(false);
          }
        }}
      >
        {cloneElement(children, childrenProps)}
      </ClickAwayListener>
    </>
  );
}
