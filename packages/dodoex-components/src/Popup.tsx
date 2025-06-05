import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Box, BoxProps } from '@mui/system';
import { useState } from 'react';
import { ButtonBase } from './Button';

export function Popup({
  children,
  triggerChildren,
  triggerSx,
  titleSx,
}: {
  children: React.ReactNode;
  triggerChildren: React.ReactNode;
  triggerSx?: BoxProps['sx'];
  titleSx?: BoxProps['sx'];
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchor(null);
  };

  const popupOpen = Boolean(anchor);
  const id = popupOpen ? 'simple-popper' : undefined;

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <Box
        role="presentation"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: popupOpen ? 1500 : undefined,
        }}
      >
        <ButtonBase
          sx={{
            ...triggerSx,
          }}
          onClick={handleClick}
          aria-describedby={id}
        >
          {triggerChildren}
        </ButtonBase>
        <BasePopup
          id={id}
          open={popupOpen}
          anchor={anchor}
          placement="bottom-end"
          offset={0}
          disablePortal
          strategy="fixed"
        >
          <Box
            sx={{
              minWidth: '204px',
              px: 12,
              py: 8,
              borderRadius: 8,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(29, 29, 29, 0.10)',
              boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.10)',
              ...titleSx,
            }}
          >
            {children}
          </Box>
        </BasePopup>
      </Box>
    </ClickAwayListener>
  );
}
