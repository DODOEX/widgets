import { Snackbar } from '@mui/base/Snackbar';
import { SnackbarCloseReason } from '@mui/base/useSnackbar';
import { Box, useTheme } from '@dodoex/components';
import { Transition } from 'react-transition-group';
import Countdown from './Countdown';
import { useMessageState } from '../../hooks/useMessageState';
import React from 'react';

// function TransitionComponent(props: any) {
//   const { isMobile } = useDevices();
//   return (
//     <Fade in timeout={{ enter: 560, exit: 160 }}>
//       <div>
//         <Slide
//           {...props}
//           timeout={{ enter: 400, exit: 160 }}
//           direction={isMobile ? 'down' : 'left'}
//         />
//       </div>
//     </Fade>
//   );
// }

const positioningStyles = {
  entering: 'translateX(0)',
  entered: 'translateX(0)',
  exiting: 'translateX(500px)',
  exited: 'translateX(500px)',
  unmounted: 'translateX(500px)',
};

export default function Message() {
  const theme = useTheme();
  const { notify, close } = useMessageState();
  const [exited, setExited] = React.useState(true);
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const timeout = notify?.timeout;
  const open = !!notify;

  const handleOnEnter = () => {
    setExited(false);
  };

  const handleOnExited = () => {
    setExited(true);
  };

  let icon = (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="16.5" stroke="#2FBA90" strokeWidth="3" />
      <path
        d="M25.1384 11.334L14.8873 21.5851L10.8584 17.5718L8.66504 19.7651L14.8873 25.9873L27.3317 13.5429L25.1384 11.334Z"
        fill="#2FBA90"
      />
    </svg>
  );
  switch (notify?.type) {
    case 'error':
      icon = (
        <svg
          width="36"
          height="37"
          viewBox="0 0 36 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="18" cy="18.5" r="16.5" stroke="#FF6187" strokeWidth="3" />
          <path
            d="M25.3331 13.0452L19.8782 18.5L25.3331 23.9548L23.5148 25.7731L18.06 20.3183L12.6051 25.7731L10.7869 23.9548L16.2417 18.5L10.7869 13.0452L12.6051 11.2269L18.06 16.6817L23.5148 11.2269L25.3331 13.0452Z"
            fill="#FF6187"
          />
        </svg>
      );
      break;
    case 'warning':
      icon = (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.4065 3.6189L9.62438 3.59576L3.39812 9.78928L3.37498 18.5714L9.5685 24.7976L18.3506 24.8208L24.5769 18.6273L24.6 9.84516L18.4065 3.6189ZM26.9359 8.88481L19.3791 1.28812L8.66403 1.25988L1.06734 8.81663L1.0391 19.5317L8.59585 27.1284L19.311 27.1567L26.9076 19.5999L26.9359 8.88481Z"
            fill="#B15600"
          />
          <path
            d="M15.1664 7.58398H12.8331V16.9173H15.1664V7.58398Z"
            fill="#B15600"
          />
          <path
            d="M13.9998 21.6395C14.8896 21.6395 15.6109 20.9181 15.6109 20.0283C15.6109 19.1386 14.8896 18.4172 13.9998 18.4172C13.11 18.4172 12.3887 19.1386 12.3887 20.0283C12.3887 20.9181 13.11 21.6395 13.9998 21.6395Z"
            fill="#B15600"
          />
        </svg>
      );

    default:
      break;
  }

  const mobileSpace = 20;
  return (
    <Box
      component={Snackbar}
      open={open}
      autoHideDuration={timeout}
      onClose={(_: any, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        close();
      }}
      exited={exited}
      sx={{
        position: 'fixed',
        top: mobileSpace,
        left: mobileSpace,
        right: mobileSpace,
        zIndex: 1,
        [theme.breakpoints.up('tablet')]: {
          left: 'auto',
        },
      }}
    >
      <Transition
        timeout={{ enter: 400, exit: 400 }}
        in={open}
        appear
        unmountOnExit
        onEnter={handleOnEnter}
        onExited={handleOnExited}
        nodeRef={nodeRef}
      >
        {(status) => (
          <Box
            ref={nodeRef}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 12,
              borderRadius: 8,
              backgroundColor: 'background.paper',
              color: 'text.primary',
              border: 'solid 1px',
              borderColor: 'border.main',
              boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.10)',
              transform: positioningStyles[status],
              transition: 'transform 300ms ease',
              [theme.breakpoints.up('tablet')]: {
                p: 20,
                width: 'auto',
                maxWidth: 328,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* icon */}
              <Box
                sx={{
                  mt: 7,
                  '& > svg': {
                    width: 28,
                    height: 28,
                  },
                  [theme.breakpoints.up('tablet')]: {
                    '& > svg': {
                      width: 36,
                      height: 36,
                    },
                  },
                }}
              >
                {notify ? icon : ''}
              </Box>
              {/* main */}
              <Box
                sx={{
                  ml: 20,
                }}
              >
                <Box
                  sx={{
                    typography: 'caption',
                  }}
                >
                  {notify?.message}
                </Box>
                {notify?.link ? (
                  <Box
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={notify.link.outerLink}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      typography: 'body2',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                  >
                    {notify.link.text}
                    <Box
                      component="svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      sx={{
                        ml: 4,
                        width: 18,
                        height: 18,
                      }}
                    >
                      <path
                        d="M4.22703 13.2122L10.6811 6.75812L4.75206 6.75812L4.75736 5.25729H13.2426V13.7426H11.7471L11.7418 7.81878L5.28769 14.2729L4.22703 13.2122Z"
                        fill="currentColor"
                      />
                    </Box>
                  </Box>
                ) : (
                  ''
                )}
                {notify?.content ? (
                  <Box
                    sx={{
                      mt: 4,
                      typography: 'body2',
                      color: 'text.secondary',
                    }}
                  >
                    {notify.content}
                  </Box>
                ) : (
                  ''
                )}
              </Box>
            </Box>
            {/* close */}
            <Box
              sx={{
                flexShrink: 0,
                position: 'relative',
                top: 10,
                ml: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: 12,
                borderStyle: 'solid',
                borderWidth: timeout ? '2.4px' : 0,
                borderColor: theme.palette.border.main,
                backgroundColor: timeout
                  ? 'transparent'
                  : theme.palette.background.paperDarkContrast,
                cursor: 'pointer',
                boxSizing: 'border-box',
                [theme.breakpoints.up('tablet')]: {
                  ml: 28,
                },
              }}
              onClick={close}
            >
              {timeout ? (
                <Countdown
                  size={24}
                  strokeWidth="2.4px"
                  time={`${timeout}ms`}
                  color={theme.palette.text.disabled}
                />
              ) : (
                ''
              )}
              <Box
                component="svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 16,
                  height: 16,
                  border: 'none',
                  color: theme.palette.text.disabled,
                }}
              >
                <g>
                  <path
                    d="M12.8897 4.36345L9.25313 8L12.8897 11.6365L11.6775 12.8487L8.04095 9.21218L4.4044 12.8487L3.19221 11.6365L6.82876 8L3.19221 4.36345L4.4044 3.15127L8.04095 6.78782L11.6775 3.15127L12.8897 4.36345Z"
                    fill="currentColor"
                  />
                </g>
              </Box>
            </Box>
          </Box>
        )}
      </Transition>
    </Box>
  );
}
