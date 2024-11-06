import { Box, BoxProps, Button, useTheme } from '@dodoex/components';

export const CardWrapper = ({
  sx,
  children,
}: {
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 16,
        padding: 20,
        backgroundColor: theme.palette.background.paper,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export function InnerCardWrapper({
  children,
  sx,
  innerSx,
}: {
  children: React.ReactNode;
  sx?: BoxProps['sx'];
  innerSx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 20,
        py: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 6,
        backgroundColor: theme.palette.background.tag,
        borderRadius: 16,
        [theme.breakpoints.up('tablet')]: {
          backgroundColor: theme.palette.background.paper,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: '50%',
        },
      }}
    >
      {children}
    </Box>
  );
}

export const OperateButton = ({
  disabled,
  sx,
  children,
  onClick,
}: {
  disabled?: boolean;
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  const theme = useTheme();

  return (
    <Button
      size={Button.Size.middle}
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: 'none',
        fontSize: 12,
        lineHeight: '17px',
        fontWeight: 600,
        paddingTop: 7,
        paddingRight: 0,
        paddingBottom: 7,
        paddingLeft: 0,
        width: '100%',
        flex: '1 1 auto',
        borderRadius: 8,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paperDarkContrast,
        '&[disabled]': {
          backgroundColor: theme.palette.background.paperDarkContrast,
          color: theme.palette.text.disabled,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export function Item({
  title,
  children,
  wrapperSx,
  sx,
}: {
  title: string;
  children: React.ReactNode;
  component?: BoxProps['component'];
  wrapperSx?: BoxProps['sx'];
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        typography: 'body2',
        color: theme.palette.text.secondary,
        ...wrapperSx,
      }}
    >
      <Box
        sx={{
          color: theme.palette.text.secondary,
          typography: 'body2',
          fontWeight: 500,
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'center',
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
