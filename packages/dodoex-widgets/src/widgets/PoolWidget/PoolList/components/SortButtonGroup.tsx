import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { useState } from 'react';

export interface SortButtonGroupProps {
  children: React.ReactNode;
  sortList: Array<{
    label: string;
    direction: 'asc' | 'desc' | undefined;
    onClick: () => void;
  }>;
  sx?: BoxProps['sx'];
}

export const SortButtonGroup = ({
  children,
  sortList,
  sx,
}: SortButtonGroupProps) => {
  const theme = useTheme();

  const [sortButtonGroupVisible, setSortButtonGroupVisible] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          ...sx,
        }}
      >
        {children}
        <Box
          component={ButtonBase}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.border.main,
            backgroundColor: sortButtonGroupVisible
              ? theme.palette.background.tag
              : 'transparent',
            color: sortButtonGroupVisible
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
            [theme.breakpoints.up('tablet')]: {
              display: 'none',
            },
          }}
          onClick={() => setSortButtonGroupVisible(!sortButtonGroupVisible)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M9.16662 16.836C8.88731 16.836 8.65037 16.7387 8.45578 16.5441C8.2612 16.3496 8.16391 16.1126 8.16391 15.8333V10.8931L3.37037 4.76623C3.11551 4.43207 3.07682 4.08144 3.25432 3.71436C3.43169 3.34741 3.73578 3.16394 4.16662 3.16394H15.8333C16.2641 3.16394 16.5682 3.34741 16.7456 3.71436C16.9231 4.08144 16.8844 4.43207 16.6295 4.76623L11.836 10.8931V15.8881C11.836 16.1574 11.7454 16.3828 11.5641 16.5641C11.3827 16.7454 11.1574 16.836 10.8881 16.836H9.16662ZM9.99995 10.1504L13.9954 5.05977H6.00453L9.99995 10.1504Z"
              fill="currentColor"
            />
          </svg>
        </Box>
      </Box>

      {sortButtonGroupVisible && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.up('tablet')]: {
              display: 'none',
            },
          }}
        >
          {sortList.map((filter, index) => {
            return (
              <Box
                key={filter.label}
                component={ButtonBase}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  borderLeftWidth: 1,
                  borderRightWidth: index === sortList.length - 1 ? 1 : 0,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: theme.palette.border.main,
                  borderStyle: 'solid',
                  typography: 'h6',
                  lineHeight: '30px',
                  color: theme.palette.text.secondary,
                  px: 20,
                  borderTopLeftRadius: index === 0 ? 8 : 0,
                  borderBottomLeftRadius: index === 0 ? 8 : 0,
                  borderTopRightRadius: index === sortList.length - 1 ? 8 : 0,
                  borderBottomRightRadius:
                    index === sortList.length - 1 ? 8 : 0,
                  ...(filter.direction !== undefined
                    ? {
                        backgroundColor: theme.palette.border.disabled,
                        color: theme.palette.text.primary,
                      }
                    : {}),

                  [theme.breakpoints.down('tablet')]: {
                    flexGrow: 1,
                    flexBasis: '25%',
                    textAlign: 'center',
                  },
                }}
                onClick={filter.onClick}
              >
                {filter.label}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M5.0625 5.82469L5.98781 6.75L9 3.74438L12.0122 6.75L12.9375 5.82469L9 1.88719L5.0625 5.82469Z"
                    fill={
                      filter.direction === 'asc'
                        ? theme.palette.text.primary
                        : theme.palette.text.disabled
                    }
                  />
                  <path
                    d="M5.0625 12.1753L5.98781 11.25L9 14.2556L12.0122 11.25L12.9375 12.1753L9 16.1128L5.0625 12.1753Z"
                    fill={
                      filter.direction === 'desc'
                        ? theme.palette.text.primary
                        : theme.palette.text.disabled
                    }
                  />
                </svg>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
};
