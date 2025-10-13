import {
  Select as BaseSelect,
  SelectProps,
  selectClasses,
  SelectRootSlotProps,
  SelectListboxSlotProps,
  SelectTypeMap,
} from '@mui/base/Select';
import {
  Option as BaseOption,
  optionClasses,
  OptionProps,
} from '@mui/base/Option';
import { size, flip, offset, shift } from '@floating-ui/dom';
import { Box, BoxProps } from '../Box';
import React from 'react';
import { styled, useTheme } from '@mui/system';
import { CssTransition, PopupContext } from '@mui/base';
import { ButtonBase } from '../Button';

const Option = BaseOption;

export type SelectOption<V = number | string> = {
  key: V;
  value: string | React.ReactNode;
} & {
  [key in string]?: any;
};

const Listbox = styled('ul')(
  ({ theme }) => `
  box-sizing: border-box;
  padding: 8px 0;
  margin: 0;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.background.paper};
  border: 1px solid ${theme.palette.border.main};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  
  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `,
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox<
  Value extends {},
  Multiple extends boolean,
>(
  props: SelectListboxSlotProps<Value, Multiple>,
  ref: React.ForwardedRef<HTMLUListElement>,
) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
    );
  }

  const verticalPlacement = popupContext.placement.split('-')[0];

  return (
    <Box
      component={CssTransition}
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Listbox {...other} ref={ref} />
    </Box>
  );
});

const Button = React.forwardRef(function Button<
  TValue extends {},
  Multiple extends boolean,
>(
  props: SelectRootSlotProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ownerState, ...other } = props;
  return (
    <ButtonBase
      type="button"
      {...other}
      ref={ref}
      sx={{
        typography: 'body1',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'border.main',
        borderRadius: 8,
        backgroundColor: 'background.input',
      }}
    >
      {other.children}
      <Box
        component="span"
        className="icon"
        sx={{
          display: 'inline-block',
          width: 0,
          height: 0,
          ml: 4,
          mr: 0,
          borderStyle: 'solid',
          borderWidth: '6px 4px 0 4px',
          borderColor: 'transparent',
          borderTopColor: 'text.primary',
        }}
      />
    </ButtonBase>
  );
});

function OptionStyle(props: OptionProps<any, 'li'>) {
  const theme = useTheme();
  return (
    <Box
      component={Option}
      {...props}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(6, 16),
        color: 'text.secondary',
        minHeight: 48,
        cursor: 'pointer',
        mx: 12,
        borderRadius: 8,
        '&::after': {
          content: '""',
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: 4,
          ml: 12,
          backgroundColor: 'primary.main',
          visibility: 'hidden',
        },
        '&:hover': {
          backgroundColor: 'hover.default',
        },
        [`&.${optionClasses.selected}`]: {
          color: 'text.primary',
          '&::after': {
            visibility: 'visible',
          },
        },
      }}
    />
  );
}

const Popup = styled('div')`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
`;

interface Props<T extends {} = SelectOption, Multiple extends boolean = false>
  extends SelectProps<T, Multiple> {
  options?: SelectOption[];
  fullWidth?: boolean;
  px?: number;
  height?: number;
  /** Distance between a popup and the trigger element */
  popupOffset?: number;
  sx?: BoxProps['sx'];
}

export function Select<
  Value = number | string,
  Multiple extends boolean = false,
>({
  options,
  fullWidth,
  px = 20,
  height = 48,
  popupOffset = 8,
  listBoxSx,
  ...props
  // @ts-ignore
}: Props<Value, Multiple> & {
  listBoxSx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Box
      // @ts-ignore
      component={BaseSelect<Value, Multiple>}
      slots={{
        root: Button,
        popup: Popup,
        listbox: AnimatedListbox,
      }}
      slotProps={{
        popup: {
          disablePortal: true,
          middleware: [
            offset(popupOffset),
            shift(),
            flip(),
            size({
              apply({ availableWidth, availableHeight, elements, rects }) {
                Object.assign(elements.floating.style, {
                  maxWidth: `${availableWidth}px`,
                  maxHeight: `${availableHeight}px`,
                  minWidth: `${rects.reference.width}px`,
                });
              },
            }),
          ],
        },
        root: {
          sx: {
            padding: theme.spacing(0, px),
            height,
            ...(fullWidth
              ? {
                  display: 'flex',
                  width: '100%',
                }
              : {}),
          },
        },
        listbox: {
          style: {
            borderRadius: popupOffset ? 12 : theme.spacing(0, 0, 12, 12),
          },
          sx: listBoxSx,
        },
      }}
      {...props}
    >
      {options?.map((option) => (
        <Box component={OptionStyle} key={option.key} value={option.key}>
          {option.value}
        </Box>
      ))}
    </Box>
  );
}
