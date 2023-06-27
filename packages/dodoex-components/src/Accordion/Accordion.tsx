import { Box, BoxProps } from '@mui/system';
import { AccordionItem as Item } from '@szhsin/react-accordion';
import type { AccordionItemProps as ItemProps } from '@szhsin/react-accordion';
import { merge } from 'lodash';
export { Accordion } from '@szhsin/react-accordion';

export type { AccordionProps } from '@szhsin/react-accordion';

export interface AccordionItemProps extends ItemProps {
  sx?: BoxProps;
}

export function AccordionItem({
  sx,
  buttonProps,
  ...props
}: AccordionItemProps) {
  return (
    <Box<any>
      component={Item}
      sx={merge(
        {
          '& button': {
            p: 0,
            border: 'none',
            width: '100%',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          },
        },
        sx,
      )}
      buttonProps={{
        className: ({ isEnter }) => `${isEnter ? 'active' : ''}`,
        ...buttonProps,
      }}
      {...props}
    />
  );
}
