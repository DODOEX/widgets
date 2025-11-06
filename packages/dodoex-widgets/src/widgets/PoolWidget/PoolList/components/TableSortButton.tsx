import { Box, ButtonBase, useTheme } from '@dodoex/components';

export interface TableSortButtonProps {
  direction: 'asc' | 'desc' | undefined;
  children: React.ReactNode;
  onClick: () => void;
}

export const TableSortButton = (props: TableSortButtonProps) => {
  const { direction, children, onClick } = props;
  const theme = useTheme();

  return (
    <Box
      component={ButtonBase}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        typography: 'h6',
        lineHeight: '20px',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
      }}
      onClick={onClick}
    >
      {children}
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
            direction === 'asc'
              ? theme.palette.text.primary
              : theme.palette.text.disabled
          }
        />
        <path
          d="M5.0625 12.1753L5.98781 11.25L9 14.2556L12.0122 11.25L12.9375 12.1753L9 16.1128L5.0625 12.1753Z"
          fill={
            direction === 'desc'
              ? theme.palette.text.primary
              : theme.palette.text.disabled
          }
        />
      </svg>
    </Box>
  );
};
