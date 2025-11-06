import { Box, BoxProps, useTheme } from '@dodoex/components';

export interface FilterGroupProps<T> {
  filterList: Array<{
    label: string;
    value: T;
  }>;
  value: T;
  onChange: (value: T) => void;
  sx?: BoxProps['sx'];
}

export const FilterGroup = <T extends string>(props: FilterGroupProps<T>) => {
  const { filterList, value, onChange, sx } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      {filterList.map((filter, index) => {
        return (
          <Box
            key={filter.value}
            sx={{
              borderLeftWidth: 1,
              borderRightWidth: index === filterList.length - 1 ? 1 : 0,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: theme.palette.border.main,
              borderStyle: 'solid',
              typography: 'body2',
              lineHeight: '30px',
              color: theme.palette.text.secondary,
              px: 20,
              cursor: 'pointer',
              borderTopLeftRadius: index === 0 ? 8 : 0,
              borderBottomLeftRadius: index === 0 ? 8 : 0,
              borderTopRightRadius: index === filterList.length - 1 ? 8 : 0,
              borderBottomRightRadius: index === filterList.length - 1 ? 8 : 0,
              ...(value === filter.value
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
            onClick={() => onChange(filter.value)}
          >
            {filter.label}
          </Box>
        );
      })}
    </Box>
  );
};
